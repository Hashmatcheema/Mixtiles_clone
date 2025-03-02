import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBook } from '../../hooks/usePhotoBook';

function ImageSelection() {
  const navigate = useNavigate();
  const { selectedImages, selectImages, goToStep } = usePhotoBook();
  const [uploadedImages, setUploadedImages] = useState([]);
  const [activeTab, setActiveTab] = useState('device');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Ensure selected images are always part of uploadedImages
    setUploadedImages((prev) => [...new Set([...prev, ...selectedImages])]);
  }, [selectedImages]);

  // Helper function to crop image to square
  const cropToSquare = (imageUrl) => {
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

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;

    setIsLoading(true);

    const newImagesPromises = files
      .filter((file) => !uploadedImages.some((img) => img.file.name === file.name)) // Prevent duplicates
      .map(async (file) => {
        // Create URL for the image
        const originalPreview = URL.createObjectURL(file);
        
        // Crop to square
        const squarePreview = await cropToSquare(originalPreview);
        
        // Clean up original preview URL to prevent memory leaks
        URL.revokeObjectURL(originalPreview);
        
        return {
          id: `${file.name}-${file.lastModified}`,
          file,
          preview: squarePreview,
          originalPreview: null, // Not storing original since we're using square crops
          selected: false,
        };
      });

    const newImages = await Promise.all(newImagesPromises);
    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsLoading(false);
  };

  const toggleImageSelection = (image) => {
    if (selectedImages.some((img) => img.id === image.id)) {
      selectImages(selectedImages.filter((img) => img.id !== image.id));
    } else {
      if (selectedImages.length >= 50) {
        alert('Maximum 50 photos allowed.');
        return;
      }
      selectImages([...selectedImages, image]);
    }
  };

  const handleContinue = () => {
    if (selectedImages.length < 20) {
      alert('Please select at least 20 photos.');
      return;
    }
    goToStep('arrangement');
    navigate('/photo-books/arrange');
  };

  return (
    <div className="image-selection">
      <h2>Select Photos for Your Book</h2>
      <p className="selection-count">
        {selectedImages.length}/50 photos selected
        {selectedImages.length < 20 && ` (minimum 20 required)`}
      </p>

      <div className="source-tabs">
        {['device', 'google', 'facebook'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'device' ? 'Device' : tab === 'google' ? 'Google Photos' : 'Facebook'}
          </button>
        ))}
      </div>

      {activeTab === 'device' && (
        <div className="upload-container">
          <div className="file-drop-area">
            <div className="drop-icon">📷</div>
            <p>Drag & drop photos here or</p>
            <label className="file-select-button">
              Browse Files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
            <p className="file-format-hint">Accepts JPG, PNG, HEIC</p>
          </div>
        </div>
      )}

      {isLoading && <p className="loading-text">Processing images...</p>}

      <div className="images-grid">
        {uploadedImages.map((image) => (
          <div
            key={image.id}
            className={`image-item ${selectedImages.some((img) => img.id === image.id) ? 'selected' : ''}`}
            onClick={() => toggleImageSelection(image)}
            tabIndex={0} // Keyboard accessibility
            role="button"
            aria-label="Select image"
          >
            <img src={image.preview} alt="Uploaded" />
            {selectedImages.some((img) => img.id === image.id) && (
              <div className="selection-indicator">✓</div>
            )}
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button
          className="secondary-button"
          onClick={() => {
            goToStep('landing');
            navigate('/photo-books');
          }}
        >
          Back
        </button>
        <button
          className="primary-button"
          onClick={handleContinue}
          disabled={selectedImages.length < 20}
        >
          Continue to Arrange
        </button>
      </div>
    </div>
  );
}

export default ImageSelection;