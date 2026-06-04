import React from 'react';
import ResultCard from './resultcard';
import { AlertCircle } from 'lucide-react';

export default function ResultsList({ results, selectedDocId, onSelectDoc }) {
  if (results.length === 0) {
    return (
      <div className="terminal-border p-8 text-center bg-white flex flex-col items-center justify-center gap-2">
        <AlertCircle size={24} className="text-steel-dark" />
        <span className="font-header text-sm text-black">no matching documents found</span>
        <span className="font-mono text-xs text-steel-dark">
          try typing another query or upload a new file to update the inverted index
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
      <div className="flex justify-between items-center text-xs font-mono text-steel-dark px-1">
        <span>search results ({results.length} files matched)</span>
        <span>sorted by tf-idf score</span>
      </div>
      <div className="flex flex-col gap-3">
        {results.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
            isActive={selectedDocId === result.id}
            onClick={() => onSelectDoc(result.id)}
          />
        ))}
      </div>
    </div>
  );
}
