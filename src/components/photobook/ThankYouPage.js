// src/components/photobook/ThankYouPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBook } from '../../hooks/usePhotoBook';

function ThankYouPage() {
  const navigate = useNavigate();
  const { goToStep } = usePhotoBook();
  
  const handleCreateNew = () => {
    // Reset the entire photo book state
    window.localStorage.removeItem('photoBookState');
    
    // Navigate back to landing
    goToStep('landing');
    navigate('/photo-books');
  };
  
  return (
    <div className="thank-you-page">
      <div className="thank-you-content">
        <div className="success-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p className="confirmation-message">
          Your photo book has been successfully ordered and will be delivered within 7-10 business days.
        </p>
        <p className="email-message">
          A confirmation email has been sent to your inbox with all the order details.
        </p>
        
        <div className="order-number">
          <p>Order #: {Math.floor(Math.random() * 1000000)}</p>
        </div>
        
        <div className="action-buttons">
          <button 
            className="primary-button"
            onClick={handleCreateNew}
          >
            Create Another Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;