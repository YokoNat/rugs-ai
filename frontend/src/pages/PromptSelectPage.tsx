import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Prompt } from "../types";
import PromptModal from "../components/PromptModal";

const API_BASE = "http://localhost:8000";

const PromptSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const returnTo: string = location.state?.returnTo || "/";
  const promptType: string = location.state?.promptType || "generation";

  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(()=>{
     const stored=sessionStorage.getItem(`selectedPrompts_${promptType}`);
     if(stored){
       try{
         const arr: string[] = JSON.parse(stored);
         setSelected(new Set(arr));
       }catch{}
     }
  },[promptType]);

  const fetchPrompts = async () => {
    try {
      const res = await fetch(`${API_BASE}/prompts/`);
      const data = await res.json();
      setPrompts(data.filter((p: Prompt) => p.type === promptType));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, [promptType]);

  const toggle = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const confirm = () => {
    sessionStorage.setItem(`selectedPrompts_${promptType}`, JSON.stringify(Array.from(selected)));
    navigate(returnTo);
  };

  const handleSaved = (prompt: Prompt) => {
    setPrompts(prev => [...prev, prompt]);
    setSelected(prev => new Set(prev).add(prompt.id));
  };

  const selectedPrompts = prompts.filter(p => selected.has(p.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold">Select {promptType.charAt(0).toUpperCase() + promptType.slice(1)} Prompts</h2>

      {/* Selected chips */}
      {selectedPrompts.length > 0 && (
        <div className="bg-buff-800 p-4 rounded-xl">
          <h3 className="text-sm font-medium text-buff-200 mb-2">Selected ({selectedPrompts.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedPrompts.map(p => (
              <span key={p.id} className="flex items-center bg-buff-600 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                {p.title}
                <button className="ml-2 text-buff-200 hover:text-white" onClick={() => toggle(p.id)}>×</button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => setShowAdd(true)}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-105 transition-all"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add New Prompt
        </button>

        <button 
          onClick={confirm} 
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all"
        >
          Confirm & Return
        </button>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="p-4 bg-white rounded-xl shadow border border-gray-200 space-y-2">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{prompt.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {prompt.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 rounded px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{prompt.content.slice(0, 150)}...</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={selected.has(prompt.id)} 
                  onChange={() => toggle(prompt.id)} 
                  className="h-5 w-5 text-indigo-600 ml-4" 
                />
              </div>
            </div>
          ))}
          {prompts.length === 0 && <p className="text-gray-500">No {promptType} prompts yet.</p>}
        </div>
      )}

      {showAdd && (
        <PromptModal
          type={promptType as "generation" | "critique" | "planner"}
          onClose={() => setShowAdd(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default PromptSelectPage; 