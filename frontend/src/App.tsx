import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectPage from "./pages/ProjectPage";
import PromptLibrary from "./pages/PromptLibrary";
import CritiqueToolPage from "./pages/CritiqueToolPage";
import PlannerToolPage from "./pages/PlannerToolPage";

const App: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectPage />} />
        <Route path="/prompts" element={<PromptLibrary />} />
        <Route path="/planner" element={<PlannerToolPage />} />
        <Route path="/critique" element={<CritiqueToolPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

export default App;
