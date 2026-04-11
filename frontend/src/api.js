/**
 * API Client for LegalEase Backend
 * Handles all communication with http://localhost:5000/api
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Get stored token from localStorage
 */
const getToken = () => localStorage.getItem('token');

/**
 * Make API request with auth header
 */
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API Error: ${response.status}`);
  }

  return response.json();
};

/**
 * AUTH ENDPOINTS
 */
export const auth = {
  register: async (name, email, password) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email, password) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!getToken();
  },
};

/**
 * DOCUMENT ENDPOINTS
 */
export const documents = {
  // Get all documents
  getAll: async () => {
    return apiCall('/documents');
  },

  // Get single document
  getById: async (id) => {
    return apiCall(`/documents/${id}`);
  },

  // Create document with text
  create: async (title, content) => {
    return apiCall('/documents', {
      method: 'POST',
      body: JSON.stringify({ title, content }),
    });
  },

  // Upload PDF or image file
  upload: async (file, title) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);

    const token = getToken();
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/documents/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `Upload failed: ${response.status}`);
    }

    return response.json();
  },

  // Update document
  update: async (id, title, content) => {
    return apiCall(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, content }),
    });
  },

  // Delete document
  delete: async (id) => {
    return apiCall(`/documents/${id}`, {
      method: 'DELETE',
    });
  },

  // Get document version history
  getHistory: async (id) => {
    return apiCall(`/documents/${id}/history`);
  },

  // Analyze document with AI
  analyze: async (id) => {
    return apiCall(`/documents/${id}/analyze`, {
      method: 'POST',
    });
  },
};

/**
 * ASSISTANT ENDPOINTS
 */
export const assistant = {
  // Convert text to speech
  speakText: async (text, title = 'Document') => {
    return apiCall('/assistant/speak', {
      method: 'POST',
      body: JSON.stringify({ text, title }),
    });
  },

  // Convert document to speech
  speakDocument: async (documentId) => {
    return apiCall(`/assistant/documents/${documentId}/speak`, {
      method: 'POST',
    });
  },
};
