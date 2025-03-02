// src/components/photobook/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePhotoBook } from '../../hooks/usePhotoBook';
import SizeSelectionPanel from '../selection-panels/SizeSelectionPanel';

function Checkout() {
  const navigate = useNavigate();
  const { 
    selectedImages,
    bookSize,
    coverType,
    paperQuality,
    setBookSize,
    setCoverType,
    setPaperQuality,
    calculatePrice,
    goToStep
  } = usePhotoBook();
  
  const [activePanelType, setActivePanelType] = useState(null);
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  
  const togglePanel = (panelType) => {
    if (activePanelType === panelType) {
      setActivePanelType(null);
    } else {
      setActivePanelType(panelType);
    }
  };
  
  const closeAllPanels = () => {
    setActivePanelType(null);
  };
  
  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME') {
      setDiscountApplied(true);
    } else {
      alert('Invalid discount code');
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send the order to your backend here
    console.log('Order submitted:', {
      photoBook: {
        images: selectedImages,
        bookSize,
        coverType,
        paperQuality
      },
      customerInfo,
      paymentMethod,
      totalPrice: calculateTotal()
    });
    
    // Navigate to thank you page
    goToStep('thankyou');
    navigate('/photo-books/thank-you');
  };
  
  const calculateTotal = () => {
    const basePrice = calculatePrice();
    const shippingCost = 4.99;
    const discount = discountApplied ? basePrice * 0.15 : 0;
    
    return (basePrice - discount + shippingCost).toFixed(2);
  };
  
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      
      <div className="checkout-columns">
        <div className="book-configuration">
          <h3>Book Configuration</h3>
          
          <div className="configuration-options">
            <div className="config-option">
              <label>Book Size</label>
              <div 
                className="option-selector"
                onClick={() => togglePanel('size')}
              >
                {bookSize === 'small' && '5"x5" Small'}
                {bookSize === 'medium' && '8"x8" Medium'}
                {bookSize === 'large' && '12"x12" Large'}
                <span className="selector-arrow">▼</span>
              </div>
            </div>
            
            <div className="config-option">
              <label>Cover Type</label>
              <div className="option-buttons">
                <button 
                  className={`option-button ${coverType === 'softcover' ? 'selected' : ''}`}
                  onClick={() => setCoverType('softcover')}
                >
                  Softcover
                </button>
                <button 
                  className={`option-button ${coverType === 'hardcover' ? 'selected' : ''}`}
                  onClick={() => setCoverType('hardcover')}
                >
                  Hardcover
                </button>
              </div>
            </div>
            
            <div className="config-option">
              <label>Paper Quality</label>
              <div className="option-buttons">
                <button 
                  className={`option-button ${paperQuality === 'standard' ? 'selected' : ''}`}
                  onClick={() => setPaperQuality('standard')}
                >
                  Standard
                </button>
                <button 
                  className={`option-button ${paperQuality === 'premium' ? 'selected' : ''}`}
                  onClick={() => setPaperQuality('premium')}
                >
                  Premium Matte
                </button>
              </div>
            </div>
          </div>
          
          <div className="price-summary">
            <h3>Order Summary</h3>
            <div className="price-item">
              <span>Photo Book ({selectedImages.length} photos)</span>
              <span>${calculatePrice().toFixed(2)}</span>
            </div>
            
            {discountApplied && (
              <div className="price-item discount">
                <span>Discount (15%)</span>
                <span>-${(calculatePrice() * 0.15).toFixed(2)}</span>
              </div>
            )}
            
            <div className="price-item">
              <span>Shipping</span>
              <span>$4.99</span>
            </div>
            
            <div className="price-total">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
            
            <div className="discount-code">
              <input 
                type="text" 
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
              <button onClick={handleApplyDiscount}>Apply</button>
            </div>
          </div>
        </div>
        
        <div className="shipping-payment">
          <h3>Shipping & Payment</h3>
          
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h4>Contact Information</h4>
              <div className="form-row">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h4>Shipping Address</h4>
              <div className="form-row">
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={customerInfo.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row form-row-split">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={customerInfo.city}
                  onChange={handleInputChange}
                  required
                />
                <input
                  type="text"
                  name="state"
                  placeholder="State/Province"
                  value={customerInfo.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-row form-row-split">
                <input
                  type="text"
                  name="zip"
                  placeholder="ZIP/Postal Code"
                  value={customerInfo.zip}
                  onChange={handleInputChange}
                  required
                />
                <select
                  name="country"
                  value={customerInfo.country}
                  onChange={handleInputChange}
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
            
            <div className="form-section">
              <h4>Payment Method</h4>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="credit"
                    name="payment"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                  />
                  <label htmlFor="credit">Credit Card</label>
                </div>
                <div className="payment-option">
                  <input
                    type="radio"
                    id="paypal"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              
              {paymentMethod === 'credit' && (
                <div className="credit-card-fields">
                  <div className="form-row">
                    <input
                      type="text"
                      placeholder="Card Number"
                      required
                    />
                  </div>
                  <div className="form-row form-row-split">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      required
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      required
                    />
                  </div>
                </div>
              )}
            </div>
            
            <div className="estimated-delivery">
              <div className="delivery-icon">🚚</div>
              <div className="delivery-text">
                <p>Estimated delivery:</p>
                <p className="delivery-date">7-10 business days</p>
              </div>
            </div>
            
            <div className="action-buttons">
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => {
                  goToStep('preview');
                  navigate('/photo-books/preview');
                }}
              >
                Back to Preview
              </button>
              <button 
                type="submit" 
                className="primary-button"
              >
                Place Order
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <SizeSelectionPanel
        isOpen={activePanelType === 'size'}
        onClose={closeAllPanels}
        currentSize={bookSize}
        onSelectSize={setBookSize}
      />
    </div>
  );
}

export default Checkout;