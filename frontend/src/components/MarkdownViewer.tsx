import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  content: string;
}

const MarkdownViewer: React.FC<Props> = ({ content }) => {
  const [raw, setRaw] = useState(false);

  if (!content) return null;

  return (
    <div className="relative group">
      <button
        onClick={() => setRaw((r) => !r)}
        className="absolute top-0 right-0 text-xs text-blue-600 hover:underline hidden group-hover:block"
      >
        {raw ? "Preview" : "Raw"}
      </button>
      {raw ? (
        <pre className="whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed">
          {content}
        </pre>
      ) : (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default MarkdownViewer; 