// src/components/SizeSelectionPanel.js
import React from 'react';
import PropTypes from 'prop-types';

function SizeSelectionPanel({ isOpen, onClose, currentSize, onSelectSize }) {
  const sizeOptions = [
    { id: 'small', label: 'Small', dimensions: '8×8"', aspectRatio: '1:1' },
    { id: 'medium', label: 'Medium', dimensions: '12×12"', aspectRatio: '1:1', isDefault: true },
    { id: 'large', label: 'Large', dimensions: '16×16"', aspectRatio: '1:1' },
    { id: 'portrait-small', label: 'Portrait', dimensions: '8×10"', aspectRatio: '4:5' },
    { id: 'portrait-medium', label: 'Portrait', dimensions: '12×15"', aspectRatio: '4:5' },
    { id: 'landscape-small', label: 'Landscape', dimensions: '10×8"', aspectRatio: '5:4' },
    { id: 'landscape-medium', label: 'Landscape', dimensions: '15×12"', aspectRatio: '5:4' },
  ];

  if (!isOpen) return null;

  return (
    <>
      <div className="option-panel-overlay" onClick={onClose}></div>
      <div className="option-panel size-panel">
        <div className="panel-header">
          <h3>Choose Size</h3>
          <button className="close-panel-button" onClick={onClose}>×</button>
        </div>
        
        <div className="size-options-grid">
          {sizeOptions.map(size => (
            <div 
              key={size.id}
              className={`size-option ${currentSize === size.id ? 'selected' : ''}`}
              onClick={() => onSelectSize(size.id)}
            >
              <div className="size-preview" style={{ aspectRatio: size.aspectRatio }}>
                <div className="size-frame"></div>
              </div>
              <div className="size-info">
                <div className="size-label">{size.label}</div>
                <div className="size-dimensions">{size.dimensions}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="custom-size-option">
          <div className="custom-size-label">Need custom size?</div>
          <button className="custom-size-button">Contact Us</button>
        </div>
      </div>
    </>
  );
}

SizeSelectionPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentSize: PropTypes.string,
  onSelectSize: PropTypes.func.isRequired
};

export default SizeSelectionPanel;