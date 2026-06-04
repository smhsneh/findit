import React from 'react';
import { History, ArrowRight } from 'lucide-react';

export default function SearchHistory({ history, onSelectQuery }) {
  // helper to format relative search times
  const formatTime = (isoString) => {
    const elapsed = Date.now() - new Date(isoString).getTime();
    const minutes = Math.floor(elapsed / 60000);
    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1m ago';
    return `${minutes}m ago`;
  };

  return (
    <div className="terminal-border-sm p-4 bg-white flex flex-col gap-2.5">
      <div className="flex items-center gap-2 border-b border-black pb-1.5 font-mono text-xs font-bold text-black select-none">
        <History size={14} className="text-black" />
        <span>history logs</span>
      </div>

      {history.length === 0 ? (
        <span className="font-mono text-xs text-steel-dark italic p-1">
          no query records found
        </span>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto font-mono text-xs">
          {history.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onSelectQuery(item.query)}
              className="flex justify-between items-center p-1.5 hover:bg-lavender-light cursor-pointer group text-black"
            >
              <div className="flex items-center gap-1.5 min-w-0">
                <ArrowRight size={10} className="text-steel-dark group-hover:text-black shrink-0" />
                <span className="truncate underline decoration-dotted font-medium">
                  {item.query}
                </span>
              </div>
              <span className="text-[10px] text-steel-dark/65 shrink-0 pl-2">
                {formatTime(item.searchedAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
