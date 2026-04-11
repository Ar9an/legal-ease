import React from 'react';
import LegalEaseAnalyzer from './LegalEaseAnalyzer';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>LegalEase AI - Legal Document Simplifier</h1>
        <p>Paste any legal document and get it simplified in plain English</p>
      </header>
      <main>
        <LegalEaseAnalyzer />
      </main>
    </div>
  );
}

export default App;