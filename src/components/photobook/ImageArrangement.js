// src/components/photobook/ImageArrangement.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { usePhotoBook } from '../../hooks/usePhotoBook';

function ImageArrangement() {
  const navigate = useNavigate();
  const { 
    selectedImages, 
    coverImageIndex, 
    setCoverImage,
    reorderImages,
    goToStep 
  } = usePhotoBook();
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(selectedImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
  
    let newCoverIndex = coverImageIndex;
  
    if (result.source.index === coverImageIndex) {
      newCoverIndex = result.destination.index;
    } else if (result.destination.index <= coverImageIndex && result.source.index > coverImageIndex) {
      newCoverIndex = coverImageIndex - 1;
    } else if (result.destination.index >= coverImageIndex && result.source.index < coverImageIndex) {
      newCoverIndex = coverImageIndex + 1;
    }
  
    // Preserve cover image metadata (title, crop position, font)
    if (result.source.index === coverImageIndex) {
      items[result.destination.index] = {
        ...items[result.destination.index],
        coverCropPosition: selectedImages[coverImageIndex].coverCropPosition,
        coverFont: selectedImages[coverImageIndex].coverFont,
        coverTitle: selectedImages[coverImageIndex].coverTitle,
      };
    }
  
    reorderImages(items);
    setCoverImage(newCoverIndex);
  };
  
  
  const handleSetAsCover = (index) => {
    setCoverImage(index);
  };
  
  const handleAutoArrange = () => {
    const sorted = [...selectedImages].sort((a, b) => {
      return a.file.lastModified - b.file.lastModified; // Sort by most recent image
    });
  
    reorderImages(sorted);
    setCoverImage(0);
  };
  
  
  const handleContinue = () => {
    goToStep('customization');
    navigate('/photo-books/customize');
  };
  
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    
    // Adjust cover index if needed
    let newCoverIndex = coverImageIndex;
    if (index === coverImageIndex) {
      newCoverIndex = 0; // Default to first image if cover was removed
    } else if (index < coverImageIndex) {
      newCoverIndex = coverImageIndex - 1;
    }
    
    reorderImages(newImages);
    setCoverImage(newCoverIndex);
  };
  
  return (
    <div className="image-arrangement">
      <h2>Arrange Your Photos</h2>
      <p className="arrangement-instructions">
        Drag and drop photos to rearrange. The first photo will be your book cover.
      </p>
      
      <div className="auto-arrange">
        <button 
          className="secondary-button"
          onClick={handleAutoArrange}
        >
          Auto-Arrange
        </button>
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div 
              className="images-sequence"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {selectedImages.map((image, index) => (
                <Draggable 
                  key={image.id} 
                  draggableId={image.id} 
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={`sequence-item ${index === coverImageIndex ? 'cover-image' : ''}`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="sequence-number">{index + 1}</div>
                      <img src={image.preview} alt={`Page ${index + 1}`} />
                      
                      <div className="image-actions">
                        {index !== coverImageIndex && (
                          <button 
                            className="cover-button"
                            onClick={() => handleSetAsCover(index)}
                          >
                            Set as Cover
                          </button>
                        )}
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✖
                        </button>
                      </div>
                      
                      {index === coverImageIndex && (
                        <div className="cover-badge">Cover</div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <div className="action-buttons">
        <button 
          className="secondary-button"
          onClick={() => {
            goToStep('selection');
            navigate('/photo-books/select');
          }}
        >
          Back
        </button>
        <button 
          className="primary-button"
          onClick={handleContinue}
        >
          Continue to Customize
        </button>
      </div>
    </div>
  );
}

export default ImageArrangement;