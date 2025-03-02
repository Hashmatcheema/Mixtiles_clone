// src/hooks/usePhotoBook.js
import { useContext } from 'react';
import { PhotoBookContext } from '../context/PhotoBookContext';

export const usePhotoBook = () => {
  const { state, dispatch } = useContext(PhotoBookContext);
  
  const selectImages = (images) => {
    dispatch({ type: 'SET_SELECTED_IMAGES', payload: images });
  };
  
  const setCoverImage = (index) => {
    dispatch({ type: 'SET_COVER_IMAGE', payload: index });
  };
  
  const setLayout = (layout) => {
    dispatch({ type: 'SET_LAYOUT', payload: layout });
  };
  
  const setBookSize = (size) => {
    dispatch({ type: 'SET_BOOK_SIZE', payload: size });
  };
  
  const setCoverType = (type) => {
    dispatch({ type: 'SET_COVER_TYPE', payload: type });
  };
  
  const setPaperQuality = (quality) => {
    dispatch({ type: 'SET_PAPER_QUALITY', payload: quality });
  };
  
  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };
  
  const updateCaption = (imageId, caption) => {
    dispatch({ 
      type: 'UPDATE_CAPTION', 
      payload: { imageId, caption } 
    });
  };
  
  const updateTextStyle = (imageId, style) => {
    dispatch({ 
      type: 'UPDATE_TEXT_STYLE', 
      payload: { imageId, style } 
    });
  };
  
  const goToStep = (step) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };
  
  const reorderImages = (newOrder) => {
    dispatch({ type: 'REORDER_IMAGES', payload: newOrder });
  };
  
  // NEW FUNCTIONS
  const updateImageZoom = (imageId, zoom) => {
    dispatch({ 
      type: 'UPDATE_IMAGE_ZOOM', 
      payload: { imageId, zoom } 
    });
  };
  
  const updateImagePosition = (imageId, position) => {
    dispatch({ 
      type: 'UPDATE_IMAGE_POSITION', 
      payload: { imageId, position } 
    });
  };
  
  // Helper function for cropping image to square (used in replaceImage)
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
  
  const replaceImage = async (imageId, file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const croppedPreview = await cropToSquare(e.target.result);
      
      const newImage = {
        ...state.selectedImages.find(img => img.id === imageId),
        file: file,
        preview: croppedPreview,
        originalPreview: e.target.result
      };
      
      dispatch({
        type: 'REPLACE_IMAGE',
        payload: {
          imageId,
          newImage
        }
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const deleteImage = (imageId) => {
    dispatch({ 
      type: 'DELETE_IMAGE', 
      payload: imageId 
    });
  };
  
  const calculatePrice = () => {
    // Base prices
    const basePrices = {
      small: 19.99,
      medium: 29.99,
      large: 39.99
    };
    
    // Price adjustments
    const coverAdjustment = state.coverType === 'hardcover' ? 10 : 0;
    const paperAdjustment = state.paperQuality === 'premium' ? 5 : 0;
    
    return basePrices[state.bookSize] + coverAdjustment + paperAdjustment;
  };
  
  return {
    // Existing state and functions
    selectedImages: state.selectedImages,
    coverImageIndex: state.coverImageIndex,
    layout: state.layout,
    bookSize: state.bookSize,
    coverType: state.coverType,
    paperQuality: state.paperQuality,
    theme: state.theme,
    captions: state.captions,
    textStyles: state.textStyles,
    currentStep: state.currentStep,
    
    // New state
    imageZoomLevels: state.imageZoomLevels,
    imagePositions: state.imagePositions,
    
    // Existing functions
    selectImages,
    setCoverImage,
    setLayout,
    setBookSize,
    setCoverType,
    setPaperQuality,
    setTheme,
    updateCaption,
    updateTextStyle,
    goToStep,
    reorderImages,
    calculatePrice,
    
    // New functions
    updateImageZoom,
    updateImagePosition,
    replaceImage,
    deleteImage
  };
};