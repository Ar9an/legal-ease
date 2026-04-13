import { useState, useCallback, useEffect } from 'react';
import { documents, assistant } from './api';
import './Dashboard.css';

// ─── Legal Analyzer Data ─────────────────────────────────────────────────────

const EXAMPLE_CLAUSES = {
  contract: `The indemnifying party shall defend, indemnify, and hold harmless the indemnified party from and against any and all claims, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or related to any breach of this Agreement by the indemnifying party.`,
  lease: `Tenant shall not sublet the premises or any part thereof, nor assign this lease without the prior written consent of the Landlord, which consent may be withheld in Landlord's sole and absolute discretion.`,
  nda: `The Receiving Party agrees to keep confidential and not to disclose, copy, reproduce or distribute the Confidential Information to any third party for a period of five (5) years from the date of disclosure.`,
  tos: `We reserve the right to terminate or suspend your account and access to our services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.`,
  employment: `Either party may terminate this Agreement at any time, with or without cause, upon providing thirty (30) days written notice to the other party. The Company reserves the right to pay wages in lieu of notice.`,
};

const RISK_DB = [
  { phrase: "sole and absolute discretion", risk: "high", plain: "The other party can say no for any reason, with no obligation to explain." },
  { phrase: "without prior notice", risk: "high", plain: "They can act immediately without warning you first." },
  { phrase: "without limitation", risk: "high", plain: "There's no cap on what's covered — it's open-ended." },
  { phrase: "hold harmless", risk: "high", plain: "You agree not to sue the other party, even if they cause you harm." },
  { phrase: "indemnify", risk: "medium", plain: "You agree to pay for the other party's legal costs and damages in certain situations." },
  { phrase: "attorneys' fees", risk: "medium", plain: "You may be responsible for paying the other side's lawyer costs." },
  { phrase: "in lieu of notice", risk: "medium", plain: "Instead of working your notice period, you receive pay for those days and leave immediately." },
  { phrase: "written consent", risk: "low", plain: "You need formal written permission — a verbal 'yes' won't be enough." },
  { phrase: "five (5) years", risk: "low", plain: "This obligation lasts for 5 years from when the information was shared." },
  { phrase: "thirty (30) days", risk: "low", plain: "Either party must give 30 days advance warning before ending the contract." },
];

const GLOSSARY_DATA = [
  { term: "Indemnity", def: "A promise by one party to cover losses or damages suffered by another party. Essentially, one party agrees to pay the other's legal costs or damages if certain events occur." },
  { term: "Force majeure", def: "A clause that frees parties from obligations when extraordinary events beyond their control occur — like natural disasters, pandemics, or war — that make performance impossible." },
  { term: "Arbitration", def: "A private dispute resolution process where a neutral third party (arbitrator) hears both sides and makes a binding decision, instead of going to court." },
  { term: "Liability", def: "Legal responsibility for something. A 'limitation of liability' clause caps the amount one party can be held responsible for in case something goes wrong." },
  { term: "Confidentiality", def: "A requirement to keep certain information secret and not share it with others. Commonly found in NDAs and employment contracts." },
  { term: "Sublet", def: "Renting your rented property (or part of it) to another person. Many leases require landlord approval before subletting." },
  { term: "Termination", def: "Ending a contract before or at the agreed time. 'For cause' termination requires a reason; 'without cause' allows ending it for any reason with proper notice." },
  { term: "Jurisdiction", def: "The location or legal system whose laws govern the contract and where any disputes must be resolved — e.g. 'the courts of England and Wales'." },
  { term: "Breach", def: "When one party fails to fulfill their obligations under a contract. A material breach is serious enough to allow the other party to cancel the agreement." },
  { term: "Assignment", def: "Transferring your rights or obligations under a contract to another person or company. Most contracts require the other party's written permission." },
  { term: "Waiver", def: "Voluntarily giving up a right. If a party waives a breach once, it usually doesn't mean they waive the right to act on future breaches." },
  { term: "Consideration", def: "Something of value exchanged between parties — money, services, goods, or a promise. A contract must have consideration to be legally binding." },
];

