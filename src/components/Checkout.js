import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Checkout({ images, onComplete }) {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
    paymentMethod: 'credit'
  });
  
  // In Checkout.js - Update the form submission handler
const handleSubmit = (e) => {
  e.preventDefault();
  // Log the order but don't navigate
  console.log('Order submitted:', {
    photoBook: { /* order details */ },
    customerInfo,
    paymentMethod,
    totalPrice: calculateTotal()
  });
  
  // Show confirmation instead of navigating
  alert("Thank you for your order!");
  
  // Close the checkout panel if needed
  onClose();
  
  // Optionally reset form fields
  // setCustomerInfo({ /* reset to initial state */ });
  // setPaymentMethod('credit');
};
  
  // Calculate the total price based on the images and their customizations
  const calculateTotal = () => {
    let total = 0;
    
    images.forEach(image => {
      // Base price for each photo
      let price = 9.99;
      
      // Add extra cost for fancy frames
      if (image.customization) {
        if (image.customization.frameStyle === 'elegant') price += 5;
        if (image.customization.frameStyle === 'vintage') price += 3;
        
        // Add extra cost for larger sizes
        if (image.customization.frameSize === 'large') price += 3;
      }
      
      total += price;
    });
    
    return total.toFixed(2);
  };

  // Add prop validation
Checkout.propTypes = {
  images: PropTypes.array.isRequired,
  onComplete: PropTypes.func.isRequired
};

// Add default props
Checkout.defaultProps = {
  images: []
};

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        <p>Total Items: {images.length}</p>
        <p>Subtotal: ${calculateTotal()}</p>
        <p>Shipping: $5.99</p>
        <p className="total-price">
          Total: ${(parseFloat(calculateTotal()) + 5.99).toFixed(2)}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerInfo.email}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Shipping Address:</label>
          <textarea
            id="address"
            name="address"
            value={customerInfo.address}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method:</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={customerInfo.paymentMethod}
            onChange={handleInputChange}
          >
            <option value="credit">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>
        
        <button type="submit" className="place-order-button">
          Place Order
        </button>
      </form>
    </div>
  );
}

export default Checkout;