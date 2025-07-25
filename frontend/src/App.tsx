import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { SettingsProvider } from "./context/SettingsContext";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import PromptLibrary from "./pages/PromptLibrary";
import CritiqueToolPage from "./pages/CritiqueToolPage";
import PlannerToolPage from "./pages/PlannerToolPage";
import SettingsPage from "./pages/SettingsPage";
import SupplementalInfoPage from "./pages/SupplementalInfoPage";
import SupplementSelectPage from "./pages/SupplementSelectPage";
import PromptSelectPage from "./pages/PromptSelectPage";

const App: React.FC = () => {
  return (
    <SettingsProvider>
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/prompts" element={<PromptLibrary />} />
        <Route path="/planner" element={<PlannerToolPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/supplementals" element={<SupplementalInfoPage />} />
        <Route path="/supplementals/select" element={<SupplementSelectPage />} />
        <Route path="/prompts/select" element={<PromptSelectPage />} />
        <Route path="/critique" element={<CritiqueToolPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
    </SettingsProvider>
  );
};

export default App;
