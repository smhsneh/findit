import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Trash2, ChevronLeft, ChevronRight, Minus, Plus } from 'lucide-react';
const tokenize = (text) => {
  if (!text) return [];
  return text.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(Boolean);
};

export default function PreviewPane({ doc, searchQuery, onDeleteDoc }) {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to first page containing the search term when selecting a new document
  React.useEffect(() => {
    if (!doc || !Array.isArray(doc.content)) {
      setCurrentPage(0);
      return;
    }

    if (searchQuery) {
      const tokens = tokenize(searchQuery);
      if (tokens.length > 0) {
        // Find the first page that contains any of the exact search tokens
        const escaped = tokens.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
        const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'i');
        
        const matchPageIndex = doc.content.findIndex(page => {
          return regex.test(page);
        });
        
        if (matchPageIndex !== -1) {
          setCurrentPage(matchPageIndex);
          return;
        }
      }
    }

    setCurrentPage(0);
  }, [doc?.id, searchQuery]);

  const contentRef = React.useRef(null);

  // Auto-scroll to the first highlighted match whenever the page or search query changes
  React.useEffect(() => {
    if (contentRef.current) {
      // Small timeout to allow the DOM to render the <mark> tags first
      setTimeout(() => {
        const firstMark = contentRef.current?.querySelector('mark');
        if (firstMark) {
          firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 50);
    }
  }, [currentPage, doc?.id, searchQuery]);

  if (!doc) {
    return (
      <div className="bg-white border border-[#034078]/20 rounded-2xl p-6 min-h-[500px] shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-[#0a1128]/10 flex items-center justify-center text-text-main">
          <FileText size={28} />
        </div>
        <h3 className="text-lg font-semibold text-text-main">no document selected</h3>
        <p className="text-sm text-text-muted max-w-sm">
          select a document from the search results to display its contents here.
        </p>
      </div>
    );
  }

  const isPaginated = Array.isArray(doc.content);
  const totalPages = isPaginated ? doc.content.length : 1;
  const pageContent = isPaginated ? doc.content[currentPage] : doc.content;

  const renderHighlightedContent = (text, query) => {
    if (!query || !text) return text;
    const tokens = tokenize(query);
    if (tokens.length === 0) return text;

    const escaped = tokens.map(t => t.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = tokens.includes(part.toLowerCase().replace(/[^\w]/g, ''));
      return isMatch ? (
        <mark key={index} className="highlight-mark">
          {part}
        </mark>
      ) : (
        part
      );
    });
  };

  const getFileTag = (type) => {
    switch (type) {
      case 'pdf':  return { label: 'PDF',  bg: 'bg-red-50',   text: 'text-red-600' };
      case 'docx': return { label: 'DOCX', bg: 'bg-blue-50',  text: 'text-blue-600' };
      case 'txt':  return { label: 'TXT',  bg: 'bg-slate-100', text: 'text-slate-600' };
      default:     return { label: 'DOC',  bg: 'bg-slate-100', text: 'text-slate-500' };
    }
  };

  const tag = getFileTag(doc.fileType);

  const getZoomSize = () => {
    if (zoomLevel <= 80) return 'text-[15px]';
    if (zoomLevel >= 120) return 'text-[21px]';
    return 'text-[18px]';
  };

  const displayName = doc.fileName.replace(/\.[^.]+$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white border border-[#034078]/20 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col min-h-[500px] relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b border-[#034078]/10 bg-white">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold font-header text-text-main">{doc.fileName}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${tag.bg} ${tag.text}`}>
                {tag.label}
              </span>
            </div>
            <span className="text-[13px] text-text-muted font-medium">
              page {currentPage + 1} of {totalPages} <span className="mx-1.5">•</span> {searchQuery ? 'matches highlighted' : 'no active search'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => onDeleteDoc(doc.id)}
              className="p-2.5 rounded-btn border border-red-500/20 bg-red-50 text-red-500 hover:text-white hover:bg-red-500 transition-all shadow-sm group"
              title="Delete Document"
            >
              <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-10">
          <div className="max-w-[70ch]">
            <h1 className="text-2xl font-bold text-text-main mb-6">{displayName}</h1>
            <div ref={contentRef} className={`${getZoomSize()} text-text-main leading-[2] font-normal whitespace-pre-wrap`}>
              {renderHighlightedContent(pageContent, searchQuery)}
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between px-6 py-4 border-t border-[#034078]/10 bg-white mt-auto">
          {/* Pagination */}
          <div className="flex items-center bg-white/90 border border-black/[0.08] rounded-full overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <button 
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3.5 py-2 text-text-light hover:text-text-main hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-[13px] font-semibold text-text-main border-x border-black/[0.08] py-2 min-w-[70px] text-center">
              {currentPage + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3.5 py-2 text-text-light hover:text-text-main hover:bg-white transition-colors disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Zoom */}
          <div className="flex items-center bg-white/80 border border-black/[0.08] rounded-full overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
            <button
              onClick={() => setZoomLevel(z => Math.max(80, z - 20))}
              className="px-3.5 py-2 text-text-light hover:text-text-main hover:bg-white transition-colors"
            >
              <Minus size={16} />
            </button>
            <span className="px-4 text-[13px] font-semibold text-text-main border-x border-black/[0.08] py-2 min-w-[65px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(z => Math.min(140, z + 20))}
              className="px-3.5 py-2 text-text-light hover:text-text-main hover:bg-white transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
