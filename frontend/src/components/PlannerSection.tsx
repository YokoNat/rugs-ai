import React, { useEffect, useState } from "react";
import type { Prompt } from "../types";
import PromptModal from "./PromptModal";

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
    if (!selectedPrompt) {
      alert("Select or add a prompt first.");
      return;
    }
    if (!topic.trim()) {
      alert("Topic is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/planner/initial`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, prompt_id: selectedPrompt }),
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
    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setUserInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/planner/continue`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, prompt_id: selectedPrompt, messages: newMessages, user_message: text }),
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

      <div className="p-8 space-y-6">
        {/* Prompt Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium">Choose Prompt</label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            value={selectedPrompt || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val === "__custom") setShowModal(true);
              else setSelectedPrompt(val || null);
            }}
          >
            <option value="">— None —</option>
            <option value="__custom">Add Custom…</option>
            {prompts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
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
        </div>

        {/* Topic */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Topic</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        {/* Start Plan */}
        <button
          onClick={startPlan}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Start Plan"}
        </button>

        {/* Chat Window */}
        <div className="space-y-4 mt-6">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${m.role === "user" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-900"}`}
            >
              {m.content}
            </div>
          ))}
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
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerSection; 