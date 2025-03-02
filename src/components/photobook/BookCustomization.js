// src/components/photobook/BookCustomization.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBook } from '../../hooks/usePhotoBook';
import LayoutSelectionPanel from '../selection-panels/LayoutSelectionPanel';
import ThemeSelectionPanel from '../selection-panels/ThemeSelectionPanel';
import ImageEditor from './ImageEditor';

function BookCustomization() {
  const navigate = useNavigate();
  const { 
    selectedImages, 
    layout, 
    theme, 
    captions, 
    textStyles,
    imageZoomLevels,
    imagePositions,
    setLayout,
    setTheme,
    updateCaption,
    updateTextStyle,
    updateImageZoom,
    updateImagePosition,
    replaceImage,
    deleteImage,
    goToStep 
  } = usePhotoBook();
  
  const [activePanelType, setActivePanelType] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeImageId, setActiveImageId] = useState(null);
  
  const togglePanel = (panelType) => {
    if (activePanelType === panelType) {
      setActivePanelType(null);
    } else {
      setActivePanelType(panelType);
      // When opening a panel, hide any active image controls
      setActiveImageId(null);
    }
  };
  
  const closeAllPanels = () => {
    setActivePanelType(null);
  };
  
  const handleCaptionChange = (imageId, caption) => {
    updateCaption(imageId, caption);
  };
  
  const handleTextStyleChange = (imageId, style) => {
    updateTextStyle(imageId, style);
  };
  
  const handleContinue = () => {
    goToStep('preview');
    navigate('/photo-books/preview');
  };
  
  // Helper to get image layout based on current layout setting
  const getPageLayout = (pageIndex) => {
    if (layout === 'single') return [pageIndex];
    if (layout === 'collage') {
      const startIdx = pageIndex * 2;
      return [startIdx, startIdx + 1].filter(idx => idx < selectedImages.length);
    }
    if (layout === 'grid') {
      const startIdx = pageIndex * 4;
      return [startIdx, startIdx + 1, startIdx + 2, startIdx + 3].filter(idx => idx < selectedImages.length);
    }
    return [pageIndex];
  };
  
  // Calculate number of pages based on layout
  const calculatePages = () => {
    if (layout === 'single') return selectedImages.length;
    if (layout === 'collage') return Math.ceil(selectedImages.length / 2);
    if (layout === 'grid') return Math.ceil(selectedImages.length / 4);
    return selectedImages.length;
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
    // Find index of image to delete
    const imageIndex = selectedImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1) return;
    
    // Check if this image is currently being displayed
    const currentPageImages = getPageLayout(activeImageIndex);
    const isOnCurrentPage = currentPageImages.includes(imageIndex);
    
    // Delete the image
    deleteImage(imageId);
    
    // Reset active image ID
    setActiveImageId(null);
    
    // Update active page index if needed
    if (isOnCurrentPage && calculatePages() <= activeImageIndex) {
      setActiveImageIndex(Math.max(0, calculatePages() - 1));
    }
  };
  
  return (
    <div className="book-customization">
      <h2>Customize Your Book</h2>
      
      <div className="customization-controls">
        <div 
          className={`control-item ${activePanelType === 'layout' ? 'active' : ''}`}
          onClick={() => togglePanel('layout')}
        >
          <span className="control-icon">📏</span>
          <span className="control-label">Layout</span>
        </div>
        
        <div 
          className={`control-item ${activePanelType === 'caption' ? 'active' : ''}`}
          onClick={() => togglePanel('caption')}
        >
          <span className="control-icon">📝</span>
          <span className="control-label">Caption</span>
        </div>
        
        <div 
          className={`control-item ${activePanelType === 'theme' ? 'active' : ''}`}
          onClick={() => togglePanel('theme')}
        >
          <span className="control-icon">🎨</span>
          <span className="control-label">Theme</span>
        </div>
      </div>
      
      <div className="page-navigation">
        <button 
          className="page-nav-button"
          disabled={activeImageIndex === 0}
          onClick={() => {
            setActiveImageIndex(prev => Math.max(0, prev - 1));
            setActiveImageId(null); // Reset active image when changing page
          }}
        >
          ← Previous
        </button>
        <span className="page-indicator">
          Page {activeImageIndex + 1} of {calculatePages()}
        </span>
        <button 
          className="page-nav-button"
          disabled={activeImageIndex >= calculatePages() - 1}
          onClick={() => {
            setActiveImageIndex(prev => Math.min(calculatePages() - 1, prev + 1));
            setActiveImageId(null); // Reset active image when changing page
          }}
        >
          Next →
        </button>
      </div>
      
      <div className={`book-preview theme-${theme}`}>
        <div className={`page-layout layout-${layout}`}>
          {getPageLayout(activeImageIndex).map(imgIdx => {
            const image = selectedImages[imgIdx];
            if (!image) return null;
            
            return (
              <div key={image.id} className="page-item">
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
            );
          })}
        </div>
      </div>
      
      {activePanelType === 'caption' && (
        <div className="caption-editor">
          {getPageLayout(activeImageIndex).map(imgIdx => {
            const image = selectedImages[imgIdx];
            if (!image) return null;
            
            return (
              <div key={image.id} className="caption-input-group">
                <label htmlFor={`caption-${image.id}`}>Caption for Image {imgIdx + 1}:</label>
                <input
                  id={`caption-${image.id}`}
                  type="text"
                  value={captions[image.id] || ''}
                  onChange={e => handleCaptionChange(image.id, e.target.value)}
                  maxLength={100}
                  placeholder="Add a caption..."
                />
                
                <div className="text-style-options">
                  <button 
                    className={`style-button ${(textStyles[image.id] || 'standard') === 'standard' ? 'active' : ''}`}
                    onClick={() => handleTextStyleChange(image.id, 'standard')}
                  >
                    Standard
                  </button>
                  <button 
                    className={`style-button ${(textStyles[image.id] || '') === 'elegant' ? 'active' : ''}`}
                    onClick={() => handleTextStyleChange(image.id, 'elegant')}
                  >
                    Elegant
                  </button>
                  <button 
                    className={`style-button ${(textStyles[image.id] || '') === 'bold' ? 'active' : ''}`}
                    onClick={() => handleTextStyleChange(image.id, 'bold')}
                  >
                    Bold
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="action-buttons">
        <button 
          className="secondary-button"
          onClick={() => {
            goToStep('arrangement');
            navigate('/photo-books/arrange');
          }}
        >
          Back
        </button>
        <button 
          className="primary-button"
          onClick={handleContinue}
        >
          Preview Book
        </button>
      </div>
      
      {/* Selection panels */}
      <LayoutSelectionPanel
        isOpen={activePanelType === 'layout'}
        onClose={closeAllPanels}
        currentLayout={layout}
        onSelectLayout={setLayout}
      />
      
      <ThemeSelectionPanel
        isOpen={activePanelType === 'theme'}
        onClose={closeAllPanels}
        currentTheme={theme}
        onSelectTheme={setTheme}
      />
    </div>
  );
}

export default BookCustomization;