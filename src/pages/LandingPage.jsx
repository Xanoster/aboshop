import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  const handleOrderClick = () => {
    navigate('/abokauf/zeitung/druckausgabe');
  };

  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Subscribe to Your Daily Newspaper
          </h1>
          <p className="hero-subtitle">
            Stay informed with our premium printed newspaper delivered right to your doorstep.
            Choose from daily or weekend editions, with flexible payment options.
          </p>
          <div className="hero-features">
            <div className="feature">
              <span className="feature-icon">📰</span>
              <span>Printed Edition</span>
            </div>
            <div className="feature">
              <span className="feature-icon">🚚</span>
              <span>Daily Delivery</span>
            </div>
            <div className="feature">
              <span className="feature-icon">💰</span>
              <span>Save with Annual Plans</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" onClick={handleOrderClick}>
            Order Subscription
          </button>
        </div>
        <div className="hero-image">
          <div className="newspaper-preview">
            <div className="newspaper-header">
              <span className="newspaper-title">Daily News</span>
              <span className="newspaper-date">{new Date().toLocaleDateString('de-DE')}</span>
            </div>
            <div className="newspaper-content">
              <div className="newspaper-headline">Breaking News Headlines</div>
              <div className="newspaper-text"></div>
              <div className="newspaper-text short"></div>
              <div className="newspaper-text"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h2>Available Subscription Types</h2>
        <div className="subscription-types">
          <div className="subscription-type">
            <div className="subscription-icon">📅</div>
            <h3>Daily Delivery</h3>
            <p>Receive your newspaper every day from Monday to Saturday</p>
            <span className="subscription-price">From €29.99/month</span>
          </div>
          <div className="subscription-type">
            <div className="subscription-icon">🌅</div>
            <h3>Weekend Only</h3>
            <p>Perfect for weekend readers - Saturday and Sunday editions</p>
            <span className="subscription-price">From €14.99/month</span>
          </div>
          <div className="subscription-type featured">
            <div className="subscription-badge">Best Value</div>
            <div className="subscription-icon">⭐</div>
            <h3>Annual Plan</h3>
            <p>Save 10% with yearly payment - best value for regular readers</p>
            <span className="subscription-price">10% Discount</span>
          </div>
        </div>
      </div>

      <div className="editions-section">
        <h2>Local Editions Available</h2>
        <p className="section-subtitle">
          Choose from our local editions to get news that matters to your area
        </p>
        <div className="editions-grid">
          <div className="edition-card">
            <span className="edition-icon">🏙️</span>
            <h3>City Edition</h3>
            <p>Local news from your city center</p>
          </div>
          <div className="edition-card">
            <span className="edition-icon">⚽</span>
            <h3>Sports Edition</h3>
            <p>Extended sports coverage and analysis</p>
          </div>
          <div className="edition-card">
            <span className="edition-icon">🏘️</span>
            <h3>County Edition</h3>
            <p>News from surrounding areas</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Subscribe?</h2>
        <p>Start your subscription today and never miss the news again!</p>
        <button className="btn btn-primary btn-lg" onClick={handleOrderClick}>
          Start Subscription →
        </button>
      </div>
    </div>
  );
}

export default LandingPage;
