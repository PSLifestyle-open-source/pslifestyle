import { useAppDispatch } from "../../app/store";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import Message from "../../common/components/ui/Message";
import { ButtonLarge } from "../../common/components/ui/buttons";
import { useCombinedConstantsForCurrentCountry } from "../../firebase/db/constants";
import { useQuestionsForCurrentCountry } from "../../firebase/db/questions";
import { locationSelectors } from "../location/locationSlice";
import Questionnaire from "./Questionnaire";
import { questionnaireActions } from "./questionnaireSlice";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const QuestionnairePage = (): JSX.Element => {
  const { t } = useTranslation(["common", "questionnaire"]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const country = useSelector(locationSelectors.country);
  const {
    data: questionsResponseData,
    error: questionsError,
    isLoading: isLoadingQuestions,
  } = useQuestionsForCurrentCountry();
  const {
    data: constantsResponseData,
    error: constantsError,
    isLoading: isLoadingConstants,
  } = useCombinedConstantsForCurrentCountry();

  useEffect(() => {
    if (!country) navigate("/selections");
  });

  useEffect(() => {
    if (!questionsResponseData || !constantsResponseData || !country) {
      return;
    }
    const [questionnaireVersion, questionnaireData] = questionsResponseData;
    const [constantsVersion, constantsData] = constantsResponseData;

    dispatch(
      questionnaireActions.initializeQuestionnaire({
        questions: questionnaireData,
        constants: constantsData,
        metadata: {
          questionnaireVersion,
          constantsVersion,
          countryCode: country.code,
        },
      }),
    );
  }, [questionsResponseData, constantsResponseData, country, dispatch]);

  return (
    <ContainerLoader loading={isLoadingConstants || isLoadingQuestions}>
      <div>
        {constantsError ||
        questionsError ||
        !questionsResponseData ||
        !constantsResponseData ? (
          <Message text={t("error.general", { ns: "common" })}>
            <ButtonLarge onClick={() => window.location.reload()}>
              {t("tryAgain", { ns: "common" })}
            </ButtonLarge>
          </Message>
        ) : (
          <Questionnaire
            questions={questionsResponseData[1]}
            constants={constantsResponseData[1]}
          />
        )}
      </div>
    </ContainerLoader>
  );
};

export default QuestionnairePage;
