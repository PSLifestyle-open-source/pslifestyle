import { QuestionType } from "@pslifestyle/common/src/schemas";

const getIsShowFootprintBarChart = (question: QuestionType) => {
  if (!question) return false;

  return question?.label !== "demographic";
};

export default getIsShowFootprintBarChart;
