import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload } from 'lucide-react';
import { uploadFile } from '../services/api';

export default function UploadPanel({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { type, text }]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const processFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setLogs([]);
    setProgress(0);

    const fileName = file.name.toLowerCase();
    addLog(`uploading ${fileName}...`);

    const interval = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(interval); return 100; } return p + 10; });
    }, 100);

    setTimeout(() => addLog(`file type: ${fileName.split('.').pop()} detected`), 300);
    setTimeout(() => addLog('extracting text content...'), 600);
    setTimeout(() => addLog('tokenizing and building index...'), 900);

    try {
      let fileText = '';
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          fileText = e.target.result;
          const newDoc = await uploadFile(file, fileText);
          addLog(`indexed successfully — id: ${newDoc.id}`, 'success');
          setIsUploading(false);
          if (onUploadComplete) onUploadComplete();
        };
        reader.readAsText(file);
      } else {
        const newDoc = await uploadFile(file);
        addLog(`indexed successfully — id: ${newDoc.id}`, 'success');
        setIsUploading(false);
        if (onUploadComplete) onUploadComplete();
      }
    } catch {
      addLog('failed to process document.', 'error');
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
    <div className="flex flex-col gap-5">
      <div
        className={`border-2 border-dashed p-10 text-center cursor-pointer rounded-card transition-all ${
          dragActive
            ? 'border-stormy-teal bg-stormy-teal/5'
            : 'border-dust-grey hover:border-stormy-teal/50 bg-background'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.txt" onChange={handleChange} />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-yale-blue/10 flex items-center justify-center text-yale-blue">
            <Upload size={24} />
          </div>
          <div className="text-[15px] text-text-main font-medium">
            <span className="font-semibold text-yale-blue underline underline-offset-2">click to upload</span> or drag and drop
          </div>
          <span className="text-[13px] text-text-muted">pdf, docx, txt • max 10mb</span>
        </div>
      </div>

      {isUploading && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-card p-5 flex flex-col gap-4"
        >
          <div className="flex justify-between text-[13px] font-semibold text-text-main">
            <span>processing...</span>
            <span className="text-stormy-teal">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-dust-grey/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-stormy-teal rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.15 }}
            />
          </div>
          <div className="flex flex-col gap-2 text-[13px] text-text-muted font-medium">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  log.type === 'success' ? 'bg-green-500' : 'bg-stormy-teal animate-pulse'
                }`} />
                <span>{log.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
