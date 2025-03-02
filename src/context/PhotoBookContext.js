// src/context/PhotoBookContext.js
import React, { createContext, useReducer, useEffect } from 'react';

export const PhotoBookContext = createContext();

const initialState = {
  selectedImages: [],
  coverImageIndex: 0,
  layout: 'single', // 'single', 'collage', or 'grid'
  bookSize: 'medium', // 'small', 'medium', or 'large'
  coverType: 'softcover', // 'softcover' or 'hardcover'
  paperQuality: 'standard', // 'standard' or 'premium'
  theme: 'white', // 'white', 'black', or other themes
  captions: {}, // Map of image IDs to captions
  textStyles: {}, // Map of image IDs to text styles
  imageZoomLevels: {}, // NEW: Map of image IDs to zoom levels
  imagePositions: {}, // NEW: Map of image IDs to positions (x, y percentages)
  currentStep: 'landing' // 'landing', 'selection', 'arrangement', 'customization', 'preview', 'checkout'
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_IMAGES':
      return {
        ...state,
        selectedImages: action.payload,
        coverImageIndex: state.coverImageIndex || 0
      };
    case 'SET_COVER_IMAGE':
      return {
        ...state,
        coverImageIndex: action.payload
      };
    case 'SET_LAYOUT':
      return {
        ...state,
        layout: action.payload
      };
    case 'SET_BOOK_SIZE':
      return {
        ...state,
        bookSize: action.payload
      };
    case 'SET_COVER_TYPE':
      return {
        ...state,
        coverType: action.payload
      };
    case 'SET_PAPER_QUALITY':
      return {
        ...state,
        paperQuality: action.payload
      };
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload
      };
    case 'UPDATE_CAPTION':
      return {
        ...state,
        captions: {
          ...state.captions,
          [action.payload.imageId]: action.payload.caption
        }
      };
    case 'UPDATE_TEXT_STYLE':
      return {
        ...state,
        textStyles: {
          ...state.textStyles,
          [action.payload.imageId]: action.payload.style
        }
      };
    case 'SET_CURRENT_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
    case 'REORDER_IMAGES':
      return {
        ...state,
        selectedImages: action.payload
      };
    // NEW ACTION TYPES
    case 'UPDATE_IMAGE_ZOOM':
      return {
        ...state,
        imageZoomLevels: {
          ...state.imageZoomLevels,
          [action.payload.imageId]: action.payload.zoom
        }
      };
    case 'UPDATE_IMAGE_POSITION':
      return {
        ...state,
        imagePositions: {
          ...state.imagePositions,
          [action.payload.imageId]: action.payload.position
        }
      };
    case 'REPLACE_IMAGE':
      return {
        ...state,
        selectedImages: state.selectedImages.map(img => 
          img.id === action.payload.imageId ? action.payload.newImage : img
        )
      };
    case 'DELETE_IMAGE':
      const deletedIndex = state.selectedImages.findIndex(img => img.id === action.payload);
      
      if (deletedIndex === -1) return state;
      
      let newImages = [...state.selectedImages];
      newImages.splice(deletedIndex, 1);
      
      // Handle empty book edge case
      if (newImages.length === 0) {
        return {
          ...state,
          selectedImages: [],
          coverImageIndex: 0
        };
      }
      
      // Adjust cover index if needed
      let newCoverIndex = state.coverImageIndex;
      if (deletedIndex === state.coverImageIndex) {
        newCoverIndex = 0; // Default to first image if cover was removed
      } else if (deletedIndex < state.coverImageIndex) {
        newCoverIndex = state.coverImageIndex - 1;
      }
      
      return {
        ...state,
        selectedImages: newImages,
        coverImageIndex: newCoverIndex
      };
    default:
      return state;
  }
}

export const PhotoBookProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // Load state from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem('photoBookState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        Object.keys(parsedState).forEach(key => {
          if (key in initialState) { // Only load keys that exist in initialState
            dispatch({ type: `SET_${key.toUpperCase()}`, payload: parsedState[key] });
          }
        });
      } catch (error) {
        console.error('Error loading saved photo book state:', error);
      }
    }
  }, []);
  
  // Save state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('photoBookState', JSON.stringify(state));
  }, [state]);
  
  return (
    <PhotoBookContext.Provider value={{ state, dispatch }}>
      {children}
    </PhotoBookContext.Provider>
  );
};