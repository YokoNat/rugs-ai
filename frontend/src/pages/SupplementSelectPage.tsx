import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { SupplementalInfo } from "../types";
import SupplementModal from "../components/SupplementModal";
import MarkdownViewer from "../components/MarkdownViewer";

const API_BASE = "http://localhost:8000";

const SupplementSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;
  const returnTo: string = location.state?.returnTo || "/";

  const [infos, setInfos] = useState<SupplementalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search,setSearch]=useState("");

  useEffect(()=>{
    const stored=sessionStorage.getItem('selectedSupplements');
    if(stored){
      try{
        const arr:string[]=JSON.parse(stored);
        setSelected(new Set(arr));
      }catch{}
    }
  },[]);

  const fetchInfos = async () => {
    try {
      const res = await fetch(`${API_BASE}/supplementals/`);
      const data = await res.json();
      setInfos(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  const toggle = (id:string)=>{
    setSelected(prev=>{
      const n = new Set(prev);
      if(n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const confirm = ()=>{
    sessionStorage.setItem("selectedSupplements", JSON.stringify(Array.from(selected)));
    navigate(returnTo);
  };

  const handleSaved = (info: SupplementalInfo) => {
    setInfos((prev) => [...prev, info]);
    setSelected(prev=> new Set(prev).add(info.id));
  };

  const selectedInfos = infos.filter(i => selected.has(i.id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold">Select Supplemental Information</h2>

      {/* Selected chips */}
      {selectedInfos.length > 0 && (
        <div className="bg-buff-800 p-4 rounded-xl">
          <h3 className="text-sm font-medium text-buff-200 mb-2">Selected ({selectedInfos.length}):</h3>
          <div className="flex flex-wrap gap-2">
            {selectedInfos.map(i => (
              <span key={i.id} className="flex items-center bg-buff-600 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                {i.title}
                <button className="ml-2 text-buff-200 hover:text-white" onClick={() => toggle(i.id)}>×</button>
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
        Add New Supplemental
      </button>

      <button onClick={confirm} className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all">
        Confirm & Return
      </button>

      <button onClick={()=>navigate(returnTo)} className="btn btn-danger px-6 py-3 transform hover:scale-105 transition-all">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
        Cancel
      </button>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search supplemental..." className="border px-3 py-2 rounded w-full md:w-1/2" />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {infos.filter(i=> i.title.toLowerCase().includes(search.toLowerCase()) || i.content.toLowerCase().includes(search.toLowerCase())).map((info) => (
            <div key={info.id} className="p-4 bg-white rounded-xl shadow border border-gray-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{info.title}</h4>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {info.tags.map((t) => (
                      <span key={t} className="text-xs bg-gray-100 rounded px-2 py-0.5">{t}</span>
                    ))}
                  </div>
                </div>
                 <input type="checkbox" checked={selected.has(info.id)} onChange={()=>toggle(info.id)} className="h-5 w-5 text-indigo-600" />
              </div>
              <MarkdownViewer content={info.content.slice(0, 300) + (info.content.length > 300 ? "…" : "")} />
            </div>
          ))}
          {infos.length === 0 && <p className="text-gray-500">No supplemental info yet.</p>}
        </div>
      )}

      {showAdd && (
        <SupplementModal onClose={() => setShowAdd(false)} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default SupplementSelectPage; 