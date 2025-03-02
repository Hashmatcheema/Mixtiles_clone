// src/components/photobook/BookViewer.js
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BookViewer.css';
import ImageEditor from './ImageEditor';
import ImageEditorControls from './ImageEditorControls';

function BookViewer({ 
  images, 
  currentPage, 
  onPageChange, 
  onCoverEdit,
  imageZoomLevels = {},
  imagePositions = {},
  onImageZoomChange,
  onImagePositionChange,
  onImageReplace,
  onImageDelete 
}) {
  const [activeImageId, setActiveImageId] = useState(null);
  
  // Calculate pages properly
  // Cover counts as page 0, content pages start at 1
  const totalPages = images.length > 0 ? images.length + 1 : 2; // +1 for back page
  
  // Reset active image when page changes
  useEffect(() => {
    setActiveImageId(null);
  }, [currentPage]);
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1);
    }
  };

  // Handle image interactions
  const handleImageZoom = (imageId, value) => {
    if (onImageZoomChange) {
      // Support both event objects and direct values
      const zoomValue = typeof value === 'object' ? 
        parseFloat(value.target.value) : parseFloat(value);
      onImageZoomChange(imageId, zoomValue);
    }
  };
  
  const handleImagePosition = (imageId, position) => {
    if (onImagePositionChange) {
      onImagePositionChange(imageId, position);
    }
  };
  
  const handleImageReplace = (imageId) => {
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    // Add event listener for file selection
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file && onImageReplace) {
        onImageReplace(imageId, file);
      }
      // Remove the temporary file input
      document.body.removeChild(fileInput);
    });
    
    // Trigger file input click
    fileInput.click();
  };
  
  const handleImageDelete = (imageId) => {
    if (onImageDelete) {
      onImageDelete(imageId);
      setActiveImageId(null);
    }
  };
  
  const handleDone = () => {
    setActiveImageId(null);
  };

  // Find the active image
  const getActiveImage = () => {
    if (!activeImageId) return null;
    return images.find(img => img.id === activeImageId);
  };

  // Get content for a specific page
  const getPageContent = (pageNum) => {
    // Cover page (first page)
    if (pageNum === 0 && images.length > 0) {
      const coverImage = images[0];
      const imageId = coverImage.id || 'cover';
      
      return (
        <div className="page-content cover-page" style={{ padding: 0, margin: 0, border: 'none' }}>
          <ImageEditor
            imageId={imageId}
            imageSrc={coverImage.preview}
            initialZoom={imageZoomLevels[imageId] || 1}
            initialPosition={imagePositions[imageId] || { x: 50, y: 50 }}
            onZoomChange={handleImageZoom}
            onPositionChange={handleImagePosition}
            isActive={activeImageId === imageId}
            setActiveImageId={setActiveImageId}
          />
          
          <div 
            className="cover-edit-overlay"
            onClick={(e) => {
              e.stopPropagation();
              onCoverEdit();
            }}
          >
            <span className="edit-icon">✎</span>
          </div>
          
          {coverImage.coverTitle && (
            <div 
              className={`cover-title font-${coverImage.coverFont || 'minimalist'}`}
              style={{
                color: coverImage.coverFont === 'minimalist' ? 'white' : 'black'
              }}
            >
              {coverImage.coverTitle}
            </div>
          )}
        </div>
      );
    }
    // Empty cover page prompt
    else if (pageNum === 0) {
      return (
        <div className="page-content empty-page">
          <h2>Photo Book</h2>
          <p>Add pictures to start</p>
        </div>
      );
    }
    // Back page (last page)
    else if (pageNum === totalPages - 1) {
      return (
        <div className="page-content back-page">
          <div className="back-text">Made with Mixtiles</div>
        </div>
      );
    }
    // Content pages - showing all selected images, including the first one
    else {
      // Adjust index to get correct content page
      // Page 1 should show images[0], Page 2 should show images[1], etc.
      const imageIndex = pageNum ;
      
      if (imageIndex < images.length) {
        const image = images[imageIndex];
        const imageId = image.id || `image-${imageIndex}`;
        const imageSrc = image.preview;
        
        return (
          <div className="page-content" style={{ padding: 0, margin: 0, border: 'none' }}>
            <ImageEditor
              imageId={imageId}
              imageSrc={imageSrc}
              initialZoom={imageZoomLevels[imageId] || 1}
              initialPosition={imagePositions[imageId] || { x: 50, y: 50 }}
              onZoomChange={handleImageZoom}
              onPositionChange={handleImagePosition}
              isActive={activeImageId === imageId}
              setActiveImageId={setActiveImageId}
            />
          </div>
        );
      } else {
        return (
          <div className="page-content empty-page">
            <p>Add more pictures</p>
          </div>
        );
      }
    }
  };

  // Handle single vs double page view
  let leftContent = null;
  let rightContent = null;

  // First page (cover) or last page (back) - single page view
  if (currentPage === 0 || currentPage === totalPages - 1) {
    rightContent = getPageContent(currentPage);
  } 
  // Inner pages - double page spread
  else {
    leftContent = getPageContent(currentPage);
    rightContent = currentPage + 1 < totalPages ? getPageContent(currentPage + 1) : null;
  }

  // Calculate progress percentage
  const progressPercentage = ((currentPage + 1) / totalPages) * 100;
  
  // Get active image for editor controls
  const activeImage = getActiveImage();
  const activeZoom = activeImage ? (imageZoomLevels[activeImage.id] || 1) : 1;

  return (
    <>
      <div className="book-viewer">
        {/* Left arrow navigation */}
        <button 
          className="nav-button prev-button" 
          onClick={goToPrevPage}
          disabled={currentPage === 0}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        {/* Book container */}
        <div className="book-container" style={{ padding: 0, margin: 0 }}>
          <div className={`book-spread ${currentPage === 0 || currentPage === totalPages - 1 ? 'single-page' : ''}`}
               style={{ padding: 0, margin: 0, border: 'none' }}>
            {/* Left page */}
            <div className={`book-page left-page ${!leftContent ? 'empty' : ''}`}
                 style={{ padding: 0, margin: 0, border: 'none' }}>
              {leftContent}
            </div>
            
            {/* Right page */}
            <div className={`book-page right-page ${!rightContent ? 'empty' : ''} ${currentPage === 0 || currentPage === totalPages - 1 ? 'full-page' : ''}`}
                 style={{ padding: 0, margin: 0, border: 'none' }}>
              {rightContent}
            </div>
            
            {/* Book spine - only show for double page spreads */}
            {currentPage !== 0 && currentPage !== totalPages - 1 && (
              <div className="book-spine"></div>
            )}
          </div>
        </div>
        
        {/* Right arrow navigation */}
        <button 
          className="nav-button next-button" 
          onClick={goToNextPage}
          disabled={currentPage >= totalPages - 1}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
        
        {/* Progress bar */}
        <div className="page-progress">
          <div 
            className="progress-bar" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
      
      {/* Image editor controls below the book */}
      {activeImage && (
        <ImageEditorControls 
          isVisible={!!activeImageId}
          zoom={activeZoom}
          onZoomChange={(e) => handleImageZoom(activeImageId, e)}
          onZoomIn={() => handleImageZoom(activeImageId, Math.min(activeZoom + 0.1, 2))}
          onZoomOut={() => handleImageZoom(activeImageId, Math.max(activeZoom - 0.1, 1))}
          onReplace={() => handleImageReplace(activeImageId)}
          onDelete={() => handleImageDelete(activeImageId)}
          onDone={handleDone}
        />
      )}
    </>
  );
}

BookViewer.propTypes = {
  images: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  onCoverEdit: PropTypes.func,
  imageZoomLevels: PropTypes.object,
  imagePositions: PropTypes.object,
  onImageZoomChange: PropTypes.func,
  onImagePositionChange: PropTypes.func,
  onImageReplace: PropTypes.func,
  onImageDelete: PropTypes.func
};

BookViewer.defaultProps = {
  onCoverEdit: () => {},
  imageZoomLevels: {},
  imagePositions: {},
  onImageZoomChange: () => {},
  onImagePositionChange: () => {},
  onImageReplace: () => {},
  onImageDelete: () => {}
};

export default BookViewer;