import React, { useEffect, useState } from "react";
import axios from "axios";
import MarkdownViewer from "./MarkdownViewer";
import PromptModal from "./PromptModal";
import { useNavigate, useLocation } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import type { SupplementalInfo } from "../types";
import type { Prompt } from "../types";

const GenerateForm: React.FC = () => {
  const [topic, setTopic] = useState("");
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [supplements,setSupplements]=useState<SupplementalInfo[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([]);

  useEffect(()=>{
    const idsJson=sessionStorage.getItem('selectedSupplements');
    if(idsJson){
      const ids: string[] = JSON.parse(idsJson);
      if(ids.length){
        fetch('http://localhost:8000/supplementals/').then(r=>r.json()).then((all:SupplementalInfo[])=>{
          setSupplements(all.filter(i=>ids.includes(i.id)));
        });
      }
    }
  },[]);

  useEffect(() => {
    const idsJson = sessionStorage.getItem('selectedPrompts_generation');
    if (idsJson) {
      const ids: string[] = JSON.parse(idsJson);
      if (ids.length) {
        fetch('http://localhost:8000/prompts/').then(r => r.json()).then((all: Prompt[]) => {
          setSelectedPrompts(all.filter(i => ids.includes(i.id)));
        });
      }
    }
  }, []);

  useEffect(()=>{
    sessionStorage.setItem('selectedPrompts_generation', JSON.stringify(selectedPrompts.map(p=>p.id)));
  },[selectedPrompts]);

  useEffect(()=>{
    sessionStorage.setItem('selectedSupplements', JSON.stringify(supplements.map(s=>s.id)));
  },[supplements]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      if(selectedPrompts.length===0){
        setError("Please select a prompt first.");
        setLoading(false);
        return;
      }
      const supplementalText = supplements.map(s=>s.content).join("\n---\n");
      const response = await axios.post("http://localhost:8000/generate", {
        topic: topic.trim(),
        instructions: instructions.trim() || undefined,
        prompt_id: selectedPrompts[0]?.id,
        supplemental: supplementalText || undefined,
      });
      setResult(response.data.article);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(event.target.value);
    setError(null);
  };

  const handleInstructionsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInstructions(event.target.value);
  };

  const handleClear = () => {
    setTopic("");
    setInstructions("");
    setResult(null);
    setError(null);
  };

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/prompts");
        setPrompts(res.data.filter((p: any)=>p.type==='generation'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <div className="space-y-8">
      <ProgressBar loading={loading} />
      {/* Supplemental select handled via navigation */}

      {/* Form Card */}
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Generate Article</h3>
              <p className="text-sm text-gray-600">Create high-quality content with AI assistance</p>
            </div>
          </div>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                Topic <span className="text-red-500">*</span>
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={handleTopicChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                placeholder="Enter your topic (e.g., 'Persian Rugs History')"
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => navigate('/prompts/select', { state: { returnTo: location.pathname, promptType: 'generation' }})}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-all"
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
            <button
              type="button"
              onClick={() => navigate('/supplementals/select', { state: { returnTo: location.pathname }})}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-emerald-500 to-lime-600 hover:from-emerald-600 hover:to-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
              Add Supplemental Info
            </button>

            {supplements.length>0 && (
              <div className="flex flex-wrap gap-2 w-full mt-2">
                <span className="text-sm font-medium mr-2">Supplemental:</span>
                {supplements.map(s=> (
                  <span key={s.id} className="flex items-center bg-buff-500 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                    {s.title}
                    <button className="ml-2 text-buff-200 hover:text-white" onClick={()=>setSupplements(prev=>prev.filter(p=>p.id!==s.id))}>×</button>
                  </span>
                ))}
              </div>
            )}
            </div>

            <div>
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Instructions <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={handleInstructionsChange}
                rows={4}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                placeholder="Add specific instructions, style preferences, or requirements..."
                disabled={loading}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Article
                  </>
                )}
              </button>
              
              {(result || error) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Clear form
                </button>
              )}
            </div>
          </form>
          
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-up">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Result Card */}
      {result && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden animate-slide-up">
          <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Generated Content</h3>
                  <p className="text-sm text-gray-600">Your article is ready</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500">Ready</span>
              </div>
            </div>
          </div>
          <div className="p-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm max-h-96 overflow-auto">
              <MarkdownViewer content={result || ""} />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => navigator.clipboard.writeText(result)}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <PromptModal
          type="generation"
          onClose={()=>{setShowModal(false); setSelectedPrompts([]);}}
          onSaved={(p)=>{ setPrompts(prev=>[...prev,p]); setSelectedPrompts(prev=>[...prev,p]); }}
        />
      )}
    </div>
  );
};

export default GenerateForm; 