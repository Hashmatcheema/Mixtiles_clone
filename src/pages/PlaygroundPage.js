// src/pages/PlaygroundPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import BookViewer from '../components/photobook/BookViewer';
import CoverEditor from '../components/photobook/CoverEditor';
import PagesOverview from '../components/photobook/PagesOverview';
import SizeSelectionModal from '../components/photobook/SizeSelectionModal';
import './PlaygroundPage.css';

function PlaygroundPage({ galleryImages }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(0);
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [isCoverEditorOpen, setIsCoverEditorOpen] = useState(false);
  const [isPagesOverviewOpen, setIsPagesOverviewOpen] = useState(false);
  const [isSizeSelectionOpen, setIsSizeSelectionOpen] = useState(false);
  const [bookSize, setBookSize] = useState('small'); // Default size
  const [imageZoomLevels, setImageZoomLevels] = useState({});
  const [imagePositions, setImagePositions] = useState({});
  const [coverDetails, setCoverDetails] = useState({
    title: 'Happy Moments',
    font: 'minimalist',
    cropPosition: 50
  });
  
  // Size options with prices
  const sizeOptions = {
    small: { dimensions: '21x21 cm', price: 49 },
    medium: { dimensions: '25x25 cm', price: 79 },
    large: { dimensions: '32x32 cm', price: 99 }
  };
  
  // Initialize with gallery images or empty array
  useEffect(() => {
    if (galleryImages && galleryImages.length > 0) {
      // Ensure each image has a unique ID and all necessary properties
      const processedImages = galleryImages.map((img, index) => {
        // Make sure each image has an ID
        const imageId = img.id || `gallery-image-${index}-${Date.now()}`;
        
        return {
          ...img,
          id: imageId,
          preview: img.preview || img.src,
          // Add any other necessary defaults
        };
      });
      
      // Ensure first image has cover details
      if (processedImages[0]) {
        processedImages[0] = {
          ...processedImages[0],
          coverTitle: coverDetails.title,
          coverFont: coverDetails.font,
          coverCropPosition: coverDetails.cropPosition
        };
      }
      
      setImages(processedImages);
    } else {
      setImages([]);
    }
  }, [galleryImages]);
  
  // Handle page navigation
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Open cover editor
  const openCoverEditor = () => {
    setIsCoverEditorOpen(true);
  };
  
  // Handle cover edit save
  const handleCoverEditSave = (newCoverDetails) => {
    setCoverDetails(newCoverDetails);
    
    // Update first image with new cover details
    if (images.length > 0) {
      const updatedImages = [...images];
      updatedImages[0] = {
        ...updatedImages[0],
        coverTitle: newCoverDetails.title,
        coverFont: newCoverDetails.font,
        coverCropPosition: newCoverDetails.cropPosition
      };
      setImages(updatedImages);
    }
    
    setIsCoverEditorOpen(false);
  };
  
  // Handle image reordering from Pages Overview
  const handleImagesReordered = (reorderedImages) => {
    setImages(reorderedImages);
    
    // If the first image (cover) changed, update currentPage if needed
    if (currentPage === 0) {
      setCurrentPage(0); // Stay on cover
    } else {
      // Adjust current page based on the new order
      setCurrentPage(Math.min(currentPage, reorderedImages.length - 1));
    }
  };
  
  // Handle size selection
  const handleSizeSelect = (size) => {
    setBookSize(size);
    setIsSizeSelectionOpen(false);
  };
  
  // Go to cover page
  const goToCover = () => {
    setCurrentPage(0);
  };
  
  // Toggle tab panels
  const toggleTab = (tab) => {
    if (tab === 'cover') {
      // This should open the cover editor, not just navigate to cover
      setIsCoverEditorOpen(true);
      setActiveTab('cover');
      goToCover(); // Also go to cover page
    } else if (tab === 'pages') {
      setIsPagesOverviewOpen(true);
      setActiveTab('pages');
    } else if (tab === 'size') {
      // Show the size selection modal
      setIsSizeSelectionOpen(true);
      setActiveTab('size');
    } else {
      setActiveTab(activeTab === tab ? null : tab);
    }
  };
  
  // Create a proper square thumbnail
  const createSquareThumbnail = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = size;
        canvas.height = size;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          img, 
          (img.width - size) / 2, 
          (img.height - size) / 2, 
          size, 
          size, 
          0, 
          0, 
          size, 
          size
        );
        
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = imageUrl;
    });
  };
  
  // Handle multiple image uploads - FIXED for proper image processing
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;
    
    // Process each file
    const processFile = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            // Create square thumbnail from the uploaded image
            const squarePreview = await createSquareThumbnail(e.target.result);
            
            // Create a unique ID for the image
            const uniqueId = `image-${file.name.replace(/[^a-z0-9]/gi, '-')}-${Date.now()}`;
            
            resolve({
              id: uniqueId,
              file: file,
              preview: squarePreview,
              originalPreview: e.target.result
            });
          } catch (error) {
            console.error("Error processing image:", error);
            resolve(null);
          }
        };
        reader.readAsDataURL(file);
      });
    };
    
    // Process all files
    Promise.all(files.map(processFile))
      .then(newImages => {
        // Filter out any failed image processing
        const validImages = newImages.filter(img => img !== null);
        
        if (validImages.length === 0) return;
        
        // Add new images to existing images
        if (images.length === 0 && validImages.length > 0) {
          // If this is the first image, add cover details
          const firstImage = {
            ...validImages[0],
            coverTitle: coverDetails.title,
            coverFont: coverDetails.font,
            coverCropPosition: coverDetails.cropPosition
          };
          
          setImages([firstImage, ...validImages.slice(1)]);
          setCurrentPage(0); // Go to cover
        } else {
          setImages([...images, ...validImages]);
          setCurrentPage(images.length); // Go to first new page
        }
      });
  };
  
  // FIXED Image zoom handler to properly update the state
  const handleImageZoomChange = (imageId, zoomLevel) => {
    console.log("Zoom changed for image", imageId, "to", zoomLevel);
    
    setImageZoomLevels(prev => ({
      ...prev,
      [imageId]: zoomLevel
    }));
  };
  
  // FIXED Image position handler
  const handleImagePositionChange = (imageId, position) => {
    console.log("Position changed for image", imageId, "to", position);
    
    setImagePositions(prev => ({
      ...prev,
      [imageId]: position
    }));
  };
  
  // FIXED Image replace handler
  const handleImageReplace = (imageId, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        // Create square thumbnail
        const squarePreview = await createSquareThumbnail(e.target.result);
        
        // Update the image in the state
        setImages(prev => prev.map(img => 
          img.id === imageId 
            ? { 
                ...img, 
                file: file, 
                preview: squarePreview, 
                originalPreview: e.target.result 
              } 
            : img
        ));
      } catch (error) {
        console.error("Error replacing image:", error);
      }
    };
    reader.readAsDataURL(file);
  };
  
  // FIXED Image delete handler
  const handleImageDelete = (imageId) => {
    const index = images.findIndex(img => img.id === imageId);
    if (index === -1) return;
    
    const newImages = [...images];
    newImages.splice(index, 1);
    
    // Handle empty book edge case
    if (newImages.length === 0) {
      setImages([]);
      setCurrentPage(0);
      return;
    }
    
    // Adjust current page if needed
    let newPage = currentPage;
    if (index === 0) {
      // If deleting cover, the next image becomes cover
      const updatedImages = newImages.map((img, idx) => {
        if (idx === 0) {
          return {
            ...img,
            coverTitle: coverDetails.title,
            coverFont: coverDetails.font,
            coverCropPosition: coverDetails.cropPosition
          };
        }
        return img;
      });
      
      setImages(updatedImages);
      setCurrentPage(0); // Go to new cover
    } else {
      // If deleting a content page
      if (currentPage > index) {
        // If we're on a page after the deleted one, move back one page
        newPage = currentPage - 1;
      } else if (currentPage === index && currentPage >= newImages.length) {
        // If we're on the deleted page and it's the last page, go to new last page
        newPage = Math.max(0, newImages.length - 1);
      }
      
      setImages(newImages);
      setCurrentPage(newPage);
    }
  };
  
  // Calculate total pages (content pages + cover + back)
  const totalPages = images.length + 1; // +1 for back page (first image is cover)
  
  // Get current book price
  const getCurrentPrice = () => {
    return sizeOptions[bookSize]?.price || 49; // Default to $49 if not found
  };
  
  return (
    <div className="playground-page">
      {/* Book viewer component with controls below */}
      <div className="book-viewer-container">
        <BookViewer 
          images={images}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onCoverEdit={openCoverEditor}
          imageZoomLevels={imageZoomLevels}
          imagePositions={imagePositions}
          onImageZoomChange={handleImageZoomChange}
          onImagePositionChange={handleImagePositionChange}
          onImageReplace={handleImageReplace}
          onImageDelete={handleImageDelete}
        />
      </div>
      
      {/* Page indicator */}
      <div className="page-indicator">
        Page {currentPage + 1} of {totalPages}
      </div>
      
      {/* Tab navigation */}
      <div className="book-tabs">
        <div 
          className={`tab-item ${activeTab === 'cover' || currentPage === 0 ? 'active' : ''}`}
          onClick={() => toggleTab('cover')}
        >
          <div className="tab-icon">📚</div>
          <div className="tab-label">Cover</div>
        </div>
        
        <div 
          className={`tab-item ${activeTab === 'pages' ? 'active' : ''}`}
          onClick={() => toggleTab('pages')}
        >
          <div className="tab-icon">📄</div>
          <div className="tab-label">Pages</div>
        </div>
        
        <div 
          className={`tab-item ${activeTab === 'size' ? 'active' : ''}`}
          onClick={() => toggleTab('size')}
        >
          <div className="tab-icon">📏</div>
          <div className="tab-label">Size</div>
        </div>
        
        <div className="add-button">
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            onChange={handleImageUpload} 
            style={{ display: 'none' }}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="plus-icon">+</label>
        </div>
      </div>
      
      {/* Cover Editor */}
      <CoverEditor 
        isOpen={isCoverEditorOpen}
        onClose={() => setIsCoverEditorOpen(false)}
        coverImage={images.length > 0 ? 
          (typeof images[0] === 'object' ? images[0].preview : images[0]) 
          : null
        }
        initialTitle={coverDetails.title}
        initialFont={coverDetails.font}
        onSave={handleCoverEditSave}
      />
      
      {/* Pages Overview */}
      <PagesOverview
        isOpen={isPagesOverviewOpen}
        onClose={() => setIsPagesOverviewOpen(false)}
        images={images}
        onImagesReordered={handleImagesReordered}
      />
      
      {/* Size Selection Modal */}
      <SizeSelectionModal
        isOpen={isSizeSelectionOpen}
        onClose={() => setIsSizeSelectionOpen(false)}
        currentSize={bookSize}
        onSelectSize={handleSizeSelect}
      />
    </div>
  );
}

PlaygroundPage.propTypes = {
  galleryImages: PropTypes.array
};

PlaygroundPage.defaultProps = {
  galleryImages: []
};

export default PlaygroundPage;