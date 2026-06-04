import React from 'react';
import { FileText, Cpu, ChevronRight } from 'lucide-react';

export default function ResultCard({ result, isActive, onClick }) {
  const getFileIconColor = (type) => {
    switch (type) {
      case 'pdf': return 'bg-[#2c4f7c]/10 text-[#2c4f7c] border-[#2c4f7c]';
      case 'docx': return 'bg-steel-dark/15 text-steel-dark border-steel-dark';
      default: return 'bg-steel-light/30 text-black border-black';
    }
  };

  // build a visual score gauge bar
  const renderScoreGauge = (score) => {
    const bars = 10;
    const filled = Math.max(1, Math.round(score * bars));
    let gauge = '';
    for (let i = 0; i < bars; i++) {
      gauge += i < filled ? '■' : '□';
    }
    return (
      <span className="font-mono text-xs hidden sm:inline ml-2 text-brand-dark/80">
        [{gauge}]
      </span>
    );
  };

  return (
    <div
      onClick={onClick}
      className={`terminal-border-sm p-4 bg-white hover:bg-lavender-light cursor-pointer transition-all flex flex-col gap-2 ${
        isActive ? 'ring-2 ring-black bg-lavender-light' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-2 border-b border-dashed border-black/30 pb-2">
        <div className="flex items-center gap-2">
          <div className={`p-1.5 border border-black ${getFileIconColor(result.fileType)}`}>
            <FileText size={16} />
          </div>
          <div className="flex flex-col">
            <span className="font-header text-sm text-black font-bold">
              {result.fileName}
            </span>
            <span className="text-[10px] text-steel-dark font-mono">
              type: {result.fileType} • matches: {result.matchCount}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0 font-mono text-right">
          <div className="flex items-center gap-1">
            <Cpu size={12} className="text-black" />
            <span className="text-xs font-bold text-black">
              score: {result.score.toFixed(4)}
            </span>
          </div>
          {renderScoreGauge(result.score)}
        </div>
      </div>

      <div className="text-xs text-black leading-relaxed font-body font-normal">
        <span 
          dangerouslySetInnerHTML={{ __html: result.snippet }} 
          className="text-black"
        />
      </div>

      <div className="flex justify-between items-center text-[10px] text-steel-dark/70 font-mono mt-1 pt-1 border-t border-dashed border-black/10">
        <span>indexed: {new Date(result.uploadedAt).toLocaleDateString().toLowerCase()}</span>
        <span className="flex items-center text-brand-dark font-bold">
          <span>preview document</span>
          <ChevronRight size={10} />
        </span>
      </div>
    </div>
  );
}
