import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
function ImageSlider() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  
  // Sample images for the slider
  const slides = [
    '/images/slider/slide1.jpg',
    '/images/slider/slide2.jpg',
    '/images/slider/slide3.jpg'
  ];
  
  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [slides.length]);
  
  const goToDesign = () => {
    // Change this to navigate to the photobook playground instead of upload
    navigate('/playground');
  };

  return (
    <div className="image-slider">
      <div className="slider-container" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
        {slides.map((slide, index) => (
          <div className="slide" key={index}>
            <img src={slide} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>
      
      <button className="design-button" onClick={goToDesign}>
        Design Photo Book
      </button>
      
      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index} 
            className={`dot ${activeSlide === index ? 'active' : ''}`}
            onClick={() => setActiveSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}


export default ImageSlider;
