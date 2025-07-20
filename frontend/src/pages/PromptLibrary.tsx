import React, { useEffect, useMemo, useState } from "react";
import EditablePromptCard from "../components/EditablePromptCard";
import type { Prompt } from "../types";

const API_BASE = "http://localhost:8000";

const PromptLibrary: React.FC = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newPrompt, setNewPrompt] = useState({
    title: "",
    content: "",
    tags: "",
    type: "generation" as "generation" | "critique",
  });
  const [tab, setTab] = useState<"generation" | "critique">("generation");
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  const fetchPrompts = async () => {
    try {
      const res = await fetch(`${API_BASE}/prompts/`);
      const data = await res.json() as Prompt[];
      setPrompts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrompts();
  }, []);

  const filteredPrompts = useMemo(() => {
    const base = prompts.filter(p=>p.type===tab);
    return tagFilter ? base.filter((p) => p.tags.includes(tagFilter)) : base;
  }, [prompts, tagFilter, tab]);

  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    prompts.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [prompts]);

  const handleAdd = async () => {
    if (!newPrompt.title.trim() || !newPrompt.content.trim()) return;
    const payload = {
      title: newPrompt.title.trim(),
      content: newPrompt.content.trim(),
      tags: newPrompt.tags.split(",").map((t) => t.trim()).filter(Boolean),
      type: newPrompt.type,
    };
    try {
      const res = await fetch(`${API_BASE}/prompts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        setPrompts((prev) => [...prev, created]);
        setNewPrompt({ title: "", content: "", tags: "", type: tab });
        setShowAdd(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prompt?")) return;
    await fetch(`${API_BASE}/prompts/${id}`, { method: "DELETE" });
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Prompt Library</h2>
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAdd ? "Cancel" : "Add Prompt"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        {(["generation","critique"] as const).map(t=> (
          <button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full text-sm ${tab===t? 'bg-blue-600 text-white':'bg-gray-100 text-gray-700'}`}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {/* Tag Filter */}
      {uniqueTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium mr-2">Filter by tag:</span>
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`text-xs px-2 py-1 rounded-full border ${tagFilter === tag ? 'bg-blue-600 text-white border-blue-600':'bg-white text-gray-600'}`}
            >
              {tag}
            </button>
          ))}
          {tagFilter && (
            <button onClick={() => setTagFilter(null)} className="text-xs text-red-600 ml-2">Clear filter</button>
          )}
        </div>
      )}

      {/* Add Prompt Form */}
      {showAdd && (
        <div className="p-4 bg-white rounded-xl shadow border border-gray-200 space-y-3 max-w-xl">
          <input
            className="w-full border-gray-300 rounded px-3 py-2"
            placeholder="Title"
            value={newPrompt.title}
            onChange={(e) => setNewPrompt({ ...newPrompt, title: e.target.value })}
          />
          <textarea
            className="w-full border-gray-300 rounded px-3 py-2 min-h-[120px]"
            placeholder="Content / Prompt Template"
            value={newPrompt.content}
            onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
          />
          <input
            className="w-full border-gray-300 rounded px-3 py-2 text-xs"
            placeholder="Tags (comma separated)"
            value={newPrompt.tags}
            onChange={(e) => setNewPrompt({ ...newPrompt, tags: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAdd();
              }
            }}
          />
          <select
            className="w-full border-gray-300 rounded px-3 py-2 text-sm"
            value={newPrompt.type}
            onChange={(e)=>setNewPrompt({...newPrompt,type:e.target.value as "generation" | "critique"})}
          >
            <option value="generation">Generation</option>
            <option value="critique">Critique</option>
          </select>
          <button
            onClick={handleAdd}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
        </div>
      )}

      {/* Prompt List */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredPrompts.map((p) => (
            <EditablePromptCard
              key={p.id}
              prompt={p}
              onUpdated={(upd) => setPrompts((prev:Prompt[]) => prev.map((pr) => (pr.id === upd.id ? upd : pr)))}
              onDeleted={(id) => setPrompts((prev:Prompt[]) => prev.filter((pr) => pr.id !== id))}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptLibrary; 