// src/components/selection-panels/ThemeSelectionPanel.js
import React from 'react';
import PropTypes from 'prop-types';

function ThemeSelectionPanel({ isOpen, onClose, currentTheme, onSelectTheme }) {
  if (!isOpen) return null;
  
  const themeOptions = [
    { id: 'white', label: 'White', color: '#ffffff' },
    { id: 'black', label: 'Black', color: '#000000' },
    { id: 'cream', label: 'Cream', color: '#f8f4e3' },
    { id: 'pastel', label: 'Pastel Blue', color: '#d0e8f2' },
    { id: 'mint', label: 'Mint', color: '#d4f0db' },
    { id: 'rose', label: 'Rose', color: '#f7d4d4' }
  ];

  return (
    <div className="selection-panel-container">
      <div className="selection-panel">
        <div className="panel-header">
          <h3>Select Theme</h3>
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
        
        <div className="theme-options-grid">
          {themeOptions.map(option => (
            <div 
              key={option.id}
              className={`theme-option ${currentTheme === option.id ? 'selected' : ''}`}
              onClick={() => onSelectTheme(option.id)}
              >
                <div 
                  className="theme-color-sample" 
                  style={{ backgroundColor: option.color }}
                ></div>
                <div className="theme-label">{option.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  ThemeSelectionPanel.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    currentTheme: PropTypes.string,
    onSelectTheme: PropTypes.func.isRequired
  };
  
  export default ThemeSelectionPanel;