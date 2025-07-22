import React, { useState } from "react";
import { createPortal } from "react-dom";
import ExpandableTextarea from "./ExpandableTextarea";
import type { Prompt } from "../types";

const API_BASE = "http://localhost:8000";

interface Props {
  type: "generation" | "critique" | "planner";
  onClose: () => void;
  onSaved: (p: Prompt) => void;
}

const PromptModal: React.FC<Props> = ({ type, onClose, onSaved }) => {
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      type,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      const res = await fetch(`${API_BASE}/prompts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const created = await res.json();
        onSaved(created);
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-2xl p-6 space-y-4">
        <h3 className="text-xl font-semibold">Add Custom {type.charAt(0).toUpperCase() + type.slice(1)} Prompt</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <ExpandableTextarea
          label="Content / Prompt Template"
          value={form.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=>setForm({...form, content:e.target.value})}
          className="w-full border border-gray-300 rounded px-3 py-2 min-h-[160px]"
          overlayTitle="Edit Prompt Template"
          refineMode="prompt"
        />
        <div className="space-y-2">
          <label className="block text-sm font-medium">Tags (comma or Enter)</label>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            onKeyPress={(e)=>{ if(e.key==='Enter'){ e.preventDefault(); handleSave();}}}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">Save</button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default PromptModal; 