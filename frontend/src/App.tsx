import React, { useState } from "react";
import Layout from "./components/Layout";
import GenerateForm from "./components/GenerateForm";
import CritiqueSection from "./components/CritiqueSection";
import ProjectsSection from "./components/ProjectsSection";
import ProjectDashboard from "./components/ProjectDashboard";
import type { Project } from "./components/ProjectDashboard";

type TabType = 'generate' | 'critique' | 'projects';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('generate');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const tabs = [
    {
      id: 'generate' as TabType,
      label: 'Generate',
      description: 'Create new content',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      )
    },
    {
      id: 'critique' as TabType,
      label: 'Critique',
      description: 'Review existing content',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      id: 'projects' as TabType,
      label: 'Projects',
      description: 'Manage projects',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      )
    }
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            AI-Powered Content Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Generate high-quality content and receive expert critiques with our advanced AI suite. 
            Built for professionals who demand excellence.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              AI Ready
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Phase 2: Navigation Complete
            </div>
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="mb-8">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <nav className="flex space-x-2" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex-1 flex items-center justify-center space-x-2 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                    ${activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {selectedProject ? (
            <ProjectDashboard project={selectedProject} onBack={() => setSelectedProject(null)} />
          ) : (
            <>
              {activeTab === 'generate' && <GenerateForm />}
              {activeTab === 'critique' && <CritiqueSection />}
              {activeTab === 'projects' && <ProjectsSection onSelect={setSelectedProject} />}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default App;
