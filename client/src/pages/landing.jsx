import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col text-text-main overflow-hidden bg-white font-body">
      {/* Top Section - Background Image */}
      <div className="w-full flex-1 flex flex-col min-h-[55vh] relative pt-16 pb-20 px-8 md:px-16 bg-[url('/bg.png')] bg-cover bg-center bg-no-repeat">
        
        {/* Cards Container */}
        <div className="flex-1 flex items-center justify-center mt-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-6xl w-full mx-auto">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-10 flex flex-col justify-center min-h-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <span className="text-[32px] md:text-[40px] leading-tight text-text-main font-header">
                O(1)<br />lookup time
              </span>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-10 flex flex-col justify-center min-h-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <span className="text-[32px] md:text-[40px] leading-tight text-text-main font-header">
                ∞<br />documents
              </span>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-10 flex flex-col justify-center min-h-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
            >
              <span className="text-[32px] md:text-[40px] leading-tight text-text-main font-header">
                3<br />file formats
              </span>
            </motion.div>

          </div>
        </div>
      </div>

      {/* Bottom Section - White Background */}
      <div className="w-full bg-white px-8 md:px-16 py-16 md:py-24 flex items-center justify-center">
        <div className="max-w-6xl w-full flex flex-col md:flex-row justify-between items-center gap-12 relative md:pb-8">
          
          {/* Left Text */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col"
          >
            <h1 className="text-[64px] md:text-[80px] font-bold font-header tracking-tight leading-none mb-6 text-text-main">
              findit
            </h1>
            <div className="text-[18px] md:text-[20px] leading-snug text-text-main font-normal font-sans">
              upload your documents. search semantically.<br />
              results ranked by relevance - not recency.
            </div>
          </motion.div>

          {/* Right Action */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex"
          >
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-[24px] md:text-[28px] font-semibold font-header text-text-main hover:opacity-70 transition-opacity group"
            >
              <span>try now</span>
              <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* made by smhsneh */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="absolute -bottom-12 md:-bottom-16 left-0"
          >
            <span className="text-[14px] font-normal font-sans text-text-main/50 tracking-wide">
              made by smhsneh
            </span>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
