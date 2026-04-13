import { useState, useCallback, useEffect } from 'react';
import { documents, assistant } from './api';
import LegalEaseAnalyzer from './LegalEaseAnalyzer';
import './Dashboard.css';

export default function Dashboard() {
  const [documents_list, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload'); // upload | documents | analyze
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  // Load documents on mount
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const docs = await documents.getAll();
      setDocumentsList(docs);
    } catch (err) {
      setError('Failed to load documents: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload file handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const title = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
    setLoading(true);
    setError('');

    try {
      await documents.upload(file, title);
      await loadDocuments();
      e.target.value = ''; // Reset file input
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Analyze document
  const handleAnalyze = async (docId) => {
    setAnalyzingId(docId);
    try {
      const result = await documents.analyze(docId);
      setAnalysis(result.analysis);
      setSelectedDoc(result.document);
    } catch (err) {
      setError('Analysis failed: ' + err.message);
    } finally {
      setAnalyzingId(null);
    }
  };

  // Text-to-speech
  const handleSpeak = async () => {
    if (!selectedDoc) return;
    try {
      await assistant.speakDocument(selectedDoc._id);
    } catch (err) {
      setError('Text-to-speech failed: ' + err.message);
    }
  };

  return (
    <div className="dashboard">
      {/* Tab Navigation */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload Document
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('documents');
            loadDocuments();
          }}
        >
          📁 My Documents ({documents_list.length})
        </button>
        <button
          className={`tab ${activeTab === 'analyze' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyze')}
        >
          ⚖️ Clause Analyzer
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="error-card">
          <strong>Error:</strong> {error}
          <button onClick={() => setError('')} className="close-btn">×</button>
        </div>
      )}

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="tab-content">
          <h3>Upload a Legal Document</h3>
          <p>Upload PDFs, images, or scanned documents. We'll extract text and analyze it with AI.</p>

          <div className="upload-area">
            <input
              type="file"
              id="file-input"
              onChange={handleFileUpload}
              disabled={loading}
              accept=".pdf,.png,.jpg,.jpeg"
            />
            <label htmlFor="file-input" className={`upload-label ${loading ? 'disabled' : ''}`}>
              <span className="upload-icon">📄</span>
              <span className="upload-text">
                {loading ? 'Uploading...' : 'Click to upload or drag & drop'}
              </span>
              <span className="upload-hint">PDF, PNG, JPG (Max 15MB)</span>
            </label>
          </div>

          <div className="features-grid">
            <div className="feature">
              <span className="feature-icon">🔍</span>
              <h4>AI Analysis</h4>
              <p>Get plain English summaries and risk identification</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📜</span>
              <h4>OCR Support</h4>
              <p>Automatic text extraction from scanned documents</p>
            </div>
            <div className="feature">
              <span className="feature-icon">📊</span>
              <h4>Version History</h4>
              <p>Track changes and view previous versions</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎧</span>
              <h4>Text-to-Speech</h4>
              <p>Listen to analysis with AI voice</p>
            </div>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="tab-content">
          <h3>My Documents</h3>

          {loading ? (
            <p className="loading">Loading documents...</p>
          ) : documents_list.length === 0 ? (
            <p className="no-documents">
              No documents yet.{' '}
              <button onClick={() => setActiveTab('upload')} className="link-btn">
                Upload one now
              </button>
            </p>
          ) : (
            <div className="documents-grid">
              {documents_list.map((doc) => (
                <div key={doc._id} className="document-card">
                  <div className="doc-header">
                    <h4>{doc.title}</h4>
                    <span className="doc-date">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="doc-preview">
                    {doc.content.substring(0, 150)}...
                  </p>

                  {doc.analysis && (
                    <div className="analysis-summary">
                      <div className="badge">✓ Analyzed</div>
                    </div>
                  )}

                  <div className="doc-actions">
                    {!doc.analysis ? (
                      <button
                        onClick={() => handleAnalyze(doc._id)}
                        disabled={analyzingId === doc._id}
                        className="btn btn-primary"
                      >
                        {analyzingId === doc._id ? '⏳ Analyzing...' : '🔍 Analyze'}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setAnalysis(doc.analysis);
                          }}
                          className="btn btn-secondary"
                        >
                          👁️ View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            handleSpeak();
                          }}
                          className="btn btn-secondary"
                        >
                          🎧 Speak
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Clause Analyzer Tab */}
      {activeTab === 'analyze' && (
        <div className="tab-content">
          <LegalEaseAnalyzer />
        </div>
      )}

      {/* Analysis View */}
      {selectedDoc && analysis && (
        <div className="analysis-view">
          <div className="analysis-header">
            <h3>{selectedDoc.title}</h3>
            <button onClick={() => setSelectedDoc(null)} className="close-btn">✕</button>
          </div>

          <div className="analysis-content">
            <div className="analysis-section">
              <h4>📋 Summary</h4>
              <p>{analysis.summary || 'No summary available'}</p>
            </div>

            {analysis.risks && analysis.risks.length > 0 && (
              <div className="analysis-section">
                <h4>⚠️ Risk Clauses ({analysis.risks.length})</h4>
                <ul>
                  {analysis.risks.map((risk, i) => (
                    <li key={i}>{risk}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.obligations && analysis.obligations.length > 0 && (
              <div className="analysis-section">
                <h4>✅ Your Obligations</h4>
                <ul>
                  {analysis.obligations.map((obl, i) => (
                    <li key={i}>{obl}</li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.negotiationTips && analysis.negotiationTips.length > 0 && (
              <div className="analysis-section">
                <h4>💡 Negotiation Tips</h4>
                <ul>
                  {analysis.negotiationTips.map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="analysis-actions">
              <button onClick={handleSpeak} className="btn btn-primary">
                🎧 Listen to Analysis
              </button>
              <button onClick={() => setSelectedDoc(null)} className="btn btn-secondary">
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
