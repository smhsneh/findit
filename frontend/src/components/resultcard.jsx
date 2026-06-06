import React from 'react';
import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

export default function ResultCard({ result, isActive, onClick, index = 0 }) {
  const matchPercentage = Math.min(Math.round((result.score || 0.5) * 100), 99);

  const getFileTag = (type) => {
    switch (type) {
      case 'pdf':  return { label: 'pdf',  bg: 'bg-red-50',   text: 'text-red-600' };
      case 'docx': return { label: 'docx', bg: 'bg-blue-50',  text: 'text-blue-600' };
      case 'txt':  return { label: 'txt',  bg: 'bg-slate-100', text: 'text-slate-600' };
      default:     return { label: 'doc',  bg: 'bg-slate-100', text: 'text-slate-500' };
    }
  };

  const tag = getFileTag(result.fileType);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.2 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`rounded-card p-6 cursor-pointer transition-all duration-200 ${
        isActive
          ? 'border border-stormy-teal/20 shadow-card-hover bg-white'
          : 'border border-transparent hover:border-border bg-white hover:shadow-soft'
      }`}
      style={isActive ? {} : { border: '1px solid transparent' }}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Info */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h3 className="text-[18px] font-bold font-header text-text-main leading-snug">
            {result.fileName.replace(/\.[^.]+$/, '').replace(/_/g, ' ').toLowerCase()}
          </h3>

          <div className="flex items-center gap-2 text-[13px] font-medium text-text-muted flex-wrap">
            <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${tag.bg} ${tag.text}`}>
              {tag.label}
            </span>
            <span>page 14</span>
            <span className="text-text-light">•</span>
            <span>{result.matchCount} matches</span>
          </div>

          <div className="text-[14px] text-text-muted leading-relaxed mt-1">
            <span dangerouslySetInnerHTML={{ __html: result.snippet }} />
          </div>
        </div>

        {/* Right: Score + Options */}
        <div className="flex items-start gap-3 shrink-0">
          <div className="bg-sky-100 rounded-[18px] px-4 py-3 text-center min-w-[60px]">
            <span className="text-lg font-bold text-sky-900 leading-none">{matchPercentage}%</span>
            <div className="text-[10px] text-sky-900/70 font-semibold mt-1">relevance</div>
          </div>
          <button className="text-text-light hover:text-text-muted p-1 mt-1 transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