const CHECKLISTS = {
  lease: [
    "Rent amount, due date, and accepted payment methods clearly stated",
    "Security deposit amount and conditions for return specified",
    "Lease start and end dates defined",
    "Subletting and guest policy clearly outlined",
    "Maintenance responsibilities split between landlord and tenant",
    "Notice period required for termination by either party",
    "Pet policy stated (if applicable)",
    "Utility responsibilities (electricity, water, internet) clarified",
    "Early termination clause and penalties included",
    "Landlord's right-of-entry notice period specified",
  ],
  employment: [
    "Job title, role description, and reporting structure defined",
    "Salary, bonus, and payment schedule specified",
    "Working hours and remote work policy outlined",
    "Holiday entitlement and sick leave policy included",
    "Notice period for resignation and termination stated",
    "Non-compete and non-solicitation clauses reviewed",
    "Intellectual property ownership of work products addressed",
    "Confidentiality obligations and duration specified",
    "Probation period terms (if any) clearly outlined",
    "Benefits (pension, health insurance, etc.) described",
  ],
  nda: [
    "Definition of 'Confidential Information' clearly scoped",
    "Duration of confidentiality obligation specified",
    "Permitted uses of confidential information listed",
    "Exclusions (publicly known info, independently developed) noted",
    "Return or destruction of materials on termination addressed",
    "Mutual or one-way confidentiality obligation identified",
    "Governing law and jurisdiction specified",
    "Consequences of breach outlined",
  ],
  freelance: [
    "Project scope and deliverables clearly described",
    "Payment amount, schedule, and late payment terms stated",
    "Revision rounds and change request process defined",
    "Intellectual property transfer upon payment confirmed",
    "Kill fee for project cancellation included",
    "Confidentiality obligations outlined",
    "Timeline and key milestones agreed upon",
    "Independent contractor status (not employee) confirmed",
  ],
};

const DOC_TYPE_LABELS = { contract: "Contract", lease: "Lease agreement", nda: "NDA", tos: "Terms of service", employment: "Employment agreement" };
const CHECKLIST_LABELS = { lease: "Lease agreement", employment: "Employment contract", nda: "NDA", freelance: "Freelance contract" };
const ANALYZER_TABS = ["Clause analyzer", "Document checklist", "Legal glossary"];

// ─── Analyzer Sub-components ─────────────────────────────────────────────────

function Badge({ risk }) {
  const styles = {
    high: { background: "#FCEBEB", color: "#A32D2D" },
    medium: { background: "#FAEEDA", color: "#854F0B" },
    low: { background: "#EAF3DE", color: "#3B6D11" },
    info: { background: "#E6F1FB", color: "#185FA5" },
  };
  const s = styles[risk] || styles.info;
  return <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap", fontWeight: 500, ...s }}>{risk} risk</span>;
}

function ScoreBar({ value, color }) {
  return (
    <div style={{ height: 6, borderRadius: 99, background: "#e5e7eb", margin: "6px 0", overflow: "hidden" }}>
      <div style={{ height: "100%", borderRadius: 99, width: `${value}%`, background: color, transition: "width 0.6s ease" }} />
    </div>
  );
}

