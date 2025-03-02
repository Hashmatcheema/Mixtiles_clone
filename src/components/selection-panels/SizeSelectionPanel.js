// src/components/selection-panels/SizeSelectionPanel.js
import React from 'react';
import PropTypes from 'prop-types';

function SizeSelectionPanel({ isOpen, onClose, currentSize, onSelectSize }) {
  if (!isOpen) return null;
  
  const sizeOptions = [
    { 
      id: 'small', 
      label: 'Small', 
      dimensions: '8×8"', 
      aspectRatio: '1:1',
      price: 49
    },
    { 
      id: 'medium', 
      label: 'Medium', 
      dimensions: '12×12"', 
      aspectRatio: '1:1', 
      isDefault: true,
      price: 79
    },
    { 
      id: 'large', 
      label: 'Large', 
      dimensions: '16×16"', 
      aspectRatio: '1:1',
      price: 99
    }
  ];

  return (
    <div className="selection-panel-container">
      <div className="selection-panel">
        <div className="panel-header">
          <h3>Select Size</h3>
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
        
        <div className="size-options-grid">
          {sizeOptions.map(option => (
            <div 
              key={option.id}
              className={`size-option ${currentSize === option.id ? 'selected' : ''}`}
              onClick={() => onSelectSize(option.id)}
            >
              <div 
                className="size-preview" 
                style={{ aspectRatio: option.aspectRatio }}
              >
                <div className="size-frame"></div>
              </div>
              <div className="size-info">
                <div className="size-label">{option.label}</div>
                <div className="size-dimensions">{option.dimensions}</div>
                <div className="size-price">US${option.price}</div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="size-description">
          <p>All photo books have square pages to create a balanced, elegant layout for your memories.</p>
        </div>
      </div>
    </div>
  );
}

SizeSelectionPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentSize: PropTypes.string,
  onSelectSize: PropTypes.func.isRequired
};

export default SizeSelectionPanel;