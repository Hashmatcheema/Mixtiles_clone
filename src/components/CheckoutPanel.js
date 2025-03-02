// src/components/CheckoutPanel.js
import React from 'react';
import PropTypes from 'prop-types';
import './CheckoutPanel.css';

function CheckoutPanel({ isOpen, onClose, galleryImages, onComplete }) {
  // Make sure galleryImages is always an array even if undefined
  const images = galleryImages || [];
  const imageCount = images.length;
  
  // Calculate prices
  const pricePerTile = 25;
  const tileTotal = imageCount * pricePerTile;
  const minimumOrderFee = tileTotal < 50 ? 25 : 0;
  const total = tileTotal + minimumOrderFee;
  
  // Promotion logic
  const dealThreshold = 8;
  const dealPrice = 129;
  const tilesNeededForDeal = dealThreshold - imageCount;
  
  // This is just a placeholder function that doesn't do anything
  const handlePlaceOrder = () => {
    console.log("Place order button clicked, but no action taken");
    // We're not calling onComplete() here to make the button non-responsive
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="checkout-panel-overlay">
      <div className={`checkout-panel ${isOpen ? 'open' : ''}`}>
        <div className="checkout-panel-content">
          <div className="checkout-header">
            <h2>Checkout</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </div>
          
          <div className="checkout-sections">
            <div className="checkout-section">
              <div className="checkout-action-item">
                <div className="action-icon">🏠</div>
                <div className="action-text">Add Address</div>
              </div>
            </div>
            
            <div className="checkout-section">
              <div className="checkout-action-item">
                <div className="action-icon">💳</div>
                <div className="action-text">Add Payment Method</div>
              </div>
            </div>
            
            <div className="checkout-section promo-section">
              <div className="promo-tag">
                <div className="promo-icon">🏷️</div>
                <div className="promo-text">Promo: WELCOME</div>
              </div>
              <button className="change-button">Change</button>
            </div>
            
            <div className="checkout-section order-summary">
              <div className="summary-item">
                <div className="item-description">
                  {imageCount} tile{imageCount !== 1 ? 's' : ''}, 21×21 cm
                </div>
                <div className="item-price">US${tileTotal}</div>
              </div>
              
              {tilesNeededForDeal > 0 && (
                <div className="deal-notification">
                  <span className="deal-icon">🏷️</span>
                  <span>8 tiles for US$129. Add {tilesNeededForDeal} tile{tilesNeededForDeal !== 1 ? 's' : ''} to get the deal!</span>
                </div>
              )}
              
              {minimumOrderFee > 0 && (
                <div className="summary-item">
                  <div className="item-description">
                    <div>Minimum order fee</div>
                    <div className="fee-explanation">
                      The minimum order size is US$50, unfortunately we have to charge the difference
                    </div>
                  </div>
                  <div className="item-price">US${minimumOrderFee}</div>
                </div>
              )}
              
              <div className="summary-item">
                <div className="item-description">Shipping</div>
                <div className="item-price">Free</div>
              </div>
              
              <div className="summary-item total">
                <div className="item-description">Total</div>
                <div className="item-price">US${total}</div>
              </div>
            </div>
          </div>
          
          <button 
            className="place-order-button"
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}

CheckoutPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  galleryImages: PropTypes.array,
  onComplete: PropTypes.func
};

CheckoutPanel.defaultProps = {
  galleryImages: [],
  onComplete: () => {}
};

export default CheckoutPanel;