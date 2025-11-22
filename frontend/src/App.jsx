import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "./layout/AuthLayout.jsx";
import MainLayout from "./layout/MainLayout.jsx";

import LoginPage from "./pages/LoginPage.jsx";
import Story from "./pages/Story.jsx";
import Overview from "./pages/Overview.jsx";
import KnowledgePage from "./pages/KnowledgePage.jsx";

import AvatarSetup from "./pages/avatarCreation/AvatarSetup.jsx";
import OnboardingQuestions from "./pages/avatarCreation/OnboardingQuestions.jsx";
import HouseSelection from "./pages/avatarCreation/HouseSelection.jsx";

function App() {
  const isLoggedIn = true;
  const isNewUser = false;

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth-Bereich: Login + Onboarding/Avatar */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />

          {/* Onboarding-Schritte */}
          <Route path="/avatar" element={<AvatarSetup />} />
          <Route path="/avatar/questions" element={<OnboardingQuestions />} />
          <Route path="/avatar/house" element={<HouseSelection />} />
        </Route>

        {/* Hauptbereich mit Sidebar + 3 Pages */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Story />} />
          <Route path="story" element={<Story />} />
          <Route path="overview" element={<Overview />} />
          <Route path="knowledge" element={<KnowledgePage />} />
        </Route>

        {/* Standard-Weiterleitung */}
        <Route
          path="*"
          element={
            !isLoggedIn
              ? <Navigate to="/login" replace />
              : isNewUser
              ? <Navigate to="/avatar" replace />
              : <Navigate to="/app/story" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;