function MetricCard({ value, label, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: 8, padding: 12, border: "0.5px solid #e5e7eb", textAlign: "center", flex: 1 }}>
      <div style={{ fontSize: 22, fontWeight: 500, color }}>{value}</div>
      <ScoreBar value={value} color={color} />
      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ClauseAnalyzer() {
  const [text, setText] = useState("");
  const [docType, setDocType] = useState("contract");
  const [result, setResult] = useState(null);

  const loadExample = () => setText(EXAMPLE_CLAUSES[docType]);

  const analyze = useCallback(() => {
    if (!text.trim()) { setResult(null); return; }
    const lower = text.toLowerCase();
    const found = RISK_DB.filter(({ phrase }) => lower.includes(phrase.toLowerCase()));
    const riskScore = Math.min(95,
      found.length === 0 ? 20 :
        found.filter(f => f.risk === "high").length * 30 +
        found.filter(f => f.risk === "medium").length * 15 +
        found.length * 5 + 10
    );
    const readScore = Math.max(20, 100 - Math.min(80, Math.floor(text.split(" ").length / 2)));
    setResult({ found, riskScore, readScore });
  }, [text]);

  const riskColor = result ? result.riskScore >= 65 ? "#E24B4A" : result.riskScore >= 35 ? "#EF9F27" : "#639922" : "#6b7280";
  const readColor = result ? result.readScore >= 65 ? "#639922" : result.readScore >= 35 ? "#EF9F27" : "#E24B4A" : "#6b7280";

  return (
    <div>
      <textarea value={text} onChange={e => setText(e.target.value)}
        placeholder="Paste a legal clause or paragraph here — e.g. from a contract, terms of service, lease, or NDA..."
        style={{ width: "100%", minHeight: 120, fontSize: 13, lineHeight: 1.6, resize: "vertical", padding: "10px 12px", border: "0.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
      />
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", margin: "10px 0" }}>
        <select value={docType} onChange={e => setDocType(e.target.value)} style={{ fontSize: 13, padding: "7px 10px", border: "0.5px solid #e5e7eb", borderRadius: 8 }}>
          {Object.entries(DOC_TYPE_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <button onClick={analyze} style={{ fontSize: 13, padding: "8px 18px", border: "0.5px solid #185FA5", borderRadius: 8, background: "#185FA5", color: "#E6F1FB", cursor: "pointer" }}>
          Analyze clause
        </button>
        <button onClick={loadExample} style={{ fontSize: 13, padding: "8px 18px", border: "0.5px solid #e5e7eb", borderRadius: 8, background: "transparent", cursor: "pointer" }}>
          Load example
        </button>
      </div>
      {result && (
        <div style={{ background: "#f9fafb", borderRadius: 12, padding: "1rem 1.25rem", marginTop: 12, border: "0.5px solid #e5e7eb" }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
            <MetricCard value={result.riskScore} label="Risk score" color={riskColor} />
            <MetricCard value={result.readScore} label="Readability" color={readColor} />
            <MetricCard value={result.found.length} label="Key terms found" color="#378ADD" />
          </div>
          {result.found.length === 0 ? (
            <p style={{ fontSize: 13, color: "#6b7280" }}>No flagged terms detected. This clause appears straightforward — but always review with a legal professional for important matters.</p>
          ) : (
            <>
              <div style={{ fontSize: 12, fontWeight: 500, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Flagged terms</div>
              {result.found.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", borderBottom: i < result.found.length - 1 ? "0.5px solid #e5e7eb" : "none" }}>
                  <Badge risk={item.risk} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>"{item.phrase}"</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{item.plain}</div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function DocumentChecklist() {
  const [type, setType] = useState("lease");
  const [checked, setChecked] = useState({});
  const items = CHECKLISTS[type];
  const doneCount = items.filter((_, i) => checked[`${type}-${i}`]).length;
  const toggle = (i) => setChecked(prev => ({ ...prev, [`${type}-${i}`]: !prev[`${type}-${i}`] }));

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{ fontSize: 13, padding: "7px 10px", border: "0.5px solid #e5e7eb", borderRadius: 8 }}>
          {Object.entries(CHECKLIST_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div style={{ background: "#f9fafb", borderRadius: 12, padding: "1rem 1.25rem", border: "0.5px solid #e5e7eb" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{CHECKLIST_LABELS[type]}</div>
          <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 99, background: "#E6F1FB", color: "#185FA5", fontWeight: 500 }}>{doneCount}/{items.length} checked</span>
        </div>
        {items.map((item, i) => {
          const done = !!checked[`${type}-${i}`];
          return (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "10px 0", borderBottom: i < items.length - 1 ? "0.5px solid #e5e7eb" : "none" }}>
              <div onClick={() => toggle(i)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, border: done ? "none" : "0.5px solid #d1d5db", background: done ? "#185FA5" : "transparent" }}>
                {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><polyline points="1.5,5 4,7.5 8.5,2" stroke="#E6F1FB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.5, textDecoration: done ? "line-through" : "none", color: done ? "#9ca3af" : "inherit" }}>{item}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LegalGlossary() {
  const [query, setQuery] = useState("");
  const results = query.trim()
    ? GLOSSARY_DATA.filter(g => g.term.toLowerCase().includes(query.toLowerCase()) || g.def.toLowerCase().includes(query.toLowerCase()))
    : GLOSSARY_DATA;
  return (
    <div>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        placeholder="Search a legal term (e.g. indemnity, force majeure, arbitration...)"
        style={{ width: "100%", fontSize: 13, padding: "9px 12px", border: "0.5px solid #e5e7eb", borderRadius: 8, fontFamily: "inherit", boxSizing: "border-box", outline: "none" }}
      />
      <div style={{ marginTop: 12 }}>
        {results.length === 0
          ? <p style={{ fontSize: 13, color: "#6b7280", textAlign: "center", padding: "2rem 0" }}>No terms found for "{query}".</p>
          : results.map((g, i) => (
            <div key={i} style={{ background: "#f9fafb", borderRadius: 12, padding: "12px 14px", marginBottom: 8, border: "0.5px solid #e5e7eb" }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>{g.term}</div>
              <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{g.def}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const [documents_list, setDocumentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [analyzerTab, setAnalyzerTab] = useState(0);

  useEffect(() => { loadDocuments(); }, []);

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const title = file.name.replace(/\.[^/.]+$/, '');
    setLoading(true);
    setError('');
    try {
      await documents.upload(file, title);
      await loadDocuments();
      e.target.value = '';
    } catch (err) {
      setError('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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
        <button className={`tab ${activeTab === 'upload' ? 'active' : ''}`} onClick={() => setActiveTab('upload')}>
          📤 Upload Document
        </button>
        <button className={`tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => { setActiveTab('documents'); loadDocuments(); }}>
          📁 My Documents ({documents_list.length})
        </button>
        <button className={`tab ${activeTab === 'analyzer' ? 'active' : ''}`} onClick={() => setActiveTab('analyzer')}>
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
            <input type="file" id="file-input" onChange={handleFileUpload} disabled={loading} accept=".pdf,.png,.jpg,.jpeg" />
            <label htmlFor="file-input" className={`upload-label ${loading ? 'disabled' : ''}`}>
              <span className="upload-icon">📄</span>
              <span className="upload-text">{loading ? 'Uploading...' : 'Click to upload or drag & drop'}</span>
              <span className="upload-hint">PDF, PNG, JPG (Max 15MB)</span>
            </label>
          </div>
          <div className="features-grid">
            <div className="feature"><span className="feature-icon">🔍</span><h4>AI Analysis</h4><p>Get plain English summaries and risk identification</p></div>
            <div className="feature"><span className="feature-icon">📜</span><h4>OCR Support</h4><p>Automatic text extraction from scanned documents</p></div>
            <div className="feature"><span className="feature-icon">📊</span><h4>Version History</h4><p>Track changes and view previous versions</p></div>
            <div className="feature"><span className="feature-icon">🎧</span><h4>Text-to-Speech</h4><p>Listen to analysis with AI voice</p></div>
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
            <p className="no-documents">No documents yet.{' '}
              <button onClick={() => setActiveTab('upload')} className="link-btn">Upload one now</button>
            </p>
          ) : (
            <div className="documents-grid">
              {documents_list.map((doc) => (
                <div key={doc._id} className="document-card">
                  <div className="doc-header">
                    <h4>{doc.title}</h4>
                    <span className="doc-date">{new Date(doc.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="doc-preview">{doc.content.substring(0, 150)}...</p>
                  {doc.analysis && <div className="analysis-summary"><div className="badge">✓ Analyzed</div></div>}
                  <div className="doc-actions">
                    {!doc.analysis ? (
                      <button onClick={() => handleAnalyze(doc._id)} disabled={analyzingId === doc._id} className="btn btn-primary">
                        {analyzingId === doc._id ? '⏳ Analyzing...' : '🔍 Analyze'}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => { setSelectedDoc(doc); setAnalysis(doc.analysis); }} className="btn btn-secondary">👁️ View</button>
                        <button onClick={() => { setSelectedDoc(doc); handleSpeak(); }} className="btn btn-secondary">🎧 Speak</button>
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
      {activeTab === 'analyzer' && (
        <div className="tab-content">
          {/* Sub-tabs */}
          <div style={{ display: "flex", gap: 4, borderBottom: "0.5px solid #e5e7eb", marginBottom: "1.25rem" }}>
            {ANALYZER_TABS.map((tab, i) => (
              <button key={tab} onClick={() => setAnalyzerTab(i)} style={{
                fontSize: 13, padding: "8px 14px", cursor: "pointer", border: "none", background: "transparent",
                color: analyzerTab === i ? "#185FA5" : "#6b7280",
                borderBottom: analyzerTab === i ? "2px solid #185FA5" : "2px solid transparent",
                marginBottom: -1, fontWeight: analyzerTab === i ? 500 : 400,
              }}>
                {tab}
              </button>
            ))}
          </div>
          {analyzerTab === 0 && <ClauseAnalyzer />}
          {analyzerTab === 1 && <DocumentChecklist />}
          {analyzerTab === 2 && <LegalGlossary />}
          <div style={{ marginTop: "2rem", fontSize: 11, color: "#9ca3af", borderTop: "0.5px solid #e5e7eb", paddingTop: 12 }}>
            Legal Ease is for informational purposes only and does not constitute legal advice. Always consult a qualified legal professional for important matters.
          </div>
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
            {analysis.risks?.length > 0 && (
              <div className="analysis-section">
                <h4>⚠️ Risk Clauses ({analysis.risks.length})</h4>
                <ul>{analysis.risks.map((risk, i) => <li key={i}>{risk}</li>)}</ul>
              </div>
            )}
            {analysis.obligations?.length > 0 && (
              <div className="analysis-section">
                <h4>✅ Your Obligations</h4>
                <ul>{analysis.obligations.map((obl, i) => <li key={i}>{obl}</li>)}</ul>
              </div>
            )}
            {analysis.negotiationTips?.length > 0 && (
              <div className="analysis-section">
                <h4>💡 Negotiation Tips</h4>
                <ul>{analysis.negotiationTips.map((tip, i) => <li key={i}>{tip}</li>)}</ul>
              </div>
            )}
            <div className="analysis-actions">
              <button onClick={handleSpeak} className="btn btn-primary">🎧 Listen to Analysis</button>
              <button onClick={() => setSelectedDoc(null)} className="btn btn-secondary">← Back</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
