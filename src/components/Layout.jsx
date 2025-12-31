import React from 'react';
import './Layout.css';

function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="/" className="logo">
              <span className="logo-icon">📰</span>
              <span className="logo-text">AboShop</span>
            </a>
            <nav className="header-nav">
              <span className="header-tagline">Your Digital Newspaper Subscription</span>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>&copy; 2025 New Digital Media Power. All rights reserved.</p>
            <div className="footer-links">
              <a href="https://tagesschau.de" target="_blank" rel="noopener noreferrer">Homepage</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
