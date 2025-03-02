// src/components/photobook/ImageEditorControls.js
import React from 'react';
import PropTypes from 'prop-types';
import './ImageEditorControls.css';

function ImageEditorControls({
  isVisible,
  zoom,
  onZoomChange,
  onZoomIn,
  onZoomOut,
  onReplace,
  onDelete,
  onDone
}) {
  if (!isVisible) return null;

  // Handler to prevent clicks from propagating to document
  const handleControlsClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="editor-controls-container" onClick={handleControlsClick}>
      <div className="crop-control-section">
        <p className="crop-instruction">Drag to adjust crop</p>
        <div className="zoom-slider-container">
          <button 
            className="zoom-button zoom-out" 
            onClick={onZoomOut}
            aria-label="Zoom out"
          >
            -
          </button>
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={zoom}
            onChange={onZoomChange}
            className="zoom-slider"
          />
          <button 
            className="zoom-button zoom-in" 
            onClick={onZoomIn}
            aria-label="Zoom in"
          >
            +
          </button>
        </div>
      </div>

      <div className="edit-buttons-section">
        <button className="edit-button replace-button" onClick={onReplace}>
          <span className="button-icon">↺</span> Replace Photo
        </button>
        <button className="edit-button delete-button" onClick={onDelete}>
          <span className="button-icon">🗑</span> Delete Photo
        </button>
      </div>

      <button className="done-button" onClick={onDone}>
        Done
      </button>
    </div>
  );
}

ImageEditorControls.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  zoom: PropTypes.number.isRequired,
  onZoomChange: PropTypes.func.isRequired,
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onDone: PropTypes.func.isRequired
};

export default ImageEditorControls;