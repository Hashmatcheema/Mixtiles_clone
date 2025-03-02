// src/components/photobook/SizeSelectionModal.js
import React from 'react';
import PropTypes from 'prop-types';
import './SizeSelectionModal.css';

function SizeSelectionModal({ isOpen, onClose, currentSize, onSelectSize }) {
  if (!isOpen) return null;

  const sizeOptions = [
    { id: 'small', dimensions: '21x21 cm', price: 49 },
    { id: 'medium', dimensions: '25x25 cm', price: 79 },
    { id: 'large', dimensions: '32x32 cm', price: 99 }
  ];

  return (
    <div className="size-modal-overlay">
      <div className="size-modal-content">
        <div className="size-modal-header">
          <h2>Select Book Size</h2>
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
        
        <div className="size-preview-container">
          <div className="size-preview-image">
            <video width="100%" autoPlay loop muted playsInline>
              <source src="/images/Sizepanel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        
        <div className="size-options-container">
          {sizeOptions.map(option => (
            <div 
              key={option.id}
              className={`size-option ${currentSize === option.id ? 'selected' : ''}`}
              onClick={() => onSelectSize(option.id)}
            >
              <div className="size-dimensions">{option.dimensions}</div>
              <div className="size-price">US${option.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

SizeSelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentSize: PropTypes.string,
  onSelectSize: PropTypes.func.isRequired
};

export default SizeSelectionModal;