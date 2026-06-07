import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ResultCard from './resultcard';
import { AlertCircle, ChevronDown, SlidersHorizontal } from 'lucide-react';

const FILE_FILTERS = ['all results', 'pdf', 'docx', 'txt'];

export default function ResultsList({ results, query, selectedDocId, onSelectDoc }) {
  const [activeFilter, setActiveFilter] = useState('all results');

  const filteredResults = activeFilter === 'all results'
    ? results
    : results.filter(r => r.fileType.toLowerCase() === activeFilter.toLowerCase());

  if (!query) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 gap-4 select-none min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-[#0a1128]/10 flex items-center justify-center text-text-main">
          <AlertCircle size={28} />
        </div>
        <h3 className="text-lg font-semibold text-text-main">ready to search</h3>
        <p className="text-sm text-text-muted max-w-sm">
          type a query above to search across your documents, notes and knowledge base.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Filter Chips */}
        <div className="flex items-center gap-2">
          {FILE_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`h-10 px-4 rounded-full text-[13px] font-bold font-header transition-all ${
                activeFilter === filter
                  ? 'glass-blue shadow-sm'
                  : 'bg-[#0a1128]/5 text-text-muted hover:bg-[#0a1128]/10 hover:text-text-main border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Sort/Filter */}
        <div className="flex items-center gap-4 text-[13px] text-text-muted font-medium">
          <span className="flex items-center gap-1.5 text-text-muted">
            sorted by: <span className="text-text-main font-semibold">relevance</span>
          </span>
        </div>
      </div>

      {/* Result Count */}
      <p className="text-[13px] text-text-muted font-medium">
        {filteredResults.length} results found for "<span className="text-text-main font-semibold">{query}</span>"
      </p>

      {/* Results */}
      {filteredResults.length === 0 ? (
        <div className="py-12 text-center text-sm text-text-muted">
          no {activeFilter !== 'all results' ? activeFilter + ' ' : ''}documents match your query.
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[520px] overflow-y-auto pr-1">
          {filteredResults.map((result, idx) => (
            <ResultCard
              key={result.id}
              result={result}
              isActive={selectedDocId === result.id}
              onClick={() => onSelectDoc(result.id)}
              index={idx}
            />
          ))}
        </div>
      )}
    </div>
  );
}
