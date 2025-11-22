import React, { useState, useEffect } from 'react';
import './DataEditor.css';

const DataEditor = ({ initialData, onSave }) => {
  const [editableData, setEditableData] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (initialData) {
      setEditableData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setEditableData(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(editableData);
    setHasChanges(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableData(initialData);
    setHasChanges(false);
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="data-editor-container">
      <div className="editor-header">
        <h3>Medical Records</h3>
        <div className="editor-actions">
          {!isEditing ? (
            <button className="btn-edit" onClick={toggleEdit}>
              ✏️ Edit
            </button>
          ) : (
            <>
              <button
                className="btn-save"
                onClick={handleSave}
                disabled={!hasChanges}
              >
                💾 Save
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                ✕ Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          className="editor-textarea"
          value={editableData}
          onChange={handleChange}
          placeholder="Enter or paste medical records here..."
          rows={20}
        />
      ) : (
        <div className="editor-display">
          {editableData ? (
            <pre className="medical-text">{editableData}</pre>
          ) : (
            <p className="no-data">No medical records uploaded yet.</p>
          )}
        </div>
      )}

      {hasChanges && isEditing && (
        <div className="unsaved-changes-warning">
          ⚠️ You have unsaved changes
        </div>
      )}
    </div>
  );
};

export default DataEditor;
