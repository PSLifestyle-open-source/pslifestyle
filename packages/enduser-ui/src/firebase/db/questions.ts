import { locationSelectors } from "../../features/location/locationSlice";
import { buildQuery, getDocs } from "../FirestoreClient";
import { defaultSWRConfig } from "../swrConfig";
import { queryLatestEntityVersion } from "./common";
import { Country } from "@pslifestyle/common/src/models/countries";
import { QuestionType } from "@pslifestyle/common/src/schemas";
import { orderBy } from "firebase/firestore";
import { useSelector } from "react-redux";
import useSWR from "swr";

export const fetchQuestionsForCountry = async (
  country: Country,
): Promise<[string, QuestionType[]]> => {
  const collectionName = "questions";
  const questionSetVersion = await queryLatestEntityVersion(collectionName);

  // Second query for the actual questions
  const queryPath = `${collectionName}/${questionSetVersion}/${country.code}/`;
  const queryQuestions = buildQuery(queryPath, orderBy("sortKey"));
  const queryResults = await getDocs(await queryQuestions);
  const questions = queryResults.docs;
  // const questionsFromDb: QuestionType[] = questions.filter(Boolean).map((question) => ({ id: question.id, data: question.data() }));
  const questionsFromDb: QuestionType[] = questions
    .filter(Boolean)
    .map((question) => question.data() as QuestionType);
  if (!questionsFromDb.length) {
    throw new Error("Problem with fetching questions");
  }

  return [questionSetVersion, questionsFromDb];
};

export const useQuestionsForCurrentCountry = () => {
  const country = useSelector(locationSelectors.country);

  return useSWR(
    country ? ["fetchQuestions", country] : null,
    ([_, selectedCountry]) => fetchQuestionsForCountry(selectedCountry),
    defaultSWRConfig,
  );
};
