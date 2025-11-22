import React, { useState } from 'react';
import './FileUpload.css';

const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    const fileArray = Array.from(files);
    setSelectedFiles(fileArray);

    // Read all files
    const fileContents = await Promise.all(
      fileArray.map(async (file) => {
        const text = await file.text();
        return {
          name: file.name,
          content: text,
          size: file.size,
          lastModified: new Date(file.lastModified),
        };
      })
    );

    onFileUpload(fileContents);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  return (
    <div className="file-upload-container">
      <div
        className={`file-upload-dropzone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-input"
          multiple
          accept=".txt,.pdf,.doc,.docx"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input" className="file-upload-label">
          <div className="upload-icon">📄</div>
          <p className="upload-text">
            Drag and drop medical records here or click to browse
          </p>
          <p className="upload-subtext">
            Supports .txt, .pdf, .doc, .docx files
          </p>
        </label>
      </div>

      {selectedFiles.length > 0 && (
        <div className="selected-files">
          <h3>Selected Files:</h3>
          <ul className="file-list">
            {selectedFiles.map((file, index) => (
              <li key={index} className="file-item">
                <span className="file-name">{file.name}</span>
                <span className="file-size">
                  ({(file.size / 1024).toFixed(2)} KB)
                </span>
                <button
                  className="remove-file-btn"
                  onClick={() => removeFile(index)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
