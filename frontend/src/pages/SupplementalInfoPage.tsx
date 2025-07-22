import React, { useEffect, useMemo, useState } from "react";
import type { SupplementalInfo } from "../types";
import SupplementModal from "../components/SupplementModal";
import EditableSupplementCard from "../components/EditableSupplementCard";

const API_BASE = "http://localhost:8000";

const SupplementalInfoPage: React.FC = () => {
  const [infos, setInfos] = useState<SupplementalInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [search,setSearch]=useState("");

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

  const handleSaved = (info: SupplementalInfo)=>{
    setInfos(prev=>[...prev, info]);
    setShowAdd(false);
  };

  const uniqueTags = useMemo(() => {
    const set = new Set<string>();
    infos.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [infos]);

  const filtered = useMemo(() => {
    let base=infos;
    if(tagFilter) base=base.filter(i=>i.tags.includes(tagFilter));
    if(search.trim()){
      const s=search.toLowerCase();
      base=base.filter(i=> i.title.toLowerCase().includes(s)||i.content.toLowerCase().includes(s));
    }
    return base;
  },[infos,tagFilter,search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Supplemental Information</h2>
        <button onClick={()=>setShowAdd(true)} className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Supplemental
        </button>
      </div>

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
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." className="border px-3 py-2 rounded w-full md:w-1/2" />

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {filtered.map((info) => (
            <EditableSupplementCard
              key={info.id}
              info={info}
              onUpdated={(upd)=> setInfos(prev=> prev.map(i=>i.id===upd.id? upd : i))}
              onDeleted={(id)=> setInfos(prev=> prev.filter(i=> i.id!==id))}
            />
          ))}
        </div>
      )}
      {showAdd && <SupplementModal onClose={()=>setShowAdd(false)} onSaved={handleSaved} />}
    </div>
  );
};

export default SupplementalInfoPage; 