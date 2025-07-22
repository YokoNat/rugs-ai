import React, { useEffect, useState } from "react";
import type { Prompt } from "../types";
import PromptModal from "./PromptModal";
import MarkdownViewer from "./MarkdownViewer";
import SupplementModal from "./SupplementModal";
import ProgressBar from "./ProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import type { SupplementalInfo } from "../types";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface Props {
  projectId?: string;
  projectTitle?: string;
}

const API_BASE = "http://localhost:8000";

const PlannerSection: React.FC<Props> = ({ projectId, projectTitle }) => {
  const [topic, setTopic] = useState<string>(projectTitle || "");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [supplements,setSupplements]=useState<SupplementalInfo[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([]);

  useEffect(()=>{
    const idsJson=sessionStorage.getItem('selectedSupplements');
    if(idsJson){
      const ids:string[]=JSON.parse(idsJson);
      if(ids.length){
        fetch('http://localhost:8000/supplementals/').then(r=>r.json()).then((all:SupplementalInfo[])=>{
          setSupplements(all.filter(i=>ids.includes(i.id)));
          sessionStorage.removeItem('selectedSupplements');
        });
      }
    }
  },[]);

  useEffect(() => {
    const idsJson = sessionStorage.getItem('selectedPrompts_planner');
    if (idsJson) {
      const ids: string[] = JSON.parse(idsJson);
      if (ids.length) {
        fetch('http://localhost:8000/prompts/').then(r => r.json()).then((all: Prompt[]) => {
          setSelectedPrompts(all.filter(i => ids.includes(i.id)));
          sessionStorage.removeItem('selectedPrompts_planner');
        });
      }
    }
  }, []);

  useEffect(()=>{
    sessionStorage.setItem('selectedPrompts_planner', JSON.stringify(selectedPrompts.map(p=>p.id)));
  },[selectedPrompts]);

  useEffect(()=>{
    sessionStorage.setItem('selectedSupplements', JSON.stringify(supplements.map(s=>s.id)));
  },[supplements]);

  // Fetch planner prompts
  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await fetch(`${API_BASE}/prompts/`);
        const data: Prompt[] = await res.json();
        setPrompts(data.filter((p) => p.type === "planner"));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompts();
  }, []);

  // Fetch project title if in project context
  useEffect(() => {
    if (projectId && !projectTitle) {
      fetch(`${API_BASE}/projects/${projectId}`)
        .then((r) => r.json())
        .then((p) => setTopic(p.title))
        .catch(console.error);
    }
  }, [projectId, projectTitle]);

  const startPlan = async () => {
    if (selectedPrompts.length===0) {
      alert("Select or add a prompt first.");
      return;
    }
    if (!topic.trim()) {
      alert("Topic is required.");
      return;
    }
    setLoading(true);
    try {
      const supplementalText = supplements.map(s=>s.content).join("\n---\n");
      const res = await fetch(`${API_BASE}/planner/initial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, prompt_id: selectedPrompts[0]?.id, supplemental: supplementalText || null }),
      });
      const data = await res.json();
      setMessages([{ role: "assistant", content: data.outline } as Message]);
    } catch (err) {
      console.error(err);
      alert("Failed to generate outline.");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text) return;
    const supplementalText = supplements.map(s=>s.content).join("\n---\n");
    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/planner/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, prompt_id: selectedPrompts[0]?.id, supplemental: supplementalText || null, messages: newMessages, user_message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.outline } as Message]);
    } catch (err) {
      console.error(err);
      alert("Failed to continue outline.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProgressBar loading={loading} />
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-green-50 to-teal-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 7h10M7 17h6" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Plan Outline</h3>
              <p className="text-sm text-gray-600">Iteratively craft and refine your article structure</p>
            </div>
          </div>
        </div>

        {/* supplemental select via navigation */}

        <div className="p-8 space-y-6">
          <button
            type="button"
            onClick={() => navigate('/prompts/select', { state: { returnTo: location.pathname, promptType: 'planner' }})}
            className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Choose Prompts
          </button>

          {selectedPrompts.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              <span className="text-sm font-medium mr-2">Prompts:</span>
              {selectedPrompts.map(p => (
                <span key={p.id} className="flex items-center bg-buff-500 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                  {p.title}
                  <button className="ml-2 text-buff-200 hover:text-white" onClick={() => setSelectedPrompts(prev => prev.filter(pr => pr.id !== p.id))}>×</button>
                </span>
              ))}
            </div>
          )}

          {/* Topic */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Topic</label>
            <input
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 flex-wrap">
            <button
              type="button"
              onClick={()=> navigate('/supplementals/select', { state: { returnTo: location.pathname }})}
              className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Add Supplemental Info
            </button>

            {supplements.length>0 && (
              <div className="flex flex-wrap gap-2 w-full mt-2">
                <span className="text-sm font-medium mr-2">Supplemental:</span>
                {supplements.map(s=>(
                  <span key={s.id} className="flex items-center bg-buff-500 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                    {s.title}
                    <button className="ml-2 text-buff-200 hover:text-white" onClick={()=>setSupplements(prev=>prev.filter(p=>p.id!==s.id))}>×</button>
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={startPlan}
              disabled={loading}
              className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
            >
              {loading ? (
                <>Loading…</>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                  Start Plan
                </>
              )}
            </button>
          </div>

          {/* Chat Window */}
          <div className="space-y-4 mt-6">
            {messages.map((m, i) => {
              const bubbleClass =
                m.role === "user"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-50 text-gray-900";
              return (
                <div key={i} className={`p-4 rounded-lg ${bubbleClass}`}>
                  {m.role === "assistant" ? (
                    <MarkdownViewer content={m.content} />
                  ) : (
                    m.content
                  )}
                </div>
              );
            })}
          </div>

          {/* User Input */}
          <div className="space-y-2">
            <textarea
              className="w-full border border-gray-300 rounded px-3 py-2 min-h-[80px]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Your feedback…"
            />
            <button
              onClick={sendMessage}
              disabled={loading || !userInput.trim()}
              className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              Send
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <PromptModal
          type="planner"
          onClose={() => setShowModal(false)}
          onSaved={(p) => {
            setPrompts((prev) => [...prev, p]);
            setSelectedPrompt(p.id);
            setShowModal(false);
          }}
        />
      )}
    </>
  );
};

export default PlannerSection; 