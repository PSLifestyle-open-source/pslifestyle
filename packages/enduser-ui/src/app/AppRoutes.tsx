import NotFoundPage from "../common/pages/NotFoundPage";
import { AccountManagementPage } from "../features/auth/AccountManagementPage";
import { CheckLoginPage } from "../features/auth/CheckLoginPage";
import { LoginPage } from "../features/auth/LoginPage";
import { RequireAuth } from "../features/auth/RequireAuth";
import LandingPage from "../features/home/LandingPage";
import { CountryLanguageSelectionPage } from "../features/location/CountryLanguageSelectionPage";
import ManagementPanelPage from "../features/management/ManagementPanelPage";
import { PlanPage } from "../features/plan/PlanPage";
import QuestionnairePage from "../features/questionnaire/QuestionnairePage";
import RecommendationsPage from "../features/recommendations/RecommendationsPage";
import { CalculationBasisPage } from "../features/results/CalculationBasisPage";
import ResultsPage from "../features/results/ResultsPage";
import { InitializationWrapper } from "./InitializationWrapper";
import { Route, Routes } from "react-router-dom";

export const AppRoutes = () => (
  <Routes>
    <Route element={<InitializationWrapper />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/selections" element={<CountryLanguageSelectionPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/account"
        element={
          <RequireAuth>
            <AccountManagementPage />
          </RequireAuth>
        }
      />
      <Route
        path="/managementpanel"
        element={
          <RequireAuth>
            <ManagementPanelPage />
          </RequireAuth>
        }
      />
      <Route path="/test" element={<QuestionnairePage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/recommendations" element={<RecommendationsPage />} />
      <Route path="/plan" element={<PlanPage />} />
      <Route path="/calculationbasis" element={<CalculationBasisPage />} />
    </Route>
    <Route path="/checklogin" element={<CheckLoginPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);
