// src/components/photobook/PagesOverview.js
import React from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './PagesOverview.css';

function PagesOverview({ 
  isOpen, 
  onClose, 
  images, 
  onImagesReordered 
}) {
  if (!isOpen) return null;

  // Handle drag end event
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    // Clone images array
    const reorderedImages = Array.from(images);
    // Remove dragged item
    const [removed] = reorderedImages.splice(result.source.index, 1);
    // Insert at new position
    reorderedImages.splice(result.destination.index, 0, removed);
    
    // Send back reordered images
    onImagesReordered(reorderedImages);
  };

  return (
    <div className="pages-overview-container">
      <div className="pages-overview">
        <h2 className="overview-title">Pages Overview</h2>
        <p className="overview-subtitle">Drag a photo to rearrange</p>
        
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="pages" direction="vertical">
            {(provided) => (
              <div 
                className="pages-content"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {/* Cover page (page 1) */}
                <div className="page-group">
                  <div className="page-number">1</div>
                  <div className="page-items">
                    <Draggable 
                      draggableId="cover-page" 
                      index={0}
                    >
                      {(provided) => (
                        <div
                          className="page-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {images.length > 0 ? (
                            <img 
                              src={typeof images[0] === 'object' ? images[0].preview : images[0]} 
                              alt="Cover"
                              className="page-thumbnail"
                            />
                          ) : (
                            <div className="empty-thumbnail pattern"></div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  </div>
                </div>
                
                {/* Content pages in groups of 2 */}
                {Array.from({ length: Math.ceil((images.length - 1) / 2) }).map((_, idx) => {
                  const pageNumStart = idx * 2 + 2; // Starting from page 2
                  const leftImageIndex = idx * 2 + 1; // Skip cover (index 0)
                  const rightImageIndex = idx * 2 + 2;
                  
                  return (
                    <div className="page-group" key={`group-${idx}`}>
                      <div className="page-number">{pageNumStart}-{pageNumStart + 1}</div>
                      <div className="page-items">
                        {/* Left page */}
                        <Draggable 
                          draggableId={`page-${leftImageIndex}`} 
                          index={leftImageIndex}
                        >
                          {(provided) => (
                            <div
                              className="page-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {leftImageIndex < images.length ? (
                                <img 
                                  src={typeof images[leftImageIndex] === 'object' ? 
                                    images[leftImageIndex].preview : images[leftImageIndex]} 
                                  alt={`Page ${pageNumStart}`}
                                  className="page-thumbnail"
                                />
                              ) : (
                                <div className="empty-thumbnail"></div>
                              )}
                            </div>
                          )}
                        </Draggable>
                        
                        {/* Right page */}
                        <Draggable 
                          draggableId={`page-${rightImageIndex}`} 
                          index={rightImageIndex}
                        >
                          {(provided) => (
                            <div
                              className="page-item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              {rightImageIndex < images.length ? (
                                <img 
                                  src={typeof images[rightImageIndex] === 'object' ? 
                                    images[rightImageIndex].preview : images[rightImageIndex]} 
                                  alt={`Page ${pageNumStart + 1}`}
                                  className="page-thumbnail"
                                />
                              ) : (
                                <div className="empty-thumbnail"></div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      </div>
                    </div>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        
        <button className="done-button" onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  );
}

PagesOverview.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  images: PropTypes.array.isRequired,
  onImagesReordered: PropTypes.func.isRequired
};

export default PagesOverview;