import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Search } from 'lucide-react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <motion.div
        animate={{
          boxShadow: isFocused ? '0 0 0 1px rgba(255, 255, 255, 0.2)' : '0 4px 16px rgba(0, 0, 0, 0.3)'
        }}
        className="flex items-center bg-[#252528] rounded-full overflow-hidden transition-all duration-300 px-2 h-14"
      >
        <div className="pl-5 text-[#888888]">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="search"
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-white/90 placeholder:text-[#888888] font-medium px-4 py-4 pr-6"
        />
      </motion.div>
    </form>
  );
}
