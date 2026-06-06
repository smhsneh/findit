import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDocuments,
  searchDocuments,
  getSearchHistory,
  getStats,
  deleteDocument
} from '../services/api';
import SearchBar from '../components/searchbar';
import UploadPanel from '../components/uploadpanel';
import ResultsList from '../components/resultslist';
import PreviewPane from '../components/previewpane';
import {
  FileText,
  Layers,
  Search,
  Clock,
  Upload,
  ChevronDown,
  X,
  History,
  User
} from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, totalTerms: 0, totalSearches: 0 });
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const refreshData = () => {
    setDocuments(getDocuments());
    setHistory(getSearchHistory());
    setStats(getStats());
  };

  useEffect(() => { refreshData(); }, []);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) { setResults([]); return; }
    const searchResults = searchDocuments(searchQuery);
    setResults(searchResults);
    refreshData();
    if (searchResults.length > 0) setSelectedDocId(searchResults[0].id);
  };

  const handleDeleteDoc = (docId) => {
    deleteDocument(docId);
    if (selectedDocId === docId) setSelectedDocId(null);
    refreshData();
    if (query) setResults(searchDocuments(query));
  };

  const handleSelectQuery = (q) => handleSearch(q);
  const handleClearHistory = () => { /* could clear history */ };

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="min-h-screen font-body">
      {/* ── Upload Slide-Over Drawer ── */}
      <AnimatePresence>
        {showUploadDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-40"
              onClick={() => setShowUploadDrawer(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold text-text-main">upload document</h2>
                <button
                  onClick={() => setShowUploadDrawer(false)}
                  className="p-2 rounded-btn text-text-muted hover:text-text-main hover:bg-background transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <UploadPanel onUploadComplete={() => {
                  refreshData();
                  setTimeout(() => setShowUploadDrawer(false), 1800);
                }} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Top Navigation ── */}
      <nav className="pt-8 pb-4 h-auto min-h-[88px] max-w-container mx-auto px-8 flex items-center justify-between">
        {/* Brand */}
        <div className="flex flex-col">
          <span className="font-header text-[34px] font-bold text-text-main tracking-[-0.03em] leading-none">
            findit
          </span>
          <span className="text-[13px] text-text-muted font-medium mt-1">
            intelligent document search & indexing
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => setActiveTab('search')}
            className={`text-[15px] font-semibold pb-1 border-b-2 transition-all ${activeTab === 'search' ? 'text-[#3f303d] border-[#3f303d]' : 'text-text-muted border-transparent hover:text-[#3f303d]'}`}
          >
            search
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`text-[15px] font-semibold pb-1 border-b-2 transition-all ${activeTab === 'documents' ? 'text-[#3f303d] border-[#3f303d]' : 'text-text-muted border-transparent hover:text-[#3f303d]'}`}
          >
            documents
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowUploadDrawer(true)}
            className="px-3 py-2 flex items-center justify-center text-[#0a0908] hover:opacity-70 transition-all gap-2"
          >
            <Upload size={20} />
            <span className="font-semibold text-[15px]">upload</span>
          </motion.button>

          <div className="flex items-center gap-2 cursor-pointer group p-2 hover:opacity-70 transition-opacity">
            <div className="flex items-center justify-center text-[#0a0908]">
              <User size={22} />
            </div>
            <ChevronDown size={16} className="text-[#0a0908]" />
          </div>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div className="max-w-container mx-auto px-8 pb-12 flex flex-col gap-8">

        {activeTab === 'search' ? (
          <>
            {/* Hero Search */}
        <div className="flex justify-center pt-2 pb-2">
          <div className="w-full max-w-[1000px]">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/75 backdrop-blur-md border border-[#e9d5e6] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-[24px] bg-[#e9d5e6]/30 flex items-center justify-center shrink-0 text-[#0a0908]">
              <FileText size={22} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[32px] font-bold font-header leading-none text-text-main truncate">{stats.totalDocs}</span>
              <span className="text-[13px] text-text-muted font-medium mt-1">documents</span>
              <span className="text-[11px] text-text-light">total uploaded</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#e9d5e6]/80 backdrop-blur-md border border-[#e9d5e6]/50 rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-[24px] bg-[#3f303d]/10 flex items-center justify-center shrink-0 text-[#3f303d]">
              <Layers size={22} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[32px] font-bold font-header leading-none text-[#3f303d] truncate">{stats.totalTerms.toLocaleString()}</span>
              <span className="text-[13px] text-[#3f303d] font-medium mt-1">indexed terms</span>
              <span className="text-[11px] text-[#3f303d]">across all documents</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/75 backdrop-blur-md border border-[#e9d5e6] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-[24px] bg-[#e9d5e6]/30 flex items-center justify-center shrink-0 text-[#0a0908]">
              <Search size={22} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[32px] font-bold font-header leading-none text-text-main truncate">{stats.totalSearches.toLocaleString()}</span>
              <span className="text-[13px] text-text-muted font-medium mt-1">total searches</span>
              <span className="text-[11px] text-text-light">queries performed</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#e9d5e6]/80 backdrop-blur-md border border-[#e9d5e6]/50 rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-[24px] bg-[#3f303d]/10 flex items-center justify-center shrink-0 text-[#3f303d]">
              <Clock size={22} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg font-bold font-header leading-tight text-[#3f303d] truncate">
                {history.length > 0 ? history[0].query : '—'}
              </span>
              <span className="text-[13px] text-[#3f303d] font-medium mt-1">recent search</span>
              <span className="text-[11px] text-[#3f303d]">
                {history.length > 0 ? '2 minutes ago' : 'no searches yet'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Recent Searches Moved Here */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="flex items-center justify-center gap-4 pt-4 pb-4 flex-wrap"
          >
            <span className="text-[13px] text-text-muted font-semibold shrink-0">recent searches</span>
            <div className="flex items-center gap-3 flex-wrap">
              {history.map((item, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ y: -2 }}
                  onClick={() => handleSelectQuery(item.query)}
                  className="bg-white text-graphite text-[13px] font-medium px-4 py-2.5 rounded-full shadow-[0_4px_12px_rgba(0,0,0,.03)] border border-stormy-teal/20 hover:shadow-soft transition-shadow flex items-center gap-2 group"
                >
                  <History size={12} className="text-text-light" />
                  <span>{item.query}</span>
                </motion.button>
              ))}
              <button className="text-[13px] text-text-main font-semibold hover:opacity-70 transition-opacity">
                clear all
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start min-h-[500px]">
          {/* Results Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/75 backdrop-blur-md rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] min-h-[500px] border border-black/[0.08]"
          >
            <ResultsList
              results={results}
              query={query}
              selectedDocId={selectedDocId}
              onSelectDoc={setSelectedDocId}
            />
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <PreviewPane
              doc={selectedDoc}
              searchQuery={query}
              onDeleteDoc={handleDeleteDoc}
            />
          </motion.div>
        </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-8 min-h-[500px]"
          >
            <h2 className="text-[28px] font-bold font-header text-text-main">all documents</h2>
            <div className="bg-white/75 backdrop-blur-md rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-[#e9d5e6]">
              <div className="flex flex-col gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="flex items-center justify-between p-4 rounded-xl border border-black/[0.08] hover:bg-black/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[24px] bg-[#e9d5e6]/30 flex items-center justify-center text-[#0a0908]">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[16px] text-text-main font-header">{doc.fileName}</span>
                        <span className="text-[13px] text-text-muted mt-0.5">{doc.type || 'pdf'} document</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                       <X size={18} />
                    </button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-16 text-[15px] font-medium text-text-muted">
                    no documents uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-[13px] text-text-muted font-medium">
          made by smhsneh
        </footer>
      </div>
    </div>
  );
}
