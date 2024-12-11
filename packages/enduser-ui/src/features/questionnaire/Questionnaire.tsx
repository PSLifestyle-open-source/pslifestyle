import { useAppDispatch } from "../../app/store";
import FootprintBarChart from "../../common/components/FootprintBarChart";
import {
  FullWidthContainer,
  WideWidthContainer,
} from "../../common/components/layout/Container";
import { ContainerLoader } from "../../common/components/loaders/ContainerLoader";
import Message from "../../common/components/ui/Message";
import Paragraph from "../../common/components/ui/Paragraph";
import { usePersistUserAnswers } from "../../common/hooks/firebaseHooks";
import IntroToQuestionnaireCategory from "./IntroToQuestionnaireCategory";
import OutroOfQuestionnaire from "./OutroOfQuestionnaire";
import Question from "./Question";
import QuestionnaireControls from "./QuestionnaireControls";
import QuestionnaireProgressIndicator from "./QuestionnaireProgressIndicator";
import {
  questionnaireActions,
  questionnaireSelectors,
} from "./questionnaireSlice";
import { createAnswersBuilder } from "@pslifestyle/common/src/dataBuilders/answersBuilder";
import { QuestionType } from "@pslifestyle/common/src/schemas";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface Props {
  questions: QuestionType[];
  constants: Record<string, number>;
}

const getIsShowFootprintBarChart = (question: QuestionType) => {
  if (!question) return false;

  return question?.label !== "demographic";
};

const Questionnaire: React.FC<Props> = ({ questions, constants }) => {
  // @TODO: Does this do anything? Are the questions and constants props even needed?
  const calculator = useCallback(
    () => createAnswersBuilder(questions, constants),
    [questions, constants],
  );

  calculator().buildAnswers([]);

  const dispatch = useAppDispatch();
  const isQuestionnaireCompleted = useSelector(
    questionnaireSelectors.isQuestionnaireCompleted,
  );
  const currentQuestion = useSelector(questionnaireSelectors.currentQuestion);
  const categoryToIntroduce = useSelector(
    questionnaireSelectors.categoryToIntroduce,
  );
  const currentQuestionIndex = useSelector(questionnaireSelectors.currentIndex);
  const availableQuestions = useSelector(
    questionnaireSelectors.availableQuestions,
  );
  const questionnaireProgress = useSelector(
    questionnaireSelectors.questionnaireProgress,
  );
  const isCurrentQuestionAnswered = useSelector(
    questionnaireSelectors.isCurrentQuestionAnswered,
  );
  const categorizedFootprint = useSelector(
    questionnaireSelectors.categorizedFootprint,
  );

  const changeToPreviousQuestion = useCallback(
    () => dispatch(questionnaireActions.changeToPreviousQuestion()),
    [dispatch],
  );
  const changeToNextQuestion = useCallback(
    () => dispatch(questionnaireActions.changeToNextQuestion()),
    [dispatch],
  );
  const acknowledgeCategory = useCallback(
    () => dispatch(questionnaireActions.acknowledgeCategory()),
    [dispatch],
  );

  const { t } = useTranslation(["questionnaire", "common"]);
  const {
    sendAnswersToBackend,
    state: saveAnswersState,
    reset: resetSaveAnswersState,
  } = usePersistUserAnswers();
  const navigate = useNavigate();

  useEffect(() => {
    if (saveAnswersState.success) {
      resetSaveAnswersState();
      navigate("/results");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveAnswersState.success]);

  const isShowFootprintBarChart =
    !isQuestionnaireCompleted &&
    Object.values(categorizedFootprint).some(
      (categoryFootprint) => categoryFootprint !== 0,
    ) &&
    getIsShowFootprintBarChart(currentQuestion);

  if (!availableQuestions.length || saveAnswersState.success) {
    return null;
  }

  if (saveAnswersState.error) {
    return <Message text={t("error.general", { ns: "common" })} />;
  }

  return (
    <ContainerLoader loading={saveAnswersState.loading}>
      <>
        {isQuestionnaireCompleted && (
          <OutroOfQuestionnaire
            onBackClick={changeToPreviousQuestion}
            onFinishQuestionnaireClick={sendAnswersToBackend}
          />
        )}
        {isShowFootprintBarChart && (
          <FullWidthContainer>
            <WideWidthContainer className="py-2">
              <Paragraph
                type="body-md"
                data-cy="currentFootprint.totalFootprint"
                className="text-center mt-2 mb-3"
              >
                {t("currentFootprintDuringTest", {
                  footprintInNumber: (
                    Number(
                      Object.values(categorizedFootprint).reduce(
                        (sum, categoryFootprint) => sum + categoryFootprint,
                      ),
                    ) || 0
                  ).toFixed(),
                })}
              </Paragraph>
              <FootprintBarChart categorizedFootprint={categorizedFootprint} />
            </WideWidthContainer>
          </FullWidthContainer>
        )}
        {categoryToIntroduce && (
          <IntroToQuestionnaireCategory
            category={categoryToIntroduce}
            onBackClick={changeToPreviousQuestion}
            onPrimaryButtonClick={acknowledgeCategory}
            onFinishQuestionnaireClick={sendAnswersToBackend}
            visibleQuestionIndex={currentQuestionIndex}
          />
        )}
        {!categoryToIntroduce && !isQuestionnaireCompleted && (
          <>
            <FullWidthContainer style={{ paddingBottom: "90px" }}>
              <Question question={currentQuestion} />
            </FullWidthContainer>
            <QuestionnaireControls
              current={currentQuestionIndex + 1}
              total={availableQuestions.length}
              back={changeToPreviousQuestion}
              next={
                !isQuestionnaireCompleted && isCurrentQuestionAnswered
                  ? changeToNextQuestion
                  : undefined
              }
            >
              <QuestionnaireProgressIndicator
                progress={questionnaireProgress}
              />
            </QuestionnaireControls>
          </>
        )}
      </>
    </ContainerLoader>
  );
};

export default Questionnaire;
