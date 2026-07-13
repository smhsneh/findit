import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Grainient from '../components/Grainient';
import GlassSurface from '../components/GlassSurface';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col text-white overflow-hidden bg-black font-body relative justify-center items-center">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Grainient
          color1="#000000"
          color2="#222222"
          color3="#666666"
          timeSpeed={0.85}
          colorBalance={0.0}
          warpStrength={1.0}
          warpFrequency={5.0}
          warpSpeed={2.0}
          warpAmplitude={28}
          blendAngle={0.0}
          blendSoftness={0.05}
          rotationAmount={500.0}
          noiseScale={2.0}
          grainAmount={0.1}
          grainScale={2.0}
          grainAnimated={false}
          contrast={1.5}
          gamma={1.0}
          saturation={1.0}
          centerX={0.0}
          centerY={0.0}
          zoom={0.9}
        />
      </div>

      <div className="relative z-10 w-full px-8 md:px-16 max-w-5xl mx-auto flex flex-col items-center justify-center gap-10 md:gap-14">
        
        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl mx-auto">
          
          {/* Card 1 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="h-full">
            <GlassSurface width="100%" height="100%" borderRadius={30} backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20}>
              <div className="flex flex-col justify-center items-center p-4 w-full h-full min-h-[120px] text-white text-center">
                <span className="text-[18px] md:text-[22px] leading-tight font-header">
                  O(1)<br />lookup time
                </span>
              </div>
            </GlassSurface>
          </motion.div>

          {/* Card 2 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="h-full">
            <GlassSurface width="100%" height="100%" borderRadius={30} backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20}>
              <div className="flex flex-col justify-center items-center p-4 w-full h-full min-h-[120px] text-white text-center">
                <span className="text-[18px] md:text-[22px] leading-tight font-header">
                  ∞<br />documents
                </span>
              </div>
            </GlassSurface>
          </motion.div>

          {/* Card 3 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="h-full">
            <GlassSurface width="100%" height="100%" borderRadius={30} backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20}>
              <div className="flex flex-col justify-center items-center p-4 w-full h-full min-h-[120px] text-white text-center">
                <span className="text-[18px] md:text-[22px] leading-tight font-header">
                  3<br />file formats
                </span>
              </div>
            </GlassSurface>
          </motion.div>

        </div>

        {/* Bottom Text & Action Container */}
        <div className="flex flex-col items-center text-center gap-6 md:gap-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center"
          >
            <h1 className="text-[54px] md:text-[80px] font-bold font-header tracking-tight leading-none mb-4 text-white drop-shadow-sm">
              findit
            </h1>
            <div className="text-[16px] md:text-[18px] leading-snug text-white/90 font-normal font-sans max-w-2xl">
              upload your documents. search semantically.<br />
              results ranked by relevance - not recency.
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button onClick={() => navigate('/dashboard')} className="group">
              <GlassSurface width={200} height={56} borderRadius={28} backgroundOpacity={0.1} saturation={1} borderWidth={0.07} brightness={50} opacity={0.93} blur={11} displace={0.5} distortionScale={-180} redOffset={0} greenOffset={10} blueOffset={20}>
                <div className="flex items-center gap-2 text-[16px] font-semibold font-header text-white hover:opacity-80 transition-opacity w-full h-full justify-center">
                  <span>try now</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </GlassSurface>
            </button>
          </motion.div>

        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute bottom-6 w-full text-center z-10"
      >
        <span className="text-[12px] font-normal font-sans text-white/50 tracking-wide">
          made by smhsneh
        </span>
      </motion.div>
    </div>
  );
}
