import React, { useEffect, useState } from "react";
import PromptModal from "./PromptModal";
import MarkdownViewer from "./MarkdownViewer";
import SupplementModal from "./SupplementModal";
import ProgressBar from "./ProgressBar";
import { useNavigate, useLocation } from "react-router-dom";
import type { SupplementalInfo } from "../types";
import axios from "axios";
import type { Prompt } from "../types";

const CritiqueSection: React.FC = () => {
  const [markdown, setMarkdown] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [supplements,setSupplements]=useState<SupplementalInfo[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<Prompt[]>([]);

  useEffect(()=>{
    const idsJson=sessionStorage.getItem('selectedSupplements');
    if(idsJson){
      const ids:string[]=JSON.parse(idsJson);
      if(ids.length){
        fetch('http://localhost:8000/supplementals/').then(r=>r.json()).then((all:SupplementalInfo[])=>{
          setSupplements(all.filter(i=>ids.includes(i.id)));
        });
      }
    }
  },[]);

  useEffect(() => {
    const idsJson = sessionStorage.getItem('selectedPrompts_critique');
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
    sessionStorage.setItem('selectedPrompts_critique', JSON.stringify(selectedPrompts.map(p=>p.id)));
  },[selectedPrompts]);

  useEffect(()=>{
    sessionStorage.setItem('selectedSupplements', JSON.stringify(supplements.map(s=>s.id)));
  },[supplements]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!markdown.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      if(selectedPrompts.length===0){
        setError("Please select a prompt first or use default");
        setLoading(false);
        return;
      }
      const supplementalText = supplements.map(s=>s.content).join("\n---\n");
      const response = await axios.post("http://localhost:8000/critique", {
        markdown: markdown.trim(),
        prompt_id: selectedPrompts[0]?.id,
        supplemental: supplementalText || undefined,
      });
      setResult(response.data.critique);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to critique content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkdownChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
    setError(null);
  };

  const handleClear = () => {
    setMarkdown("");
    setResult(null);
    setError(null);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/markdown') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setMarkdown(content);
        setError(null);
      };
      reader.readAsText(file);
    }
  };

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const res = await axios.get("http://localhost:8000/prompts");
        setPrompts(res.data.filter((p:any)=>p.type==='critique'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrompts();
  }, []);

  return (
    <>
      <ProgressBar loading={loading} />
      <div className="space-y-8">
        {/* supplemental select via navigation */}

        {/* Form Card */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Critique Content</h3>
                <p className="text-sm text-gray-600">Get expert feedback on your markdown content</p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="markdown" className="block text-sm font-medium text-gray-700">
                    Markdown Content <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <label className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      Upload .md file
                      <input
                        type="file"
                        accept=".md,.markdown"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => navigate('/prompts/select', { state: { returnTo: location.pathname, promptType: 'critique' }})}
                  className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all mb-4"
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
                <button type="button" onClick={() => navigate('/supplementals/select', { state: { returnTo: location.pathname }})} className="btn btn-primary px-6 py-3 transform hover:scale-105 transition-all mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Add Supplemental Info
                </button>

                {supplements.length>0 && (
                  <div className="flex flex-wrap gap-2 w-full mt-2">
                    <span className="text-sm font-medium mr-2">Supplemental:</span>
                    {supplements.map(s=>(
                      <span key={s.id} className="flex items-center bg-buff-500 text-buff-100 px-3 py-2 rounded-full text-sm font-medium">
                        {s.title}
                        <button className="ml-2 text-buff-200 hover:text-white" onClick={()=>setSupplements(prev=>prev.filter(p=>p.id!==s.id))}>×</button>
                      </span>
                    ))}
                  </div>
                )}
                </div>
                <textarea
                  id="markdown"
                  value={markdown}
                  onChange={handleMarkdownChange}
                  rows={12}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none font-mono text-sm"
                  placeholder="Paste your markdown content here for analysis...

Example:
# My Article Title

This is the introduction paragraph...

## Section 1
Content goes here...
"
                  required
                  disabled={loading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supports standard markdown formatting including headers, lists, links, and code blocks
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  disabled={loading || !markdown.trim()}
                  className="btn btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Get Critique
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
            <div className="px-8 py-6 border-b border-white/20 bg-gradient-to-r from-orange-50 to-red-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">Content Critique</h3>
                    <p className="text-sm text-gray-600">Expert analysis and recommendations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Complete</span>
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
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Critique
                </button>
              </div>
            </div>
          </div>
        )}
        {showModal && (
          <PromptModal
            type="critique"
            onClose={()=>{setShowModal(false); setSelectedPrompt("");}}
            onSaved={(p)=>{ setPrompts(prev=>[...prev,p]); setSelectedPrompt(p.id);} }
          />
        )}
      </div>
    </>
  );
};

export default CritiqueSection; 