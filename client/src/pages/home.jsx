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
  saveSearchQuery,
  deleteAccount,
  resetIndexedData
} from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBar from '../components/searchbar';
import UploadPanel from '../components/uploadpanel';
import ResultsList from '../components/resultslist';
import PreviewPane from '../components/previewpane';
import { Sidebar, SidebarBody, SidebarLink } from '../components/ui/sidebar';
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
  LogOut,
  Trash2,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  const [openSidebar, setOpenSidebar] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: '', message: '', action: null });

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

  const handleResetData = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Data',
      message: 'Are you sure you want to reset all indexed data and search history? This cannot be undone.',
      action: async () => {
        try {
          await resetIndexedData();
          clearSearchHistory();
          setHistory([]);
          await refreshData();
          toast.success('Indexed data reset successfully.');
          setShowUserMenu(false);
        } catch (err) {
          toast.error('Failed to reset data.');
        }
      }
    });
  };

  const handleDeleteAccount = async () => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to completely delete your account? This will erase all your data forever.',
      action: async () => {
        try {
          await deleteAccount();
          toast.success('Account deleted successfully.');
          logout();
          navigate('/signup');
        } catch (err) {
          toast.error('Failed to delete account.');
        }
      }
    });
  };

  const selectedDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="flex h-screen w-full bg-black font-body overflow-hidden">
      {/* ── Upload Slide-Over Drawer ── */}
      <AnimatePresence>
        {showUploadDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-[60]"
              onClick={() => setShowUploadDrawer(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#1C1C1C] shadow-2xl z-[70] flex flex-col border-l border-white/5"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-xl font-semibold text-white">upload document</h2>
                <button
                  onClick={() => setShowUploadDrawer(false)}
                  className="p-2 rounded-btn text-white/50 hover:text-white hover:bg-white/10 transition-colors"
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

      {/* ── Sidebar ── */}
      <Sidebar open={openSidebar} setOpen={setOpenSidebar} animate={false}>
        <SidebarBody className="bg-black dark:bg-black border-r border-white/5 justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 py-1 px-2 text-white font-header text-[28px] font-bold tracking-tight mb-8">
              findit
            </Link>
            <div className="flex flex-col gap-2">
              <SidebarLink 
                link={{
                  label: "search",
                  icon: <Search className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: () => setActiveTab('search')
                }}
                className={activeTab === 'search' ? 'bg-white/10 rounded-xl' : 'hover:bg-white/5 rounded-xl'}
              />
              <SidebarLink 
                link={{
                  label: "documents",
                  icon: <Folder className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: () => setActiveTab('documents')
                }}
                className={activeTab === 'documents' ? 'bg-white/10 rounded-xl' : 'hover:bg-white/5 rounded-xl'}
              />
              <SidebarLink 
                link={{
                  label: "upload",
                  icon: <Upload className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: () => setShowUploadDrawer(true)
                }}
                className="hover:bg-white/5 rounded-xl"
              />

              <SidebarLink 
                link={{
                  label: "reset data",
                  icon: <RefreshCw className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: handleResetData
                }}
                className="hover:bg-white/5 rounded-xl"
              />
              <SidebarLink 
                link={{
                  label: "log out",
                  icon: <LogOut className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: () => { logout(); navigate('/login'); }
                }}
                className="hover:bg-white/5 rounded-xl"
              />
              <SidebarLink 
                link={{
                  label: "delete account",
                  icon: <Trash2 className="text-white/70 h-5 w-5 shrink-0" />,
                  onClick: handleDeleteAccount
                }}
                className="hover:bg-white/5 rounded-xl text-white/70"
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-y-auto relative bg-[#121212]">
        <div className="max-w-container mx-auto px-8 pt-8 pb-12 flex flex-col gap-8">

        {activeTab === 'search' ? (
          <>
            {/* Hero Search */}
        <div className="flex justify-center pt-2 pb-10 flex-col items-center gap-3">
          <div className="w-full max-w-[480px]">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>
          
          {/* Recent Searches */}
          {history.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="w-full max-w-[480px] flex items-center gap-4 px-2 flex-wrap"
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
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 text-white">
                <FileText size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[32px] font-bold font-header leading-none text-white truncate">{stats.totalDocs}</span>
                <span className="text-[13px] text-white/60 font-medium mt-1">documents</span>
                <span className="text-[11px] text-white/40">total uploaded</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 text-white">
                <Layers size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[32px] font-bold font-header leading-none text-white truncate">{(stats.totalTerms || 0).toLocaleString()}</span>
                <span className="text-[13px] text-white/60 font-medium mt-1">indexed terms</span>
                <span className="text-[11px] text-white/40">across all documents</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 text-white">
                <Search size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[32px] font-bold font-header leading-none text-white truncate">{(stats.totalSearches || 0).toLocaleString()}</span>
                <span className="text-[13px] text-white/60 font-medium mt-1">total searches</span>
                <span className="text-[11px] text-white/40">queries performed</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 text-white">
                <Clock size={22} />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-lg font-bold font-header leading-tight text-white truncate">
                  {history.length > 0 ? history[0].query : '—'}
                </span>
                <span className="text-[13px] text-white/60 font-medium mt-1">recent search</span>
                <span className="text-[11px] text-white/40">
                  {history.length > 0 ? '2 minutes ago' : 'no searches yet'}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex flex-col gap-6 items-stretch min-h-[500px]">
            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm h-full min-h-[500px]"
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
              className="bg-[#1C1C1C] border border-white/5 rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-lg font-bold font-header text-white mb-4">indexed dictionary</h3>
              <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2">
                {terms.map((term, idx) => (
                  <span 
                    key={idx} 
                    className="px-3 py-1 bg-white/5 text-white/90 text-[13px] font-semibold rounded-md shadow-sm"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl mx-auto flex flex-col gap-6 pt-8 min-h-[500px]"
          >
            <h2 className="text-[28px] font-bold font-header text-white px-2">all documents</h2>
            <div className="bg-[#1C1C1C] border border-white/5 rounded-3xl p-8 shadow-2xl">
              <div className="flex flex-col gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-white/5 flex items-center justify-between p-5 rounded-2xl border border-white/5 shadow-sm hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[24px] bg-white/5 flex items-center justify-center shrink-0 text-white">
                        <FileText size={20} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[16px] text-white font-header">{doc.fileName}</span>
                        <span className="text-[13px] text-white/60 mt-0.5">{doc.type || 'pdf'} document</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteDoc(doc.id)} className="p-2 text-white/50 hover:text-red-500 hover:bg-red-500/10 hover:scale-110 rounded-lg transition-all" title="Delete Document">
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
      </div>

      {/* Footer */}
      <footer className="text-center pt-8 pb-4 text-[13px] text-white/50 font-medium">
        made by smhsneh
      </footer>
      </main>

      {/* ── Confirmation Modal ── */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-sm bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col gap-4"
            >
              <h3 className="text-xl font-bold text-white font-header">{confirmModal.title}</h3>
              <p className="text-[14px] text-white/70 leading-relaxed font-sans">
                {confirmModal.message}
              </p>
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-semibold text-[14px] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.action();
                    setConfirmModal({ ...confirmModal, isOpen: false });
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white font-semibold text-[14px] transition-all"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
