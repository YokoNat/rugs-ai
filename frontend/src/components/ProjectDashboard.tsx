import React, { useState } from "react";
import GenerateForm from "./GenerateForm";
import CritiqueSection from "./CritiqueSection";
import PlannerSection from "./PlannerSection";

export interface Project {
  id: string;
  title: string;
  description?: string;
  custom_instructions?: string;
  planning?: string;
}

interface Props {
  project: Project;
  onBack: () => void;
}

const ProjectDashboard: React.FC<Props> = ({ project, onBack }) => {
  type SubTab = "generate" | "critique" | "planner";
  const [tab, setTab] = useState<SubTab>(() => (sessionStorage.getItem('projectTab') as SubTab) || "generate");

  const changeTab = (t: SubTab)=>{
    setTab(t);
    sessionStorage.setItem('projectTab', t);
  };

  const tabs: { id: SubTab; label: string }[] = [
    { id: "planner", label: "Planner" },
    { id: "generate", label: "Generate" },
    { id: "critique", label: "Critique" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            className="h-4 w-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Projects
        </button>
        <h2 className="text-2xl font-semibold">{project.title}</h2>
      </div>

      {/* Sub Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-4" aria-label="Sub Tabs">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTab(t.id)}
              className={`px-3 py-2 font-medium text-sm rounded-t-md focus:outline-none ${
                tab === t.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {tab === "generate" && <GenerateForm />}
      {tab === "planner" && (
        <PlannerSection projectId={project.id} projectTitle={project.title} />
      )}
      {tab === "critique" && <CritiqueSection />}
    </div>
  );
};

export default ProjectDashboard; 