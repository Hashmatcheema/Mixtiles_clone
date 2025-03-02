import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CoverEditor.css';

function CoverEditor({ 
  isOpen, 
  onClose, 
  coverImage, 
  initialTitle = 'Happy Moments', 
  initialFont = 'minimalist',
  onSave 
}) {
  const [title, setTitle] = useState(initialTitle);
  const [font, setFont] = useState(initialFont);
  const [cropPosition, setCropPosition] = useState(50);

  // Reset values when opened
  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setFont(initialFont);
      setCropPosition(50);
    }
  }, [isOpen, initialTitle, initialFont]);

  // Font options
  const fontOptions = [
    { id: 'minimalist', label: 'Minimalist' },
    { id: 'classic', label: 'Classic' },
    { id: 'handwriting', label: 'Handwriting' },
    { id: 'bold', label: 'BOLD' }
  ];

  // Handle save action
  const handleSave = () => {
    onSave({
      title,
      font,
      cropPosition
    });
    onClose();
  };

  return (
    <div className={`cover-editor-container ${isOpen ? 'open' : ''}`}>
      <div className="cover-editor">
        <h2>Edit Cover</h2>
        
        <div className="editor-content">
          {/* Title Input */}
          <div className="title-section">
            <label htmlFor="cover-title">Title</label>
            <input 
              type="text"
              id="cover-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          
          {/* Font Selection */}
          <div className="font-section">
            <label>Title Font</label>
            <div className="font-options">
              {fontOptions.map(fontOption => (
                <button
                  key={fontOption.id}
                  className={`font-option ${font === fontOption.id ? 'selected' : ''}`}
                  onClick={() => setFont(fontOption.id)}
                >
                  {fontOption.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="editor-actions">
            
            <button 
              className="save-button"
              onClick={handleSave}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CoverEditor.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  coverImage: PropTypes.string,
  initialTitle: PropTypes.string,
  initialFont: PropTypes.string,
  onSave: PropTypes.func.isRequired
};

export default CoverEditor;