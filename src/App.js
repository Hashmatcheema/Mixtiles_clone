import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import { PhotoBookProvider } from './context/PhotoBookContext';

// Import page components
import HomePage from './pages/HomePage';
import Header from './components/Header'; 
import CheckoutPanel from './components/CheckoutPanel';
import PlaygroundPage from './pages/PlaygroundPage'; 


function App() {
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartAmount, setCartAmount] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toggle checkout panel
  const toggleCheckout = () => {
    setIsCheckoutOpen(!isCheckoutOpen);
  };
  
  // Close checkout panel
  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // Handle image upload
  const handleImagesUploaded = (newImages) => {
    setGalleryImages([...galleryImages, ...newImages]);
  };

  // Handle image selection
  const handleSelectImage = (image) => {
    setSelectedImage(image);
  };

  // Handle reordering of images
  const handleReorderImages = (reorderedImages) => {
    setGalleryImages(reorderedImages);
  };

  // Handle image customization
  const handleSaveCustomization = (imageId, customization) => {
    const updatedImages = galleryImages.map(image => 
      image.id === imageId 
        ? { ...image, customization } 
        : image
    );
    setGalleryImages(updatedImages);
    setSelectedImage(null);
  };
  
  // Handle order completion
  const handleOrderComplete = () => {
    setOrderCompleted(true);
    setIsCheckoutOpen(false);
  };

  // Reset app state for new order
  const resetApp = () => {
    setGalleryImages([]);
    setSelectedImage(null);
    setOrderCompleted(false);
  };

  // Update cart amount when images change
  useEffect(() => {
    let amount = 0;
    galleryImages.forEach(image => {
      amount += 25; // $25 per tile
    });
    setCartAmount(amount.toFixed(0));
  }, [galleryImages]);

  return (
    <PhotoBookProvider>
      <BrowserRouter>
        <AppWithRouter 
          galleryImages={galleryImages}
          selectedImage={selectedImage}
          cartAmount={cartAmount}
          isCheckoutOpen={isCheckoutOpen}
          onToggleCheckout={toggleCheckout}
          onCloseCheckout={closeCheckout}
          onImagesUploaded={handleImagesUploaded}
          onSelectImage={handleSelectImage}
          onReorderImages={handleReorderImages}
          onSaveCustomization={handleSaveCustomization}
          onOrderComplete={handleOrderComplete}
          onReset={resetApp}
        />
      </BrowserRouter>
    </PhotoBookProvider>
  );
}

function AppWithRouter({
  galleryImages,
  selectedImage,
  cartAmount,
  isCheckoutOpen,
  onToggleCheckout,
  onCloseCheckout,
  onImagesUploaded,
  onSelectImage,
  onReorderImages,
  onSaveCustomization,
  onOrderComplete,
  onReset
}) {
  const navigate = useNavigate();
  
  const handleOrderComplete = () => {
    onOrderComplete();
    navigate('/thank-you');
  };

  const createPlaceholderUrl = (width, height, text) => {
    return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
  };
  
  const placeholderImage = createPlaceholderUrl(300, 300, 'Sample+Image');

  return (
    <div className="app">
      <Header cartAmount={cartAmount} onCartClick={onToggleCheckout} />
      
      <CheckoutPanel 
        isOpen={isCheckoutOpen} 
        onClose={onCloseCheckout} 
        galleryImages={galleryImages}
        onComplete={handleOrderComplete}
      />
      
      <Routes>
        <Route path="/" element={<HomePage />} />
       
        <Route path="/playground" element={
          <PlaygroundPage galleryImages={galleryImages} />
          } />
      </Routes>
    </div>
  );
}

export default App;
