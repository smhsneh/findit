import React, { useState, useEffect } from 'react';
import { 
  getDocuments, 
  searchDocuments, 
  getSearchHistory, 
  getStats, 
  deleteDocument,
  tokenize
} from '../services/api';
import SearchBar from '../components/searchbar';
import UploadPanel from '../components/uploadpanel';
import ResultsList from '../components/resultslist';
import PreviewPane from '../components/previewpane';
import SearchHistory from '../components/searchhistory';
import { Database, FileText, BarChart3, Trash2, Cpu, RefreshCw } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, totalTerms: 0, totalSearches: 0 });
  const [selectedDocId, setSelectedDocId] = useState(null);

  // load all data from mock search engine
  const refreshData = () => {
    setDocuments(getDocuments());
    setHistory(getSearchHistory());
    setStats(getStats());
  };

  useEffect(() => {
    refreshData();
  }, []);

  // handle execution of search query
  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const searchResults = searchDocuments(searchQuery);
    setResults(searchResults);
    refreshData(); // update stats and history logs
    
    // auto select the highest scoring match if any results
    if (searchResults.length > 0) {
      setSelectedDocId(searchResults[0].id);
    }
  };

  // handle quick search from history
  const handleSelectQuery = (historyQuery) => {
    handleSearch(historyQuery);
  };

  // delete document handler
  const handleDeleteDoc = (docId) => {
    deleteDocument(docId);
    if (selectedDocId === docId) {
      setSelectedDocId(null);
    }
    refreshData();
    // re-run search if query is active
    if (query) {
      const searchResults = searchDocuments(query);
      setResults(searchResults);
    }
  };

  // get selected document detail
  const selectedDoc = documents.find(d => d.id === selectedDocId);

  return (
    <div className="min-h-screen bg-lavender-light flex flex-col p-4 sm:p-6 lg:p-8 font-body">
      {/* Top Header navbar */}
      <header className="border-2 border-black bg-white p-4 mb-6 flex justify-between items-center shadow-[4px_4px_0px_0px_#000000] select-none">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-brand-dark text-[#e6e6fa] border border-black rounded-none flex items-center justify-center">
            <Database size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="font-header text-xl sm:text-2xl text-black tracking-wider leading-none">
              findit
            </h1>
            <span className="font-mono text-[9px] sm:text-[10px] text-steel-dark font-semibold">
              intelligent inverted index document search engine
            </span>
          </div>
        </div>
        <div className="font-mono text-xs text-black border border-black px-2.5 py-1 bg-lavender hidden sm:flex items-center gap-1.5 font-bold">
          <Cpu size={12} />
          <span>core status: online</span>
        </div>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
        {/* Left Sidebar - spans 3 columns on large screens */}
        <aside className="lg:col-span-3 flex flex-col gap-6">
          {/* Stats Box */}
          <div className="terminal-border p-4 bg-white flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b border-black pb-1.5 font-mono text-xs font-bold text-black select-none">
              <BarChart3 size={14} className="text-black" />
              <span>index statistics</span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="border border-black p-2 bg-lavender-light/40">
                <div className="text-sm font-bold text-black leading-none">{stats.totalDocs}</div>
                <div className="text-[9px] text-steel-dark mt-1">documents</div>
              </div>
              <div className="border border-black p-2 bg-lavender-light/40">
                <div className="text-sm font-bold text-black leading-none">
                  {stats.totalTerms.toLocaleString()}
                </div>
                <div className="text-[9px] text-steel-dark mt-1">terms</div>
              </div>
              <div className="border border-black p-2 bg-lavender-light/40">
                <div className="text-sm font-bold text-black leading-none">
                  {stats.totalSearches.toLocaleString()}
                </div>
                <div className="text-[9px] text-steel-dark mt-1">queries</div>
              </div>
            </div>
          </div>

          {/* Upload Documents Box */}
          <div className="terminal-border p-4 bg-white flex flex-col gap-3">
            <div className="font-mono text-xs font-bold text-black border-b border-black pb-1.5 select-none">
              upload document
            </div>
            <UploadPanel onUploadComplete={refreshData} />
          </div>

          {/* Document list box */}
          <div className="terminal-border p-4 bg-white flex flex-col gap-2.5">
            <div className="flex items-center justify-between border-b border-black pb-1.5 font-mono text-xs font-bold text-black select-none">
              <span>indexed files</span>
              <button 
                onClick={refreshData}
                className="text-[9px] underline text-steel-dark hover:text-black flex items-center gap-0.5"
              >
                <RefreshCw size={8} />
                <span>refresh</span>
              </button>
            </div>
            
            <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto font-mono text-xs">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`flex justify-between items-center p-1.5 hover:bg-lavender-light cursor-pointer group text-black ${
                    selectedDocId === doc.id ? 'bg-lavender border border-black' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <FileText size={12} className="text-steel-dark group-hover:text-black shrink-0" />
                    <span className="truncate">{doc.fileName}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteDoc(doc.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 hover:text-red-600 p-0.5 text-black"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* History widget */}
          <SearchHistory history={history} onSelectQuery={handleSelectQuery} />
        </aside>

        {/* Center Panel (Search + Results) - spans 5 columns */}
        <main className="lg:col-span-5 flex flex-col gap-6 h-full">
          <div className="terminal-border p-4 bg-white flex flex-col gap-4">
            <SearchBar onSearch={handleSearch} initialValue={query} />
          </div>

          <div className="terminal-border p-4 bg-white flex-1 min-h-[400px]">
            {query ? (
              <ResultsList
                results={results}
                selectedDocId={selectedDocId}
                onSelectDoc={setSelectedDocId}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 gap-3 min-h-[350px] select-none">
                <Database size={36} className="text-steel-dark" />
                <h3 className="font-header text-sm text-black">search standby mode</h3>
                <p className="font-mono text-xs text-steel-dark max-w-xs leading-relaxed">
                  input query above to scan the inverted index and compute tf-idf document relevance scores.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Right Panel (Document Preview) - spans 4 columns */}
        <section className="lg:col-span-4 h-full">
          <PreviewPane
            doc={selectedDoc}
            searchQuery={query}
            onDeleteDoc={handleDeleteDoc}
          />
        </section>
      </div>

      {/* Footer copyright */}
      <footer className="border-t border-black/10 mt-12 py-6 text-center select-none">
        <div className="font-mono text-[10px] text-steel-dark">
          <span>findit document search engine • made by smhsneh • run execution complete [ok]</span>
        </div>
      </footer>
    </div>
  );
}
