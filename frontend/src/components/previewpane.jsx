import React, { useState } from 'react';
import { FileText, ZoomIn, ZoomOut, Trash2, BookOpen, Clock } from 'lucide-react';
import { tokenize } from '../services/api';

export default function PreviewPane({ doc, searchQuery, onDeleteDoc }) {
  const [zoomLevel, setZoomLevel] = useState(100); // 100%, 120%, 80%

  if (!doc) {
    return (
      <div className="terminal-border p-8 text-center bg-white flex flex-col items-center justify-center gap-3 h-full min-h-[400px]">
        <BookOpen size={32} className="text-steel-dark" />
        <span className="font-header text-sm text-black">document viewer standby</span>
        <span className="font-mono text-xs text-steel-dark max-w-xs">
          select a document from the search results or document list to display its contents
        </span>
      </div>
    );
  }

  // function to dynamically highlight query tokens inside text
  const renderHighlightedContent = (text, query) => {
    if (!query || !text) return text;
    const tokens = tokenize(query);
    if (tokens.length === 0) return text;

    // escape special regex chars in tokens
    const escaped = tokens.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    // match tokens with word boundary
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = tokens.includes(part.toLowerCase().replace(/[^\w]/g, ''));
      return isMatch ? (
        <mark key={index} className="bg-steel-medium/40 border-b border-black font-semibold text-black">
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  const handleZoomIn = () => {
    setZoomLevel(z => Math.min(140, z + 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(z => Math.max(80, z - 20));
  };

  const getZoomClass = () => {
    if (zoomLevel === 80) return 'text-xs';
    if (zoomLevel === 120) return 'text-base';
    if (zoomLevel === 140) return 'text-lg';
    return 'text-sm';
  };

  return (
    <div className="terminal-border bg-white flex flex-col h-full min-h-[500px]">
      {/* Pane header */}
      <div className="flex items-center justify-between border-b-2 border-black p-3 bg-lavender-light">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#2c4f7c]/10 text-brand-dark border border-black">
            <FileText size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-header text-sm text-black font-bold">
              {doc.fileName}
            </span>
            <span className="text-[10px] text-steel-dark font-mono flex items-center gap-1">
              <Clock size={10} />
              <span>uploaded: {new Date(doc.uploadedAt).toLocaleTimeString().toLowerCase()}</span>
            </span>
          </div>
        </div>

        <button
          onClick={() => onDeleteDoc(doc.id)}
          className="p-1.5 border border-black hover:bg-red-100 text-black flex items-center justify-center shrink-0"
          title="purge document from index"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Control bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-lavender-light/40 border-b border-black font-mono text-xs text-black">
        <span>status: indexing active</span>
        
        {/* Zoom controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            disabled={zoomLevel <= 80}
            className="p-1 border border-black bg-white hover:bg-steel-light disabled:opacity-50 flex items-center justify-center"
          >
            <ZoomOut size={12} />
          </button>
          <span>{zoomLevel}%</span>
          <button
            onClick={handleZoomIn}
            disabled={zoomLevel >= 140}
            className="p-1 border border-black bg-white hover:bg-steel-light disabled:opacity-50 flex items-center justify-center"
          >
            <ZoomIn size={12} />
          </button>
        </div>
      </div>

      {/* Document content */}
      <div className="flex-1 p-6 overflow-y-auto bg-white font-body leading-relaxed terminal-border-inset">
        <div className={`${getZoomClass()} text-black whitespace-pre-wrap`}>
          {renderHighlightedContent(doc.content, searchQuery)}
        </div>
      </div>

      {/* Pane footer info */}
      <div className="p-2 border-t border-black bg-lavender-light/30 font-mono text-[10px] text-steel-dark text-center select-none">
        <span>file buffer contents • char count: {doc.content.length}</span>
      </div>
    </div>
  );
}
