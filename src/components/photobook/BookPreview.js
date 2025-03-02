// src/components/photobook/BookPreview.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBook } from '../../hooks/usePhotoBook';
import ImageEditor from './ImageEditor';

function BookPreview() {
  const navigate = useNavigate();
  const { 
    selectedImages, 
    coverImageIndex,
    layout, 
    theme, 
    captions,
    textStyles,
    imageZoomLevels,
    imagePositions,
    updateImageZoom,
    updateImagePosition,
    replaceImage,
    deleteImage,
    goToStep 
  } = usePhotoBook();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [activeImageId, setActiveImageId] = useState(null);
  const coverImage = selectedImages[coverImageIndex];
  
  // Helper to get total number of pages based on layout
  const getTotalPages = () => {
    const contentPages = selectedImages.length - 1; // Minus cover
    if (layout === 'single') return contentPages;
    if (layout === 'collage') return Math.ceil(contentPages / 2);
    if (layout === 'grid') return Math.ceil(contentPages / 4);
    return contentPages;
  };
  
  // Get images for the current page
  const getCurrentPageImages = () => {
    // Skip cover image
    const contentImages = selectedImages.filter((_, idx) => idx !== coverImageIndex);
    
    if (layout === 'single') {
      return [contentImages[currentPage]].filter(Boolean);
    }
    
    if (layout === 'collage') {
      const startIdx = currentPage * 2;
      return contentImages.slice(startIdx, startIdx + 2).filter(Boolean);
    }
    
    if (layout === 'grid') {
      const startIdx = currentPage * 4;
      return contentImages.slice(startIdx, startIdx + 4).filter(Boolean);
    }
    
    return [contentImages[currentPage]].filter(Boolean);
  };
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
    setActiveImageId(null); // Reset active image when changing page
  };
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(getTotalPages() - 1, prev + 1));
    setActiveImageId(null); // Reset active image when changing page
  };
  
  const handleEdit = () => {
    goToStep('customization');
    navigate('/photo-books/customize');
  };
  
  const handleCheckout = () => {
    goToStep('checkout');
    navigate('/photo-books/checkout');
  };
  
  // Handle image editing functions
  const handleImageZoomChange = (imageId, zoom) => {
    updateImageZoom(imageId, zoom);
  };
  
  const handleImagePositionChange = (imageId, position) => {
    updateImagePosition(imageId, position);
  };
  
  const handleImageReplace = (imageId, file) => {
    replaceImage(imageId, file);
  };
  
  const handleImageDelete = (imageId) => {
    deleteImage(imageId);
    setActiveImageId(null);
    
    // If we deleted an image, we may need to adjust current page
    if (currentPage >= getTotalPages()) {
      setCurrentPage(Math.max(0, getTotalPages() - 1));
    }
  };
  
  return (
    <div className="book-preview-container">
      <h2>Preview Your Photo Book</h2>
      
      <div className="book-viewer">
        <div className="book-navigation">
          <button 
            className="page-nav-button"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
          >
            ←
          </button>
          
          <div className={`book-display theme-${theme}`}>
          {currentPage === 0 ? (
  // Cover page
  <div className="book-cover" style={{ padding: 0, margin: 0, border: 'none', overflow: 'hidden' }}>
    <ImageEditor
      imageId={coverImage.id}
      imageSrc={coverImage.preview}
      initialZoom={imageZoomLevels[coverImage.id] || 1}
      initialPosition={imagePositions[coverImage.id] || { x: 50, y: 50 }}
      onZoomChange={handleImageZoomChange}
      onPositionChange={handleImagePositionChange}
      onReplace={handleImageReplace}
      onDelete={handleImageDelete}
      isActive={activeImageId === coverImage.id}
      setActiveImageId={setActiveImageId}
    />
    <div className="cover-overlay">
      <h3 className="book-title">My Photo Book</h3>
    </div>
  </div>
) : (
  // Content pages
  <div className={`book-page layout-${layout}`} style={{ padding: 0, margin: 0, border: 'none' }}>
    {getCurrentPageImages().map((image, idx) => (
      <div key={image.id} className="page-content" style={{ padding: 0, margin: 0, border: 'none' }}>
        <ImageEditor
          imageId={image.id}
          imageSrc={image.preview}
          initialZoom={imageZoomLevels[image.id] || 1}
          initialPosition={imagePositions[image.id] || { x: 50, y: 50 }}
          onZoomChange={handleImageZoomChange}
          onPositionChange={handleImagePositionChange}
          onReplace={handleImageReplace}
          onDelete={handleImageDelete}
          isActive={activeImageId === image.id}
          setActiveImageId={setActiveImageId}
        />
        
        {captions[image.id] && (
          <div className={`caption-text ${textStyles[image.id] || 'standard'}`}>
            {captions[image.id]}
          </div>
        )}
      </div>
    ))}
  </div>
)}
          </div>
          
          <button 
            className="page-nav-button"
            onClick={handleNextPage}
            disabled={currentPage >= getTotalPages()}
          >
            →
          </button>
        </div>
        
        <div className="page-indicator">
          Page {currentPage + 1} of {getTotalPages() + 1}
        </div>
      </div>
      
      <div className="validation-warnings">
        {/* Display warnings about low-res images, missing captions, etc. */}
        {selectedImages.some(img => {
          // Example validation logic - could be more sophisticated
          const imgElement = new Image();
          imgElement.src = img.preview;
          return imgElement.width < 1000 || imgElement.height < 1000;
        }) && (
          <div className="warning-message">
            ⚠️ Some images have low resolution and may appear blurry when printed.
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button 
          className="secondary-button"
          onClick={handleEdit}
        >
          Edit Book
        </button>
        <button 
          className="primary-button"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default BookPreview;