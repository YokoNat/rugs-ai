import React, { useState } from "react";
import TextEditorOverlay from "./TextEditorOverlay";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  overlayTitle?: string;
  refineMode?: "prompt" | "supplement";
}

const ExpandableTextarea: React.FC<Props> = ({ label, value, onChange, overlayTitle="Edit", refineMode, ...rest }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [history,setHistory]=useState<string[]>([value]);
  const [historyIndex,setHistoryIndex]=useState(0);

  const pushHistory=(val:string)=>{
    const newHist=[...history.slice(0,historyIndex+1),val];
    setHistory(newHist);
    setHistoryIndex(newHist.length-1);
  };

  const handleExternalChange=(e: React.ChangeEvent<HTMLTextAreaElement>)=>{
    pushHistory(e.target.value);
    onChange(e);
  };

  return (
    <div className="relative">
      {label && <label className="block text-xs font-medium mb-1">{label}</label>}
      <textarea
        {...rest}
        value={value}
        onChange={handleExternalChange}
        className={(rest.className || "") + " resize-none"}
      />
      <button
        type="button"
        onClick={() => setShowOverlay(true)}
        className="absolute bottom-2 right-2 text-xs text-primary-600 hover:text-primary-800 bg-white/70 backdrop-blur-sm rounded-full px-2 py-0.5 shadow"
      >
        Expand
      </button>
      {showOverlay && (
        <TextEditorOverlay
          title={overlayTitle}
          value={value}
          onChange={(val)=>{
            const event = { target: { value: val }} as unknown as React.ChangeEvent<HTMLTextAreaElement>;
            pushHistory(val);
            onChange(event);
          }}
          onClose={()=>setShowOverlay(false)}
          refineMode={refineMode}
          undo={()=>{
            if(historyIndex>0){
              const newIdx=historyIndex-1;
              setHistoryIndex(newIdx);
              const val=history[newIdx];
              const event={target:{value:val}} as unknown as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(event);
            }
          }}
          redo={()=>{
            if(historyIndex<history.length-1){
              const newIdx=historyIndex+1;
              setHistoryIndex(newIdx);
              const val=history[newIdx];
              const event={target:{value:val}} as unknown as React.ChangeEvent<HTMLTextAreaElement>;
              onChange(event);
            }
          }}
          sourceText={value}
        />
      )}
    </div>
  );
};

export default ExpandableTextarea; 