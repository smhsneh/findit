import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <motion.div
        animate={{
          boxShadow: isFocused
            ? '0 12px 40px rgba(0,0,0,.04), 0 0 0 4px rgba(0,0,0,.04)'
            : '0 1px 4px rgba(0,0,0,0.03)',
        }}
        transition={{ duration: 0.2 }}
        className="h-[72px] bg-white/75 backdrop-blur-md rounded-full flex items-center px-6 gap-4 border border-black/[0.08]"
      >
        <Search size={22} className="text-text-light shrink-0" />
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="search across your documents, notes and knowledge..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-text-main placeholder:text-text-light font-medium"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 flex items-center justify-center text-[#0a0908] transition-all shrink-0 hover:opacity-70"
        >
          <Search size={22} />
        </motion.button>
      </motion.div>
    </form>
  );
}
