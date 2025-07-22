import React, { createContext, useContext, useEffect, useState } from "react";

interface Settings {
  prompt_system: string;
  supplement_system: string;
}

interface SettingsCtx extends Settings {
  update: (s: Partial<Settings>) => Promise<void>;
}

const SettingsContext = createContext<SettingsCtx | null>(null);

const API_BASE = "http://localhost:8000";

export const SettingsProvider: React.FC<{children:React.ReactNode}> = ({children}) =>{
  const [settings,setSettings]=useState<Settings>({prompt_system:"", supplement_system:""});

  useEffect(()=>{
    fetch(`${API_BASE}/settings/`).then(r=>r.json()).then(setSettings);
  },[]);

  const update = async (s: Partial<Settings>)=>{
    const res= await fetch(`${API_BASE}/settings/`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)});
    if(res.ok){
      const data= await res.json();
      setSettings(data);
    }
  };

  return <SettingsContext.Provider value={{...settings, update}}>{children}</SettingsContext.Provider>;
};

export const useSettings = ()=>{
  const ctx= useContext(SettingsContext);
  if(!ctx) throw new Error("SettingsContext missing");
  return ctx;
}; 