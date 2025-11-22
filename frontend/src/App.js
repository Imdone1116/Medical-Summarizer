import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import DataEditor from './components/DataEditor';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import ChatInterface from './components/ChatInterface';
import { api } from './services/api';
import { storage } from './utils/localStorage';

function App() {
  const [viewType, setViewType] = useState('patient'); // 'doctor' or 'patient'
  const [medicalRecords, setMedicalRecords] = useState('');
  const [summaries, setSummaries] = useState({ doctor: null, patient: null });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'summary', 'chat'

  // Load data from localStorage on mount
  useEffect(() => {
    const savedRecords = storage.getMedicalRecords();
    const savedSummaries = storage.getSummaries();

    if (savedRecords) {
      setMedicalRecords(savedRecords);
    }
    if (savedSummaries) {
      setSummaries(savedSummaries);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (medicalRecords) {
      storage.saveMedicalRecords(medicalRecords);
    }
  }, [medicalRecords]);

  useEffect(() => {
    storage.saveSummaries(summaries);
  }, [summaries]);

  const handleFileUpload = (files) => {
    // Combine all file contents
    const combinedContent = files
      .map((file) => `=== ${file.name} ===\n${file.content}`)
      .join('\n\n');

    setMedicalRecords(combinedContent);
    setError(null);
  };

  const handleDataSave = (editedData) => {
    setMedicalRecords(editedData);
    setError(null);
  };

  const handleGenerateSummary = async () => {
    if (!medicalRecords) {
      setError('Please upload or enter medical records first');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate both doctor and patient summaries
      const [doctorResult, patientResult] = await Promise.all([
        api.summarize(medicalRecords, 'doctor'),
        api.summarize(medicalRecords, 'patient'),
      ]);

      setSummaries({
        doctor: doctorResult.summary,
        patient: patientResult.summary,
      });

      setActiveTab('summary');
    } catch (err) {
      setError(`Failed to generate summary: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChatMessage = async (records, question, chatHistory, vType) => {
    return await api.chat(records, question, chatHistory, vType);
  };

  const handleExplainTerm = async (term, context) => {
    return await api.explainTerm(term, medicalRecords);
  };

  const clearAllData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setMedicalRecords('');
      setSummaries({ doctor: null, patient: null });
      storage.clearAll();
      setActiveTab('upload');
      setError(null);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>Medical Note Summarizer</h1>
          <p className="header-subtitle">
            AI-powered medical record analysis and summarization
          </p>
        </div>

        {/* View Type Switcher */}
        <div className="view-switcher">
          <button
            className={`view-btn ${viewType === 'patient' ? 'active' : ''}`}
            onClick={() => setViewType('patient')}
          >
            Patient View
          </button>
          <button
            className={`view-btn ${viewType === 'doctor' ? 'active' : ''}`}
            onClick={() => setViewType('doctor')}
          >
            Doctor View
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📤 Upload & Edit
        </button>
        <button
          className={`nav-tab ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
          disabled={!summaries[viewType]}
        >
          📊 Summary
        </button>
        <button
          className={`nav-tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Chat
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>✕</button>
          </div>
        )}

        {/* Upload & Edit Tab */}
        {activeTab === 'upload' && (
          <div className="content-section">
            <FileUpload onFileUpload={handleFileUpload} />
            <DataEditor
              initialData={medicalRecords}
              onSave={handleDataSave}
            />

            <div className="action-buttons">
              <button
                className="btn-primary generate-btn"
                onClick={handleGenerateSummary}
                disabled={!medicalRecords || isGenerating}
              >
                {isGenerating ? '⏳ Generating Summary...' : '🤖 Generate AI Summary'}
              </button>

              {medicalRecords && (
                <button
                  className="btn-secondary clear-btn"
                  onClick={clearAllData}
                >
                  🗑️ Clear All Data
                </button>
              )}
            </div>
          </div>
        )}

        {/* Summary Tab */}
        {activeTab === 'summary' && (
          <div className="content-section">
            {viewType === 'doctor' ? (
              <DoctorDashboard summary={summaries.doctor} />
            ) : (
              <PatientDashboard
                summary={summaries.patient}
                onExplainTerm={handleExplainTerm}
              />
            )}

            {!summaries[viewType] && (
              <div className="no-summary-message">
                <p>No summary available yet.</p>
                <button
                  className="btn-primary"
                  onClick={() => setActiveTab('upload')}
                >
                  Go to Upload & Generate
                </button>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="content-section">
            <ChatInterface
              medicalRecords={medicalRecords}
              viewType={viewType}
              onSendMessage={handleChatMessage}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Powered by Claude AI • {viewType === 'patient' ? 'Patient' : 'Doctor'} View Active
        </p>
        <p className="footer-disclaimer">
          This tool is for informational purposes only and should not replace professional medical advice.
        </p>
      </footer>
    </div>
  );
}

export default App;
