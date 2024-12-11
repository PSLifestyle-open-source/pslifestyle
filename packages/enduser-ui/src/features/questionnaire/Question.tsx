import { useAppDispatch } from "../../app/store";
import { WideWidthContainer } from "../../common/components/layout/Container";
import Heading from "../../common/components/ui/Heading";
import ButtonLarge from "../../common/components/ui/buttons/ButtonLarge";
import { locationSelectors } from "../location/locationSlice";
import { userPlanActions } from "../plan/userPlanSlice";
import Description from "./Description";
import CyanButton from "./QuestionnaireButton/CyanButton";
import GreenButton from "./QuestionnaireButton/GreenButton";
import OrangeButton from "./QuestionnaireButton/OrangeButton";
import PinkButton from "./QuestionnaireButton/PinkButton";
import PurpleButton from "./QuestionnaireButton/PurpleButton";
import { QuestionnaireButtonProps } from "./QuestionnaireButton/QuestionnaireButton";
import QuestionnaireCategoryHeader from "./QuestionnaireCategoryHeader";
import { generateChoiceTextFromOptional } from "./helpers/generateChoiceTextFromOptional";
import {
  questionnaireActions,
  questionnaireSelectors,
} from "./questionnaireSlice";
import getCategoryFromSortKey from "@pslifestyle/common/src/helpers/getCategoryFromSortKey";
import {
  QuestionType,
  QuestionChoiceType,
} from "@pslifestyle/common/src/schemas";
import { Category } from "@pslifestyle/common/src/types/genericTypes";
import { NewAnswer } from "@pslifestyle/common/src/types/questionnaireTypes";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

interface Props {
  question: QuestionType;
}

const ChoiceComponents: {
  [key in Category]: React.FC<QuestionnaireButtonProps>;
} = {
  housing: OrangeButton,
  transport: PurpleButton,
  food: PinkButton,
  purchases: CyanButton,
  demographic: GreenButton,
};

const isActiveAnswer = (
  answers: NewAnswer[],
  question: QuestionType,
  choice: string,
) => {
  const answerToCheck = answers.find(
    (answer) => answer.questionId === question.id,
  );
  return choice === answerToCheck?.choiceText;
};

interface IQuestionChoiceProps {
  question: QuestionType;
  choice: QuestionChoiceType;
  onClick: (choiceText: string) => void;
}

const QuestionChoice = ({
  choice,
  question,
  onClick,
}: IQuestionChoiceProps) => {
  const country = useSelector(locationSelectors.country);
  const { t } = useTranslation(["questionAndRecommendationTranslations"]);
  const answers = useSelector(questionnaireSelectors.answers);

  const ChoiceComponent =
    ChoiceComponents[
      getCategoryFromSortKey(question.sortKey || "01") || "demographic"
    ];

  return (
    <ChoiceComponent
      onClick={() => onClick(choice.choiceText)}
      choiceId={choice.choiceTranslationKey}
      active={isActiveAnswer(answers, question, choice.choiceText)}
    >
      {t(`${choice.choiceTranslationKey}_${country?.code}`, {
        ns: "questionAndRecommendationTranslations",
      })}
    </ChoiceComponent>
  );
};

const Question: React.FC<Props> = ({ question }) => {
  const country = useSelector(locationSelectors.country);
  const dispatch = useAppDispatch();
  const handleClick = useCallback(
    (choiceText: string) => {
      dispatch(userPlanActions.resetUserPlan());
      dispatch(
        questionnaireActions.addAnswer({
          questionId: question.id,
          sortKey: question.sortKey,
          choiceText,
        }),
      );
    },
    [dispatch, question.id, question.sortKey],
  );
  const { t } = useTranslation([
    "common",
    "questionAndRecommendationTranslations",
  ]);
  const [age, setAge] = useState<number>();

  if (!question) return null;

  // if the question coming from DB doesn't have multiple answers
  // ignore it, don't render it, cause the user won't be able to answer anyway
  if (!question.choices) return null;
  return (
    <WideWidthContainer className="px-4">
      <QuestionnaireCategoryHeader sortKey={question.sortKey} />
      <div
        key={question.id}
        data-cy={`question.${question.id}`}
        className="flex flex-col justify-center items-center child:pb-6"
      >
        <Heading level={1} type="headline-sm-b" className="text-center">
          {t(`${question.id}_${country?.code}`, {
            ns: "questionAndRecommendationTranslations",
          })}
        </Heading>

        <Description
          descriptionTranslationKey={question.descriptionTranslationKey}
          country={country!}
        />
        {question.variableName !== "DEMOGRAPHIC_AGE" ? (
          <div className="w-full flex flex-col items-center gap-2">
            {/* if multiple options to choose from */}
            {question.choices.map((choice: QuestionChoiceType) => (
              <QuestionChoice
                question={question}
                choice={choice}
                onClick={handleClick}
                key={choice.choiceText}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            <div className="flex items-end justify-between w-full h-8">
              <p className="text-xs">0</p>
              <p className="text-heading-lg font-black text-green-100">{age}</p>
              <p className="text-xs">100</p>
            </div>
            {/* if multiple options to choose from */}
            <input
              type="range"
              min="0"
              max={100}
              step="1"
              value={age ?? 50}
              // Nested ternary was not used becasue it is not allowed by no-nested-ternary
              onChange={(event) =>
                setAge(Number((event.target as HTMLInputElement).value))
              }
              className="mb-4"
            />
            <ButtonLarge
              cyData="setDemographicAge.button"
              theme="goalCTA"
              onClick={() =>
                age && handleClick(generateChoiceTextFromOptional(age))
              }
            >
              {t(`submit`, { ns: "common" })}
            </ButtonLarge>
          </div>
        )}
      </div>
    </WideWidthContainer>
  );
};

export default Question;
