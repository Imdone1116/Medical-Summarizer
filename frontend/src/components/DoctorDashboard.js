import React from 'react';
import './DoctorDashboard.css';

const DoctorDashboard = ({ summary }) => {
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
    return (
      <div className="dashboard-container">
        <div className="error-message">
          Error parsing summary. Raw response:
          <pre>{summary}</pre>
        </div>
      </div>
    );
  }

  const {
    current_medications = [],
    appointments = {},
    recent_labs = [],
    major_surgeries = {},
    conditions = {},
    recent_imaging = [],
    clinical_trial_notes = '',
  } = parsedSummary;

  const getLabStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'high':
        return 'status-high';
      case 'low':
        return 'status-low';
      case 'normal':
        return 'status-normal';
      default:
        return '';
    }
  };

  return (
    <div className="dashboard-container doctor-dashboard">
      <h2 className="dashboard-title">Doctor's Dashboard</h2>

      {/* Current Medications */}
      <section className="dashboard-section">
        <h3 className="section-title">💊 Current Medications</h3>
        {current_medications.length > 0 ? (
          <div className="medications-grid">
            {current_medications.map((med, index) => (
              <div key={index} className="medication-card">
                <h4 className="medication-name">{med.name}</h4>
                <p><strong>Dose:</strong> {med.dose}</p>
                <p><strong>Frequency:</strong> {med.frequency}</p>
                {med.renewal_date && (
                  <p className="renewal-date">
                    <strong>Renewal:</strong> {med.renewal_date}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No current medications recorded.</p>
        )}
      </section>

      {/* Appointments */}
      <section className="dashboard-section">
        <h3 className="section-title">📅 Appointments</h3>
        <div className="appointments-container">
          {appointments.last_visit && (
            <div className="appointment-card">
              <h4>Last Visit</h4>
              <p>{appointments.last_visit}</p>
            </div>
          )}
          {appointments.upcoming_visits && (
            <div className="appointment-card upcoming">
              <h4>Upcoming Visits</h4>
              <p>{appointments.upcoming_visits}</p>
            </div>
          )}
          {!appointments.last_visit && !appointments.upcoming_visits && (
            <p className="no-data">No appointment information available.</p>
          )}
        </div>
      </section>

      {/* Recent Labs */}
      <section className="dashboard-section">
        <h3 className="section-title">🧪 Recent Lab Results</h3>
        {recent_labs.length > 0 ? (
          <div className="labs-table">
            <table>
              <thead>
                <tr>
                  <th>Test</th>
                  <th>Value</th>
                  <th>Normal Range</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent_labs.map((lab, index) => (
                  <tr key={index}>
                    <td>{lab.test_name}</td>
                    <td>{lab.value} {lab.unit}</td>
                    <td>{lab.normal_range}</td>
                    <td>
                      <span className={`status-badge ${getLabStatusColor(lab.status)}`}>
                        {lab.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="no-data">No recent lab results available.</p>
        )}
      </section>

      {/* Major Surgeries */}
      <section className="dashboard-section">
        <h3 className="section-title">🏥 Major Surgeries</h3>
        <div className="surgeries-container">
          {major_surgeries.previous && (
            <div className="surgery-card">
              <h4>Previous</h4>
              <p>{major_surgeries.previous}</p>
            </div>
          )}
          {major_surgeries.scheduled && (
            <div className="surgery-card scheduled">
              <h4>Scheduled</h4>
              <p>{major_surgeries.scheduled}</p>
            </div>
          )}
          {!major_surgeries.previous && !major_surgeries.scheduled && (
            <p className="no-data">No surgery information available.</p>
          )}
        </div>
      </section>

      {/* Conditions */}
      <section className="dashboard-section">
        <h3 className="section-title">🩺 Conditions</h3>
        <div className="conditions-container">
          {conditions.major && (
            <div className="condition-card major">
              <h4>Major Conditions</h4>
              <p>{conditions.major}</p>
            </div>
          )}
          {conditions.minor && (
            <div className="condition-card minor">
              <h4>Minor Conditions</h4>
              <p>{conditions.minor}</p>
            </div>
          )}
          {!conditions.major && !conditions.minor && (
            <p className="no-data">No condition information available.</p>
          )}
        </div>
      </section>

      {/* Recent Imaging */}
      {recent_imaging.length > 0 && (
        <section className="dashboard-section">
          <h3 className="section-title">📊 Recent Imaging</h3>
          <div className="imaging-grid">
            {recent_imaging.map((imaging, index) => (
              <div key={index} className="imaging-card">
                <h4>{imaging.type}</h4>
                <p><strong>Date:</strong> {imaging.date}</p>
                <p><strong>Findings:</strong> {imaging.findings}</p>
                {imaging.relevance && (
                  <p className="relevance"><strong>Relevance:</strong> {imaging.relevance}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clinical Trial Notes */}
      {clinical_trial_notes && (
        <section className="dashboard-section">
          <h3 className="section-title">🔬 Clinical Trial Notes</h3>
          <div className="clinical-notes">
            <p>{clinical_trial_notes}</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default DoctorDashboard;
