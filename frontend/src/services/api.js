// mock api service that houses the local search engine implementation
// contains: tokenization, stop-words filter, inverted index builder, tf-idf ranking, and snippet highlighting

// stop words to filter out from indexing
const stopWords = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at', 
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 
  'from', 'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 
  'her', 'here', 'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'howes', 'i', 'id', 'ill', 'im', 
  'ive', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 
  'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 
  'so', 'some', 'such', 'than', 'that', 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 
  'there', 'theres', 'these', 'they', 'theyd', 'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 
  'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasnt', 'we', 'wed', 'well', 'were', 'werent', 'what', 
  'whats', 'when', 'whens', 'where', 'wheres', 'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 
  'wont', 'would', 'wouldnt', 'you', 'youd', 'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// default mock documents
const initialDocuments = [
  {
    id: 'doc1',
    fileName: 'dbms_notes.pdf',
    fileType: 'pdf',
    content: 'database normalization reduces redundancy and improves data integrity. the normalization process involves dividing a database into two or more tables and defining relationships between them. first normal form (1nf) requires that table columns contain only atomic values. second normal form (2nf) requires that it is in 1nf and all non-key columns are fully dependent on the primary key. third normal form (3nf) requires that there are no transitive dependencies. boyce-codd normal form (bcnf) is a stronger version of 3nf that handles multiple overlapping candidate keys. database transactions must adhere to acid properties: atomicity, consistency, isolation, and durability.',
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: 'doc2',
    fileName: 'os_notes.pdf',
    fileType: 'pdf',
    content: 'operating systems manage hardware and software resources. a deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource held by some other process. the four necessary conditions for deadlock are mutual exclusion, hold and wait, no preemption, and circular wait. deadlock handling strategies include deadlock prevention, deadlock avoidance using bankers algorithm, deadlock detection, and recovery. CPU scheduling algorithms decide which process in the ready queue is to be allocated the CPU. virtual memory is a memory management technique that uses paging to map logical addresses to physical addresses.',
    uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
  },
  {
    id: 'doc3',
    fileName: 'cn_interview.docx',
    fileType: 'docx',
    content: 'computer networks connect multiple devices for resource sharing. the tcp/ip suite consists of four layers: link, network, transport, and application. transmission control protocol (tcp) is a connection-oriented protocol that establishes a connection using a three-way handshake: syn, syn-ack, ack. user datagram protocol (udp) is a connectionless and lightweight protocol. routing algorithms like link state and distance vector determine the optimal path for packet transmission. domain name system (dns) maps human-readable domain names to ip addresses. hyper-text transfer protocol secure (https) encrypts communications using transport layer security (tls) for safe data transmission.',
    uploadedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'doc4',
    fileName: 'resume.pdf',
    fileType: 'pdf',
    content: 'full stack developer with expertise in building intelligent search systems and database management. technical skills include react, node.js, express, and mongodb atlas. developed a custom inverted index search engine that calculates tf-idf scores to rank document relevance. implemented client-side text extraction using standard javascript APIs and built interactive dashboards. passionate about algorithms, data structures, and computer science education. experienced in writing clean code, deploying websites to vercel and render, and managing databases.',
    uploadedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

// in-memory state
let documents = [...initialDocuments];
let searchHistory = [
  { query: 'normalization', searchedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString() },
  { query: 'deadlock', searchedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { query: 'tcp connection', searchedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString() }
];
let invertedIndex = {};

// helper: tokenize and clean text
export const tokenize = (text) => {
  if (!text) return [];
  // lowercase and remove punctuation
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/);
  
  // filter empty and stop words
  return cleaned.filter(token => token && !stopWords.has(token));
};

// helper: build inverted index from current documents
export const buildInvertedIndex = () => {
  const index = {};
  documents.forEach(doc => {
    const tokens = tokenize(doc.content);
    const totalTokens = tokens.length;
    
    // count term frequencies in this document
    const termCounts = {};
    tokens.forEach(token => {
      termCounts[token] = (termCounts[token] || 0) + 1;
    });

    // populate inverted index
    Object.keys(termCounts).forEach(term => {
      if (!index[term]) {
        index[term] = [];
      }
      index[term].push({
        docId: doc.id,
        tf: termCounts[term] / totalTokens, // normalized term frequency
        count: termCounts[term]
      });
    });
  });
  invertedIndex = index;
  return invertedIndex;
};

// initialize index
buildInvertedIndex();

// search API: lookup inverted index and calculate TF-IDF rank
export const searchDocuments = (query) => {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  // track scores per document
  const docScores = {}; // docId -> { score, matchedTerms: Set }
  const totalDocs = documents.length;

  queryTokens.forEach(term => {
    const postings = invertedIndex[term];
    if (!postings) return;

    // IDF calculation: log(1 + totalDocs / docsWithTerm)
    const docsWithTerm = postings.length;
    const idf = Math.log(1 + totalDocs / docsWithTerm);

    postings.forEach(posting => {
      if (!docScores[posting.docId]) {
        docScores[posting.docId] = {
          score: 0,
          matchedTerms: new Set(),
          matchCount: 0
        };
      }
      // tf-idf score = term_frequency * idf
      const tfidf = posting.tf * idf;
      docScores[posting.docId].score += tfidf;
      docScores[posting.docId].matchedTerms.add(term);
      docScores[posting.docId].matchCount += posting.count;
    });
  });

  // format search results
  const results = Object.keys(docScores).map(docId => {
    const doc = documents.find(d => d.id === docId);
    const scoreInfo = docScores[docId];
    
    // generate snippet highlighting
    const snippet = generateHighlightSnippet(doc.content, queryTokens);

    return {
      id: doc.id,
      fileName: doc.fileName,
      fileType: doc.fileType,
      score: Number(scoreInfo.score.toFixed(4)),
      matchCount: scoreInfo.matchCount,
      snippet: snippet,
      uploadedAt: doc.uploadedAt
    };
  });

  // sort by relevance score descending
  results.sort((a, b) => b.score - a.score);

  // log search history
  addSearchHistory(query);

  return results;
};

// helper: generate text snippet with keywords highlighted
const generateHighlightSnippet = (content, queryTokens) => {
  const words = content.split(/\s+/);
  let bestSnippet = '';
  let maxMatches = -1;
  let bestIndex = 0;

  // slide window to find section with maximum term density
  const windowSize = 25;
  for (let i = 0; i <= words.length - windowSize; i++) {
    const slice = words.slice(i, i + windowSize);
    let matchCount = 0;
    
    slice.forEach(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
      if (queryTokens.includes(cleanWord)) {
        matchCount++;
      }
    });

    if (matchCount > maxMatches) {
      maxMatches = matchCount;
      bestIndex = i;
    }
  }

  // retrieve words around the dense window
  const startIdx = Math.max(0, bestIndex - 5);
  const endIdx = Math.min(words.length, bestIndex + windowSize + 5);
  let snippetWords = words.slice(startIdx, endIdx);

  // highlight matching query tokens
  snippetWords = snippetWords.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    if (queryTokens.includes(cleanWord)) {
      return `<mark class="highlight-mark">${word}</mark>`;
    }
    return word;
  });

  let snippet = snippetWords.join(' ');
  if (startIdx > 0) snippet = '...' + snippet;
  if (endIdx < words.length) snippet = snippet + '...';

  return snippet;
};

