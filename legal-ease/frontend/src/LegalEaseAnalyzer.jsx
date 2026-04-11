import React, { useState } from 'react';
import axios from 'axios';
import './LegalEaseAnalyzer.css';

const LegalEaseAnalyzer = () => {
  const [documentText, setDocumentText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!documentText.trim()) {
      setError('Please enter some document text');
      return;
    }

    setLoading(true);
    setError('');
    setAnalysis(null);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze', {
        text: documentText
      });

      setAnalysis(response.data);
    } catch (err) {
      setError('Error analyzing document. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setDocumentText(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="analyzer-container">
      <div className="input-section">
        <h2>Paste Your Legal Document</h2>
        <textarea
          value={documentText}
          onChange={(e) => setDocumentText(e.target.value)}
          placeholder="Paste your legal document here (rent agreement, internship offer, terms & conditions, etc.)"
          rows={10}
        />
        <div className="upload-section">
          <label htmlFor="file-upload" className="upload-button">
            Or Upload a File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf,.doc,.docx"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="analyze-button"
        >
          {loading ? 'Analyzing...' : 'Analyze Document'}
        </button>
        {error && <p className="error">{error}</p>}
      </div>

      {analysis && (
        <div className="results-section">
          <h2>Analysis Results</h2>

          <div className="result-card">
            <h3>Plain English Summary</h3>
            <p>{analysis.summary}</p>
          </div>

          {analysis.riskyClauses && analysis.riskyClauses.length > 0 && (
            <div className="result-card">
              <h3>Risky Clauses ⚠️</h3>
              <ul>
                {analysis.riskyClauses.map((clause, index) => (
                  <li key={index} className="risky-clause">{clause}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="result-card">
            <h3>What You're Actually Agreeing To</h3>
            <p>{analysis.explanation}</p>
          </div>

          {analysis.suggestions && analysis.suggestions.length > 0 && (
            <div className="result-card">
              <h3>Negotiation Suggestions</h3>
              <ul>
                {analysis.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LegalEaseAnalyzer;