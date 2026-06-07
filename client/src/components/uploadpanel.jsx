import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { uploadFile } from '../services/api';
import toast from 'react-hot-toast';

export default function UploadPanel({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setProgress(0);

    const fileName = file.name.toLowerCase();
    
    // Fake progress animation
    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 10; });
    }, 150);

    try {
      const response = await uploadFile(file);
      clearInterval(interval);
      setProgress(100);
      toast.success(`Successfully uploaded and indexed ${fileName}!`);
      setIsUploading(false);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      clearInterval(interval);
      toast.error(`Failed to process ${fileName}. Ensure it's a valid PDF, DOCX, or TXT file.`);
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  return (
    <div className="w-full flex justify-center py-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-2xl relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center min-h-[220px] p-8 text-center bg-white/40 backdrop-blur-sm
          ${dragActive ? 'border-stormy-teal bg-stormy-teal/5 scale-[1.02]' : 'border-black/[0.15] hover:border-black/30'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          onChange={handleChange}
          accept=".pdf,.docx,.txt"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-4 w-full max-w-sm">
            <div className="w-12 h-12 border-4 border-[#002855]/20 border-t-[#002855] rounded-full animate-spin"></div>
            <div className="flex flex-col items-center gap-1 w-full mt-2">
              <span className="text-[15px] font-semibold text-text-main">Indexing document...</span>
              <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden mt-3">
                <motion.div 
                  className="h-full bg-[#002855]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 rounded-[24px] bg-white shadow-soft flex items-center justify-center text-text-main mb-4 group-hover:scale-110 transition-transform">
              <Upload size={28} />
            </div>
            
            <h3 className="text-xl font-bold font-header text-text-main mb-2">
              Upload Document
            </h3>
            <p className="text-[15px] text-text-muted max-w-sm leading-relaxed mb-6">
              Drag and drop your PDF, DOCX, or TXT files here to add them to your knowledge base.
            </p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-text-main text-white px-6 py-2.5 rounded-full font-semibold text-[14px] hover:bg-text-main/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              Select File
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
