import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import ChatbotContainer from "./ChatbotContainer";

interface Props {
  title: string;
  value: string;
  onChange: (val: string) => void;
  onClose: () => void;
  refineMode?: "prompt" | "supplement";
  undo?: () => void;
  redo?: () => void;
  sourceText?: string;
}

const TextEditorOverlay: React.FC<Props> = ({ title, value, onChange, onClose, refineMode, undo, redo, sourceText }) => {
  // lock scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const modal = (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-11/12 max-w-4xl p-6 space-y-4 relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {refineMode && (
          <ChatbotContainer
            mode={refineMode}
            onRefine={onChange}
            sourceText={sourceText || value}
          />
        )}
        <div className="flex justify-end gap-2 text-xs mb-2">
          {undo && <button onClick={undo} className="btn btn-secondary px-2 py-1">Undo</button>}
          {redo && <button onClick={redo} className="btn btn-secondary px-2 py-1">Redo</button>}
        </div>
        <textarea
          className="w-full min-h-[300px] border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

export default TextEditorOverlay; 