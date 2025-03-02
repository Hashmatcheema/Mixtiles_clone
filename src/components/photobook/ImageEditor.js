// src/components/photobook/ImageEditor.js
import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ImageEditor.css';

function ImageEditor({ 
  imageId, 
  imageSrc, 
  initialZoom = 1, 
  initialPosition = { x: 50, y: 50 }, 
  onZoomChange,
  onPositionChange,
  isActive,
  setActiveImageId
}) {
  const imageContainerRef = useRef(null);

  // Apply style for image based on zoom and position
  const imageStyle = {
    width: `${initialZoom * 100}%`,
    height: `${initialZoom * 100}%`,
    objectFit: 'cover',
    objectPosition: `${initialPosition.x}% ${initialPosition.y}%`,
    transition: 'all 0.2s ease-out',
    display: 'block',
    margin: 0,
    padding: 0,
    transformOrigin: 'center center'
  };

  // Handle click on image to activate editor
  const handleImageClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    if (!isActive) {
      setActiveImageId(imageId);
    }
  };

  // Add document click listener to detect clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Only run this check if this image is active
      if (isActive && 
          imageContainerRef.current && 
          !imageContainerRef.current.contains(e.target) &&
          !e.target.closest('.editor-controls-container')) {
        // Don't deactivate if click was on controls
        setActiveImageId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, setActiveImageId]);

  return (
    <div 
      className={`image-editor-container ${isActive ? 'active' : ''}`} 
      ref={imageContainerRef}
      onClick={handleImageClick}
    >
      <div 
        className="image-editor"
        style={{ margin: 0, padding: 0, overflow: 'hidden', width: '100%', height: '100%' }}
      >
        <img 
          src={imageSrc} 
          alt="Book page content" 
          style={imageStyle}
        />
      </div>
    </div>
  );
}

ImageEditor.propTypes = {
  imageId: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  initialZoom: PropTypes.number,
  initialPosition: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  }),
  onZoomChange: PropTypes.func,
  onPositionChange: PropTypes.func,
  isActive: PropTypes.bool,
  setActiveImageId: PropTypes.func.isRequired
};

export default ImageEditor;