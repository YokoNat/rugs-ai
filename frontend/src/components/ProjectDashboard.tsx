import React, { useState, useEffect } from "react";
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

  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description || "");

  /* --------------------------------------------------
   * History & Undo / Redo handling
   * -------------------------------------------------- */
  type Snapshot = { title: string; description: string; tab: SubTab };
  const initialSnapshot: Snapshot = { title: project.title, description: project.description || "", tab };
  const [history, setHistory] = useState<Snapshot[]>([initialSnapshot]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushSnapshot = (snap: Snapshot) => {
    setHistory(prev => {
      const newHist = prev.slice(0, historyIndex + 1);
      newHist.push(snap);
      return newHist;
    });
    setHistoryIndex(idx => idx + 1);
  };

  // Saved baseline – used for Cancel
  const [savedState, setSavedState] = useState<Snapshot>(initialSnapshot);

  useEffect(()=>{
    setTitle(project.title);
    setDescription(project.description || "");
  },[project.id]);

  const hasChanges = title.trim() !== project.title || description.trim() !== (project.description||"");

  /* --------------------------------------------------
   * Actions
   * -------------------------------------------------- */

  const handleSave = async () => {
    if(!hasChanges) return;
    try{
      await fetch(`http://localhost:8000/projects/${project.id}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title:title.trim(), description:description.trim()})
      });
      const snap: Snapshot = { title: title.trim(), description: description.trim(), tab };
      setSavedState(snap);
      pushSnapshot(snap);
    }catch(err){
      console.error("Failed updating project",err);
    }
  };

  const saveChanges = async () => {
    await handleSave();
  };

  const changeTab = (t: SubTab)=>{
    setTab(t);
    sessionStorage.setItem('projectTab', t);
    pushSnapshot({ title, description, tab: t });
  };

  const tabs: { id: SubTab; label: string }[] = [
    { id: "planner", label: "Planner" },
    { id: "generate", label: "Generate" },
    { id: "critique", label: "Critique" },
  ];

  /* Undo / Redo */
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const handleUndo = () => {
    if(!canUndo) return;
    const newIdx = historyIndex - 1;
    setHistoryIndex(newIdx);
    const snap = history[newIdx];
    setTitle(snap.title);
    setDescription(snap.description);
    setTab(snap.tab);
    sessionStorage.setItem('projectTab', snap.tab);
  };

  const handleRedo = () => {
    if(!canRedo) return;
    const newIdx = historyIndex + 1;
    setHistoryIndex(newIdx);
    const snap = history[newIdx];
    setTitle(snap.title);
    setDescription(snap.description);
    setTab(snap.tab);
    sessionStorage.setItem('projectTab', snap.tab);
  };

  const handleCancel = () => {
    setTitle(savedState.title);
    setDescription(savedState.description);
    setTab(savedState.tab);
    sessionStorage.setItem('projectTab', savedState.tab);
    pushSnapshot(savedState);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Back Button */}
        <button
          onClick={async ()=>{await saveChanges(); onBack();}}
          className="inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow hover:opacity-90 transition"
        >
          <svg
            className="h-5 w-5 mr-2"
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

        {/* Undo / Redo / Cancel / Save */}
        <div className="flex items-center gap-2">
          <button onClick={handleUndo} disabled={!canUndo} className="btn btn-primary disabled:opacity-40">Undo</button>
          <button onClick={handleRedo} disabled={!canRedo} className="btn btn-primary disabled:opacity-40">Redo</button>
          <button onClick={handleCancel} className="btn btn-danger">Cancel</button>
          <button onClick={handleSave} className="btn btn-primary">Save</button>
        </div>
      </div>

      {/* Title & Description */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input value={title} onChange={e=>{setTitle(e.target.value); pushSnapshot({title:e.target.value, description, tab});}} className="w-full text-lg font-semibold border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea value={description} onChange={e=>{setDescription(e.target.value); pushSnapshot({title, description:e.target.value, tab});}} className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
        </div>
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