// manage search history
export const getSearchHistory = () => {
  return searchHistory;
};

const addSearchHistory = (query) => {
  // remove duplicates
  searchHistory = searchHistory.filter(h => h.query.toLowerCase() !== query.toLowerCase());
  // add to front
  searchHistory.unshift({
    query: query.toLowerCase(),
    searchedAt: new Date().toISOString()
  });
  // cap size
  if (searchHistory.length > 10) {
    searchHistory.pop();
  }
};

// manage documents (upload)
export const getDocuments = () => {
  return documents;
};

export const getDocumentById = (id) => {
  return documents.find(d => d.id === id);
};

export const deleteDocument = (id) => {
  documents = documents.filter(d => d.id !== id);
  buildInvertedIndex();
  return documents;
};

// local file uploader simulator (runs extraction process asynchronously)
export const uploadFile = (file, contentText = '') => {
  return new Promise((resolve) => {
    let mockContent = contentText;
    
    // generate descriptive text if no custom text content is passed (e.g. for mock uploads)
    if (!mockContent) {
      const name = file.name.toLowerCase();
      if (name.includes('dbms')) {
        mockContent = 'database systems management notes covering relational algebra, SQL querying, indices, B-trees, hashing methods, query processing, optimization, transactions concurrency protocols, locks, two-phase locking, and crash recovery systems.';
      } else if (name.includes('network') || name.includes('cn')) {
        mockContent = 'computer networking guidelines, network devices, layer protocols, physical medium signals, ethernet, mac addresses, sliding window algorithms, internet protocol ip addressing, subnetting, classless routing, and socket interfaces.';
      } else if (name.includes('os') || name.includes('process')) {
        mockContent = 'operating system architecture, kernel space, user space, system calls, thread creation, synchronization primitives, semaphores, monitors, mutexes, paging, fragmentation, thrashing, and file system layouts.';
      } else {
        mockContent = `contents of the document ${file.name}. this text is processed, tokenized, and indexed into the local hashmap database to enable search lookup.`;
      }
    }

    const newDoc = {
      id: 'doc_' + Math.random().toString(36).substring(2, 9),
      fileName: file.name.toLowerCase(),
      fileType: file.name.split('.').pop().toLowerCase(),
      content: mockContent.toLowerCase(),
      uploadedAt: new Date().toISOString()
    };

    // simulate parsing latency
    setTimeout(() => {
      documents.push(newDoc);
      buildInvertedIndex();
      resolve(newDoc);
    }, 1500);
  });
};

// statistics collector
export const getStats = () => {
  const totalTokens = Object.values(invertedIndex).reduce((sum, list) => sum + list.length, 0);
  return {
    totalDocs: documents.length,
    totalTerms: Object.keys(invertedIndex).length,
    totalSearches: searchHistory.length + 8929 // start with a nice high portfolio-worthy baseline
  };
};
