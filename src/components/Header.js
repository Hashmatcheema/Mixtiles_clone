import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Define size options with prices
const sizeOptions = {
  small: { dimensions: '21x21 cm', price: 49 },
  medium: { dimensions: '25x25 cm', price: 79 },
  large: { dimensions: '32x32 cm', price: 99 }
};

// In your Header.js - ensure it receives the current book price
function Header({ bookSize = 'small', onCartClick }) {
  // Get the current price based on the selected book size
  const getCurrentPrice = () => {
    return sizeOptions[bookSize]?.price || 49;
  };

  return (
    <header className="site-header">
      <div className="header-container">
        <button className="menu-button" aria-label="Menu">
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
          <div className="hamburger-icon"></div>
        </button>
        
        <div className="logo">
  <Link to="/">
    <img src="\images\logo.jpg" alt="MIXTILES Logo" className="logo-img" />
  </Link>
</div>

        <button 
          className="cart-button" 
          onClick={onCartClick}
          aria-label="Cart"
        >
          <span className="cart-icon">🛒</span>
          <span className="cart-amount">US${getCurrentPrice()}</span>
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  bookSize: PropTypes.string,
  onCartClick: PropTypes.func
};

Header.defaultProps = {
  bookSize: 'small',
  onCartClick: () => {}
};

export default Header;
