import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";

interface Props {
  mode: "prompt" | "supplement";
  onRefine: (text: string) => void;
  sourceText: string;
}

interface Message { role: "user" | "assistant"; content: string; }

const API_BASE = "http://localhost:8000";

const ChatbotContainer: React.FC<Props> = ({ mode, onRefine, sourceText }) => {
  const { prompt_system, supplement_system } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/assistant/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, text: sourceText, instruction: userMsg.content, system_prompt: mode==='prompt'? prompt_system : supplement_system }),
      });
      const data = await res.json();
      const assistantMsg: Message = { role: "assistant", content: data.refined };
      setMessages((prev) => [...prev, assistantMsg]);
      onRefine(data.refined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-primary-100 rounded-lg p-3 space-y-2 bg-primary-50">
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">AI</div>
        <h4 className="text-sm font-semibold capitalize">{mode} assistant</h4>
      </div>
      <div className="max-h-40 overflow-y-auto space-y-2 text-sm bg-white rounded p-2">
        {messages.map((m,idx)=>(
          <div key={idx} className={m.role==='assistant'? 'text-primary-800':'text-gray-700'}>
            <span className="font-medium mr-1">{m.role==='assistant'? '🤖':'You'}:</span>{m.content}
          </div>
        ))}
        {loading && <p className="text-primary-600 animate-pulse">AI is thinking…</p>}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); send(); }}}
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm"
          placeholder="Ask AI to refine…"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading || !input.trim()}
          className="btn btn-primary px-3 py-1 text-xs disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatbotContainer; 