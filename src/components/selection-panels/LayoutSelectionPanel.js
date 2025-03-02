// src/components/selection-panels/LayoutSelectionPanel.js
import React from 'react';
import PropTypes from 'prop-types';

function LayoutSelectionPanel({ isOpen, onClose, currentLayout, onSelectLayout }) {
  if (!isOpen) return null;
  
  const layoutOptions = [
    { id: 'single', label: 'Single Image', description: '1 photo per page' },
    { id: 'collage', label: 'Collage', description: '2-3 photos per page' },
    { id: 'grid', label: 'Grid', description: '4-6 photos per page' }
  ];

  return (
    <div className="selection-panel-container">
      <div className="selection-panel">
        <div className="panel-header">
          <h3>Select Layout</h3>
          <button className="done-button" onClick={onClose}>Done</button>
        </div>
        
        <div className="layout-options-row">
          {layoutOptions.map(option => (
            <div 
              key={option.id}
              className={`layout-option ${currentLayout === option.id ? 'selected' : ''}`}
              onClick={() => onSelectLayout(option.id)}
            >
              <div className="layout-preview">
                <div className={`layout-sample layout-${option.id}`}></div>
              </div>
              <div className="layout-info">
                <div className="layout-label">{option.label}</div>
                <div className="layout-description">{option.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

LayoutSelectionPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentLayout: PropTypes.string,
  onSelectLayout: PropTypes.func.isRequired
};

export default LayoutSelectionPanel;