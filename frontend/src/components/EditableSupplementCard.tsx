import React, { useState } from "react";
import ExpandableTextarea from "./ExpandableTextarea";
import type { SupplementalInfo } from "../types";

interface Props {
  info: SupplementalInfo;
  onUpdated: (i: SupplementalInfo) => void;
  onDeleted: (id: string) => void;
}

const API_BASE = "http://localhost:8000";

const EditableSupplementCard: React.FC<Props> = ({ info, onUpdated, onDeleted }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: info.title,
    content: info.content,
    tags: info.tags.join(", "),
  });
  const [saving, setSaving] = useState(false);

  const saveChanges = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/supplementals/${info.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        onUpdated(updated);
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async () => {
    if (!confirm("Delete this supplemental info?")) return;
    try {
      await fetch(`${API_BASE}/supplementals/${info.id}`, { method: "DELETE" });
      onDeleted(info.id);
    } catch (err) {
      console.error(err);
    }
  };

  if (editing) {
    return (
      <div className="p-4 bg-white rounded-xl shadow border border-gray-200 space-y-2 relative">
        <label className="block text-xs font-medium">Title</label>
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 font-semibold"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <ExpandableTextarea
          label="Content"
          value={form.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>)=> setForm({...form, content: e.target.value})}
          className="w-full border border-gray-300 rounded px-2 py-1 min-h-[100px] text-xs"
          overlayTitle="Edit Supplemental Content"
          refineMode="supplement"
        />
        <label className="block text-xs font-medium mt-2">Tags</label>
        <input
          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
        />
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={() => setEditing(false)} className="text-sm px-3 py-1 border rounded">Cancel</button>
          <button
            onClick={saveChanges}
            disabled={saving}
            className="text-sm px-3 py-1 bg-green-600 text-white rounded disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-xl shadow border border-gray-200 relative">
      <button
        onClick={() => setEditing(true)}
        className="absolute top-2 right-8 text-gray-500 hover:text-gray-700 text-sm"
      >
        ✎
      </button>
      <button
        onClick={deleteItem}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm"
      >
        ✕
      </button>
      <h4 className="font-semibold mb-1">{info.title}</h4>
      <div className="flex flex-wrap gap-1 mb-2">
        {info.tags.map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 rounded px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <pre className="text-xs whitespace-pre-wrap max-h-40 overflow-y-auto">{info.content}</pre>
    </div>
  );
};

export default EditableSupplementCard; 