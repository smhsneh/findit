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
          borderColor: isFocused ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.15)'
        }}
        transition={{ duration: 0.2 }}
        className="h-[60px] bg-transparent border-b flex items-center px-2 gap-4"
      >

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="search across your documents, notes and knowledge..."
          className="flex-1 bg-transparent border-none outline-none text-[18px] text-white/90 placeholder:text-white/30 font-medium"
        />

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 flex items-center justify-center text-white transition-all shrink-0 hover:opacity-70"
        >
          <Search size={22} />
        </motion.button>
      </motion.div>
    </form>
  );
}
