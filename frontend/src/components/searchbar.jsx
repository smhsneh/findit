import React, { useState } from 'react';
import { Search, Terminal } from 'lucide-react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="terminal-border bg-white flex items-center p-3 gap-3">
        <div className="flex items-center gap-1.5 font-mono text-brand-dark shrink-0">
          <Terminal size={18} className="text-black" />
          <span>guest@findit:~$ search</span>
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="type search keywords here..."
          className="flex-1 bg-transparent border-none outline-none font-mono text-black placeholder-steel-dark/50"
        />

        <button
          type="submit"
          className="terminal-button bg-steel-medium hover:bg-steel-dark text-black px-4 py-1.5 font-mono font-bold flex items-center gap-2 text-sm shrink-0"
        >
          <Search size={14} />
          <span>execute</span>
        </button>
      </div>
      <div className="mt-1.5 px-3 flex gap-2 text-xs font-mono text-steel-dark">
        <span>tips: try queries like "normalization", "deadlock", "tcp connection", or "resume"</span>
      </div>
    </form>
  );
}
