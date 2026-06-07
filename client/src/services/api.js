export const API_BASE_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const headers = {};
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('documents', file);

  const headers = getHeaders();
  // Don't set Content-Type, let the browser set it for FormData

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) throw new Error('Upload failed');
  return await response.json();
};

export const searchDocuments = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to search');
    return await response.json();
  } catch (error) {
    console.error('API Error (search):', error);
    return [];
  }
};

export const getDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch documents');
    return await response.json();
  } catch (error) {
    console.error('API Error (getDocuments):', error);
    return [];
  }
};

export const getStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/stats`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch stats');
    const data = await response.json();
    const history = getSearchHistory();
    let totalSearches = parseInt(localStorage.getItem('totalSearches') || '0', 10);
    if (totalSearches < history.length) {
      totalSearches = history.length;
      localStorage.setItem('totalSearches', totalSearches.toString());
    }
    return { ...data, totalSearches };
  } catch (error) {
    console.error('API Error (getStats):', error);
    const history = getSearchHistory();
    let totalSearches = parseInt(localStorage.getItem('totalSearches') || '0', 10);
    if (totalSearches < history.length) totalSearches = history.length;
    return { totalDocs: 0, totalTerms: 0, totalSearches };
  }
};

export const getTerms = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/terms`, { headers: getHeaders() });
    if (!response.ok) throw new Error('Failed to fetch terms');
    return await response.json();
  } catch (error) {
    console.error('API Error (getTerms):', error);
    return [];
  }
};

export const deleteDocument = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents/${id}`, { 
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to delete document');
    return await response.json();
  } catch (error) {
    console.error('API Error (deleteDocument):', error);
    throw error;
  }
};

// Search history uses localStorage and doesn't need auth headers
export const saveSearchQuery = (query) => {
  if (!query) return;
  const history = getSearchHistory();
  const updatedHistory = [{ query, timestamp: new Date().toISOString() }, ...history.filter(h => h.query !== query)].slice(0, 5);
  localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  const total = parseInt(localStorage.getItem('totalSearches') || '0', 10);
  localStorage.setItem('totalSearches', (Math.max(total, history.length) + 1).toString());
};

export const getSearchHistory = () => {
  try {
    return JSON.parse(localStorage.getItem('searchHistory') || '[]');
  } catch (e) {
    return [];
  }
};

export const clearSearchHistory = () => {
  localStorage.removeItem('searchHistory');
};
