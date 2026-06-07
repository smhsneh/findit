import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getDocuments,
  searchDocuments,
  getSearchHistory,
  clearSearchHistory,
  getStats,
  deleteDocument,
  getTerms,
  saveSearchQuery
} from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  User,
  Folder,
  LogOut
} from 'lucide-react';

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [terms, setTerms] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, totalTerms: 0, totalSearches: 0 });
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [showUploadDrawer, setShowUploadDrawer] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  const refreshData = async () => {
    const fetchedDocs = await getDocuments();
    setDocuments(fetchedDocs);
    setHistory(getSearchHistory());
    
    const fetchedStats = await getStats();
    setStats(fetchedStats);

    const fetchedTerms = await getTerms();
    setTerms(fetchedTerms);
  };

  useEffect(() => { refreshData(); }, []);

  const handleSearch = async (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) { setResults([]); return; }
    
    saveSearchQuery(searchQuery);
    const searchResults = await searchDocuments(searchQuery);
    setResults(searchResults);
    await refreshData();
    if (searchResults.length > 0) setSelectedDocId(searchResults[0].id);
  };

  const handleDeleteDoc = async (docId) => {
    await deleteDocument(docId);
    if (selectedDocId === docId) setSelectedDocId(null);
    await refreshData();
    if (query) {
      const searchResults = await searchDocuments(query);
      setResults(searchResults);
    }
  };

  const handleSelectQuery = (q) => handleSearch(q);
  const handleClearHistory = () => {
    clearSearchHistory();
    setHistory([]);
    refreshData();
  };

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
        <div className="flex flex-col flex-1">
          <Link to="/" className="font-header text-[34px] font-bold text-white tracking-[-0.03em] leading-none hover:opacity-80 transition-opacity">
            findit
          </Link>
          <span className="text-[13px] text-white/70 font-medium mt-1">
            intelligent document search & indexing
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center justify-center gap-3">
          <button 
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 flex items-center justify-center rounded-xl transition-all gap-2 ${activeTab === 'search' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'}`}
          >
            <Search size={18} />
            <span className="font-semibold text-[15px]">search</span>
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 flex items-center justify-center rounded-xl transition-all gap-2 ${activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'}`}
          >
            <Folder size={18} />
            <span className="font-semibold text-[15px]">documents</span>
          </button>
          <button
            onClick={() => setShowUploadDrawer(true)}
            className="px-4 py-2 flex items-center justify-center rounded-xl transition-all gap-2 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
          >
            <Upload size={18} />
            <span className="font-semibold text-[15px]">upload</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end relative">

          <div 
            className="flex items-center gap-2 cursor-pointer group p-2 hover:opacity-70 transition-opacity"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="flex items-center justify-center text-white">
              <User size={22} />
            </div>
            <ChevronDown size={16} className="text-white" />
          </div>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-12 right-0 mt-2 w-48 bg-white border border-black/[0.08] shadow-xl rounded-2xl overflow-hidden z-50"
              >
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  <span>log out</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ── Page Content ── */}
      <div className="max-w-container mx-auto px-8 pb-12 flex flex-col gap-8">

        {activeTab === 'search' ? (
          <>
            {/* Hero Search */}
        <div className="flex justify-center pt-2 pb-10 flex-col items-center gap-3">
          <div className="w-full max-w-[640px]">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
          
          {/* Recent Searches */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full max-w-[640px] flex items-center gap-4 px-2 flex-wrap"
            >
              <span className="text-[12px] text-white/50 font-semibold shrink-0 uppercase tracking-wider">recent</span>
              <div className="flex items-center gap-4 flex-wrap">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectQuery(item.query)}
                    className="text-white/80 text-[13px] hover:text-white hover:underline transition-all flex items-center gap-1.5"
                  >
                    <History size={12} className="opacity-50" />
                    <span>{item.query}</span>
                  </button>
                ))}
                <button 
                  onClick={handleClearHistory}
                  className="text-[12px] text-white/40 hover:text-white transition-colors ml-2"
                >
                  clear all
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Stats Row */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-[#034078]/20 flex items-center justify-center shrink-0 text-[#034078]">
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
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-[#002855]/10 flex items-center justify-center shrink-0 text-text-main">
                <Layers size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[32px] font-bold font-header leading-none text-text-main truncate">{(stats.totalTerms || 0).toLocaleString()}</span>
                <span className="text-[13px] text-text-muted font-medium mt-1">indexed terms</span>
                <span className="text-[11px] text-text-light">across all documents</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-[#034078]/20 flex items-center justify-center shrink-0 text-[#034078]">
                <Search size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[32px] font-bold font-header leading-none text-text-main truncate">{(stats.totalSearches || 0).toLocaleString()}</span>
                <span className="text-[13px] text-text-muted font-medium mt-1">total searches</span>
                <span className="text-[11px] text-text-light">queries performed</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-[#002855]/10 flex items-center justify-center shrink-0 text-text-main">
                <Clock size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold font-header leading-tight text-text-main truncate">
                  {history.length > 0 ? history[0].query : '—'}
                </span>
                <span className="text-[13px] text-text-muted font-medium mt-1">recent search</span>
                <span className="text-[11px] text-text-light">
                  {history.length > 0 ? '2 minutes ago' : 'no searches yet'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>



        {/* Main Workspace */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 items-start min-h-[500px]">
            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full min-h-[500px]"
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
              className="h-full"
            >
              <PreviewPane
                doc={selectedDoc}
                searchQuery={query}
                onDeleteDoc={handleDeleteDoc}
              />
            </motion.div>
          </div>

          {/* Indexed Terms Card */}
          {terms.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white border border-[#034078]/20 rounded-2xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-lg font-bold font-header text-text-main mb-4">indexed dictionary</h3>
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2">
                {terms.map((term, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-[#002855]/10 text-text-main text-[13px] font-semibold rounded-md shadow-sm"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-8 min-h-[500px]"
          >
            <h2 className="text-[28px] font-bold font-header text-white px-2">all documents</h2>
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-white flex items-center justify-between p-5 rounded-2xl border border-[#034078]/20 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[24px] bg-[#034078]/10 flex items-center justify-center shrink-0 text-[#034078]">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[16px] text-text-main font-header">{doc.fileName}</span>
                        <span className="text-[13px] text-text-muted mt-0.5">{doc.type || 'pdf'} document</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-red-500 hover:bg-red-50 hover:scale-110 rounded-lg transition-all" title="Delete Document">
                       <X size={18} />
                    </button>
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="text-center py-16 text-[15px] font-medium text-white/70">
                    no documents uploaded yet.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <footer className="text-center pt-8 pb-4 text-[13px] text-white/50 font-medium">
          made by smhsneh
        </footer>
      </div>
    </div>
  );
}
