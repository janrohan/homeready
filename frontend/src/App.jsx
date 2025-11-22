// src/App.jsx
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
import RegisterPage from "./pages/RegisterPage.jsx";

function App() {
  const token = localStorage.getItem("authToken");
  const isLoggedIn = !!token;

  const isNewUserStored = localStorage.getItem("isNewUser");
  const isNewUser = isNewUserStored === "true";

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth & onboarding, wrapped in AuthLayout */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
  path="/register"
  element={
    <AuthLayout>
      <RegisterPage />
    </AuthLayout>
  }
/>
        <Route
          path="/avatar"
          element={
            <AuthLayout>
              <AvatarSetup />
            </AuthLayout>
          }
        />
        <Route
          path="/avatar/questions"
          element={
            <AuthLayout>
              <OnboardingQuestions />
            </AuthLayout>
          }
        />
        <Route
          path="/avatar/house"
          element={
            <AuthLayout>
              <HouseSelection />
            </AuthLayout>
          }
        />

        {/* Main app with sidebar */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Story />} />
          <Route path="story" element={<Story />} />
          <Route path="overview" element={<Overview />} />
          <Route path="knowledge" element={<KnowledgePage />} />
        </Route>

        {/* Default redirect depending on login / onboarding state */}
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