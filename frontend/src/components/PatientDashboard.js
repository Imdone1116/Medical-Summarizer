import React, { useState } from 'react';
import './PatientDashboard.css';

const PatientDashboard = ({ summary, onExplainTerm }) => {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [explanation, setExplanation] = useState('');

  if (!summary) {
    return (
      <div className="dashboard-container">
        <div className="no-summary">
          <p>No summary available. Please upload medical records and generate a summary.</p>
        </div>
      </div>
    );
  }

  // Parse the summary if it's a string
  let parsedSummary;
  try {
    parsedSummary = typeof summary === 'string' ? JSON.parse(summary) : summary;
  } catch (error) {
    console.error('JSON Parse Error:', error);
    console.error('Raw summary:', summary);
    return (
      <div className="dashboard-container">
        <div className="error-message">
          <h3>⚠️ Error Parsing Summary</h3>
          <p>The AI response could not be parsed as JSON. This usually means the AI didn't follow the expected format.</p>
          <details>
            <summary>Click to see raw response</summary>
            <pre style={{
              maxHeight: '400px',
              overflow: 'auto',
              background: '#f5f5f5',
              padding: '10px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              {typeof summary === 'string' ? summary : JSON.stringify(summary, null, 2)}
            </pre>
          </details>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            Try regenerating the summary. If the problem persists, there may be an issue with the backend.
          </p>
        </div>
      </div>
    );
  }

  const {
    conditions_summary = '',
    medications = [],
    upcoming_care = [],
    recent_tests = '',
    surgeries = '',
    allergies = [],
    reminders = [],
  } = parsedSummary;

  const handleExplainClick = async (term, context) => {
    setSelectedTerm(term);
    try {
      const result = await onExplainTerm(term, context);
      setExplanation(result.explanation);
    } catch (error) {
      setExplanation('Error getting explanation: ' + error.message);
    }
  };

  const closeExplanation = () => {
    setSelectedTerm(null);
    setExplanation('');
  };

  // Check if a medication needs renewal soon (within 30 days)
  const needsRenewalSoon = (renewalDate) => {
    if (!renewalDate) return false;
    const today = new Date();
    const renewal = new Date(renewalDate);
    const daysUntil = Math.ceil((renewal - today) / (1000 * 60 * 60 * 24));
    return daysUntil <= 30 && daysUntil >= 0;
  };

  // Helper function to render data that could be string, object, or array
  const renderFlexibleData = (data) => {
    if (!data) return null;

    if (typeof data === 'string') {
      return <p>{data}</p>;
    }

    if (Array.isArray(data)) {
      return (
        <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
          {data.map((item, idx) => (
            <li key={idx}>{renderFlexibleData(item)}</li>
          ))}
        </ul>
      );
    }

    if (typeof data === 'object') {
      return (
        <div style={{ marginTop: '8px' }}>
          {Object.entries(data).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong>{' '}
              {typeof value === 'object' ? JSON.stringify(value) : value}
            </p>
          ))}
        </div>
      );
    }

    return <p>{String(data)}</p>;
  };

  return (
    <div className="dashboard-container patient-dashboard">
      <h2 className="dashboard-title">Your Health Summary</h2>

      {/* Welcome Message */}
      <section className="dashboard-section welcome-section">
        <h3>Welcome! 👋</h3>
        <p>This is your personalized health summary. All information is presented in simple terms to help you better understand your health.</p>
      </section>

      {/* Conditions Summary */}
      {conditions_summary && (
        <section className="dashboard-section">
          <h3 className="section-title">🩺 Your Health Conditions</h3>
          <div className="patient-content">
            {renderFlexibleData(conditions_summary)}
          </div>
        </section>
      )}

      {/* Medications */}
      {medications.length > 0 && (
        <section className="dashboard-section">
          <h3 className="section-title">💊 Your Medications</h3>
          <div className="medications-patient-grid">
            {medications.map((med, index) => (
              <div key={index} className="medication-patient-card">
                <div className="med-header">
                  <h4 className="med-name">{med.name}</h4>
                  {med.renewal_date && needsRenewalSoon(med.renewal_date) && (
                    <span className="renewal-badge">Renewal Soon</span>
                  )}
                </div>
                <div className="med-info">
                  <p className="what-it-does">
                    <strong>What it does:</strong> {med.what_it_does}
                  </p>
                  <p><strong>Dose:</strong> {med.dose}</p>
                  <p><strong>When to take:</strong> {med.when_to_take}</p>
                  {med.renewal_date && (
                    <p className="renewal-info">
                      <strong>Renewal Date:</strong> {med.renewal_date}
                    </p>
                  )}
                </div>
                <button
                  className="explain-btn"
                  onClick={() => handleExplainClick(med.name, med.what_it_does)}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Care */}
      {upcoming_care.length > 0 && (
        <section className="dashboard-section">
          <h3 className="section-title">📅 Upcoming Appointments & Care</h3>
          <div className="upcoming-care-list">
            {upcoming_care.map((care, index) => (
              <div key={index} className="care-item">
                <div className="care-icon">📍</div>
                <div className="care-details">
                  <h4>{care.type}</h4>
                  <p className="care-date">{care.date}</p>
                  <p className="care-expectation">{care.what_to_expect}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recent Tests */}
      {recent_tests && (
        <section className="dashboard-section">
          <h3 className="section-title">🧪 Recent Test Results</h3>
          <div className="patient-content">
            {renderFlexibleData(recent_tests)}
          </div>
        </section>
      )}

      {/* Surgeries */}
      {surgeries && (
        <section className="dashboard-section">
          <h3 className="section-title">🏥 Procedures & Surgeries</h3>
          <div className="patient-content">
            {renderFlexibleData(surgeries)}
          </div>
        </section>
      )}

      {/* Allergies */}
      {allergies.length > 0 && (
        <section className="dashboard-section allergies-section">
          <h3 className="section-title">⚠️ Allergies</h3>
          <div className="allergies-list">
            {allergies.map((allergy, index) => (
              <div key={index} className="allergy-badge">
                {typeof allergy === 'string' ? allergy : allergy.name || JSON.stringify(allergy)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reminders */}
      {reminders.length > 0 && (
        <section className="dashboard-section reminders-section">
          <h3 className="section-title">🔔 Important Reminders</h3>
          <div className="reminders-list">
            {reminders.map((reminder, index) => {
              // Handle both string and object reminders
              if (typeof reminder === 'string') {
                return (
                  <div key={index} className="reminder-item">
                    <div className="reminder-icon">✓</div>
                    <p>{reminder}</p>
                  </div>
                );
              } else if (typeof reminder === 'object') {
                // Handle object reminders with action, date, details structure
                return (
                  <div key={index} className="reminder-item">
                    <div className="reminder-icon">✓</div>
                    <div className="reminder-content">
                      <p className="reminder-action"><strong>{reminder.action}</strong></p>
                      {reminder.date && <p className="reminder-date">📅 {reminder.date}</p>}
                      {reminder.details && <p className="reminder-details">{reminder.details}</p>}
                    </div>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </section>
      )}

      {/* Explanation Modal */}
      {selectedTerm && (
        <div className="explanation-modal-overlay" onClick={closeExplanation}>
          <div className="explanation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedTerm}</h3>
              <button className="close-btn" onClick={closeExplanation}>✕</button>
            </div>
            <div className="modal-content">
              {explanation ? (
                <p>{explanation}</p>
              ) : (
                <p className="loading">Loading explanation...</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
