import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, FileText, ChevronRight } from 'lucide-react';
import { uploadFile } from '../services/api';

export default function UploadPanel({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [logs, setLogs] = useState([
    { type: 'info', text: 'system standby. awaiting document upload...' }
  ]);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef(null);

  const addLog = (text, type = 'info') => {
    setLogs(prev => [...prev, { type, text, time: new Date().toLocaleTimeString().toLowerCase() }]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setLogs([]);
    setProgress(0);
    
    const fileName = file.name.toLowerCase();
    addLog(`initiating transfer for ${fileName}...`, 'info');
    
    // progress bar animation
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 10;
      });
    }, 100);

    // simulate text extraction phases
    setTimeout(() => addLog(`file type: ${fileName.split('.').pop()} detected.`, 'info'), 300);
    setTimeout(() => addLog(`extracting raw text content stream...`, 'info'), 600);
    setTimeout(() => addLog(`running tokenizer and filtering stop-words...`, 'info'), 900);
    
    try {
      let fileText = '';
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          fileText = e.target.result;
          const newDoc = await uploadFile(file, fileText);
          addLog(`tokens extracted. updating inverted index.`, 'success');
          addLog(`index rebuild complete. document id: ${newDoc.id} [ok]`, 'success');
          setIsUploading(false);
          if (onUploadComplete) onUploadComplete();
        };
        reader.readAsText(file);
      } else {
        // PDF or DOCX - mock extraction in API layer
        const newDoc = await uploadFile(file);
        addLog(`tokens extracted. updating inverted index.`, 'success');
        addLog(`index rebuild complete. document id: ${newDoc.id} [ok]`, 'success');
        setIsUploading(false);
        if (onUploadComplete) onUploadComplete();
      }
    } catch (err) {
      addLog(`critical error: failed to extract document.`, 'error');
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // generate block-like progress bar: e.g. ■■■■■□□□□□
  const renderProgressBar = () => {
    const blocksCount = 20;
    const filledCount = Math.floor((progress / 100) * blocksCount);
    let barStr = '';
    for (let i = 0; i < blocksCount; i++) {
      barStr += i < filledCount ? '■' : '□';
    }
    return (
      <div className="font-mono text-xs mt-2 flex items-center justify-between text-black">
        <span>progress: {barStr}</span>
        <span>{progress}%</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className={`terminal-border p-6 text-center cursor-pointer transition-colors ${
          dragActive ? 'bg-steel-light/30' : 'bg-white'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileInput}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.docx,.txt"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="p-3 bg-lavender rounded-none border border-black inline-block">
            <Upload size={24} className="text-black" />
          </div>
          <div className="font-mono text-sm text-black">
            <span className="font-bold underline">click to upload</span> or drag and drop
          </div>
          <div className="font-mono text-xs text-steel-dark">
            supports pdf, docx, txt files
          </div>
        </div>
      </div>

      {/* Terminal log panel */}
      <div className="terminal-border bg-black text-[#e6e6fa] p-4 font-mono text-xs min-h-[140px] max-h-[180px] overflow-y-auto flex flex-col gap-1 scanlines">
        <div className="border-b border-[#e6e6fa]/30 pb-1.5 mb-1.5 flex justify-between items-center text-steel-light text-[10px]">
          <span>findit document parser console v1.0</span>
          <span>online</span>
        </div>
        {logs.map((log, index) => (
          <div key={index} className="flex gap-2.5 items-start">
            <span className="text-steel-medium">
              <ChevronRight size={10} className="inline" />
            </span>
            <span className="flex-1">
              {log.text}
            </span>
          </div>
        ))}
        {isUploading && renderProgressBar()}
      </div>
    </div>
  );
}
