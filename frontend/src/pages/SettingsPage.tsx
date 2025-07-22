import React, { useState } from "react";
import { useSettings } from "../context/SettingsContext";
import ExpandableTextarea from "../components/ExpandableTextarea";

const SettingsPage: React.FC = () => {
  const { prompt_system, supplement_system, update } = useSettings();
  const [promptSys,setPromptSys]=useState(prompt_system);
  const [suppSys,setSuppSys]=useState(supplement_system);
  const [saving,setSaving]=useState(false);

  const save= async ()=>{
    setSaving(true);
    await update({prompt_system:promptSys, supplement_system:suppSys});
    setSaving(false);
    alert("Settings saved");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold">System Settings</h2>
      <ExpandableTextarea
        label="Prompt Assistant System Prompt"
        value={promptSys}
        onChange={(e)=>setPromptSys(e.target.value)}
        refineMode="prompt"
        className="w-full border border-gray-300 rounded px-3 py-2 min-h-[120px]"
      />
      <ExpandableTextarea
        label="Supplement Assistant System Prompt"
        value={suppSys}
        onChange={(e)=>setSuppSys(e.target.value)}
        refineMode="supplement"
        className="w-full border border-gray-300 rounded px-3 py-2 min-h-[160px]"
      />
      <button onClick={save} disabled={saving} className="btn btn-primary px-6 py-3">
        {saving? 'Saving...' : 'Save Settings'}
      </button>
    </div>
  );
};

export default SettingsPage; 