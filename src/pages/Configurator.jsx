import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionService, customerService } from '../services/api';
import ProgressSteps from '../components/ProgressSteps';
import './Configurator.css';

function Configurator() {
  const navigate = useNavigate();
  const { state, setConfiguration, setPricing, setCurrentStep, setLoading, setCustomer } = useSubscription();
  
  const subscriptionTypes = subscriptionService.getSubscriptionTypes();
  const paymentIntervals = subscriptionService.getPaymentIntervals();
  const minStartDate = subscriptionService.getMinStartDate();
  
  const [config, setConfig] = useState({
    edition: state.configuration.edition || (state.deliveryInfo.availableEditions[0]?.id || 1),
    subscriptionType: state.configuration.subscriptionType || 'Daily',
    paymentInterval: state.configuration.paymentInterval || 'Annual',
    startDate: state.configuration.startDate || formatDate(minStartDate),
    deliveryNotes: state.configuration.deliveryNotes || '',
  });
  
  const [pricing, setLocalPricing] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    setCurrentStep(2);
    
    // Redirect if no delivery info
    if (!state.deliveryAddress.plz) {
      navigate('/abokauf/zeitung/druckausgabe');
    }
  }, [setCurrentStep, state.deliveryAddress.plz, navigate]);

  // Calculate price whenever config changes
  useEffect(() => {
    const calculatePrice = async () => {
      setCalculating(true);
      try {
        const result = await subscriptionService.calculatePrice({
          distance: state.deliveryInfo.distance,
          subscriptionType: config.subscriptionType,
          paymentInterval: config.paymentInterval,
          edition: config.edition,
        });
        setLocalPricing(result);
      } catch (err) {
        console.error('Error calculating price:', err);
      }
      setCalculating(false);
    };
    
    calculatePrice();
  }, [config, state.deliveryInfo.distance]);

  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleConfigChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    
    // Save configuration
    setConfiguration(config);
    
    // Save pricing
    if (pricing) {
      setPricing({
        ...pricing,
        total: config.paymentInterval === 'Annual' ? pricing.yearlyPrice : pricing.monthlyPrice,
      });
    }

    // Auto-login with demo customer to skip authentication step
    try {
      const demoLogin = await customerService.login('test@example.com', 'password123');
      if (demoLogin?.success && demoLogin.customer) {
        setCustomer(demoLogin.customer);
      }
    } catch (err) {
      console.error('Demo login failed', err);
    }

    setLoading(false);
    navigate('/abokauf/zeitung/druckausgabe/checkout/billing');
  };

  const getEditionName = (editionId) => {
    const edition = state.deliveryInfo.availableEditions.find(e => e.id === editionId);
    return edition?.name || 'Standard Edition';
  };

  return (
    <div className="configurator-page">
      <ProgressSteps currentStep={2} />
      
      <div className="configurator-layout">
        <div className="configurator-main">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Configure Your Subscription</h1>
              <p className="card-subtitle">
                Choose your preferred options below. Your price will update automatically.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Delivery Info Banner */}
              <div className="delivery-info-banner">
                <div className="delivery-info-item">
                  <span className="delivery-info-icon">📍</span>
                  <div>
                    <span className="delivery-info-label">Delivery to</span>
                    <span className="delivery-info-value">
                      {state.deliveryAddress.plz} {state.deliveryAddress.city}
                    </span>
                  </div>
                </div>
                <div className="delivery-info-item">
                  <span className="delivery-info-icon">🚚</span>
                  <div>
                    <span className="delivery-info-label">Delivery Method</span>
                    <span className="delivery-info-value">{state.deliveryInfo.method}</span>
                  </div>
                </div>
                <div className="delivery-info-item">
                  <span className="delivery-info-icon">📏</span>
                  <div>
                    <span className="delivery-info-label">Distance</span>
                    <span className="delivery-info-value">
                      {state.deliveryInfo.distance.toFixed(1)} km
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Edition Selection */}
              <div className="config-section">
                <h3>Local Edition</h3>
                <div className="option-cards">
                  {state.deliveryInfo.availableEditions.map((edition) => (
                    <div
                      key={edition.id}
                      className={`option-card ${config.edition === edition.id ? 'selected' : ''}`}
                      onClick={() => handleConfigChange('edition', edition.id)}
                    >
                      <div className="option-card-icon">
                        {edition.id === 1 ? '🏙️' : edition.id === 2 ? '⚽' : '🏘️'}
                      </div>
                      <div className="option-card-title">{edition.name}</div>
                      <div className="option-card-description">{edition.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Subscription Type */}
              <div className="config-section">
                <h3>Subscription Type</h3>
                <div className="option-cards">
                  {subscriptionTypes.map((type) => (
                    <div
                      key={type.id}
                      className={`option-card ${config.subscriptionType === type.id ? 'selected' : ''}`}
                      onClick={() => handleConfigChange('subscriptionType', type.id)}
                    >
                      <div className="option-card-icon">
                        {type.id === 'Daily' ? '📅' : '🌅'}
                      </div>
                      <div className="option-card-title">{type.name}</div>
                      <div className="option-card-description">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Payment Interval */}
              <div className="config-section">
                <h3>Payment Interval</h3>
                <div className="option-cards">
                  {paymentIntervals.map((interval) => (
                    <div
                      key={interval.id}
                      className={`option-card ${config.paymentInterval === interval.id ? 'selected' : ''}`}
                      onClick={() => handleConfigChange('paymentInterval', interval.id)}
                    >
                      <div className="option-card-icon">
                        {interval.id === 'Monthly' ? '📆' : '🗓️'}
                      </div>
                      <div className="option-card-title">{interval.name}</div>
                      <div className="option-card-description">{interval.description}</div>
                      {interval.discount && (
                        <div className="option-card-badge">Save {interval.discount}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Start Date */}
              <div className="config-section">
                <h3>Start Date</h3>
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">
                    First Delivery Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={config.startDate}
                    onChange={(e) => handleConfigChange('startDate', e.target.value)}
                    min={formatDate(minStartDate)}
                    className="form-input"
                    style={{ maxWidth: '250px' }}
                  />
                  <p className="form-hint">
                    Subscriptions start at least 3 days from today.
                  </p>
                </div>
              </div>
              
              {/* Delivery Notes (only for local delivery) */}
              {state.deliveryInfo.method === 'Local Agent' && (
                <div className="config-section">
                  <h3>Delivery Notes (Optional)</h3>
                  <div className="form-group">
                    <label htmlFor="deliveryNotes" className="form-label">
                      Special Instructions
                    </label>
                    <textarea
                      id="deliveryNotes"
                      value={config.deliveryNotes}
                      onChange={(e) => handleConfigChange('deliveryNotes', e.target.value)}
                      className="form-input"
                      rows={3}
                      placeholder="e.g., Please place in mailbox, Behind the gate, etc."
                    />
                  </div>
                </div>
              )}
              
              <div className="nav-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/abokauf/zeitung/druckausgabe')}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={state.isLoading || calculating}
                >
                  Continue →
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Price Summary Sidebar */}
        <div className="configurator-sidebar">
          <div className="price-card">
            <h3>Price Summary</h3>
            {calculating ? (
              <div className="calculating">
                <span className="spinner"></span>
                <span>Calculating...</span>
              </div>
            ) : pricing ? (
              <>
                <div className="price-details">
                  <div className="price-row">
                    <span>Edition</span>
                    <span>{getEditionName(config.edition)}</span>
                  </div>
                  <div className="price-row">
                    <span>Type</span>
                    <span>{config.subscriptionType}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Method</span>
                    <span>{pricing.deliveryMethod}</span>
                  </div>
                  {pricing.deliveryFee > 0 && (
                    <div className="price-row">
                      <span>Delivery Fee</span>
                      <span>€{pricing.deliveryFee.toFixed(2)}/month</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>Monthly Price</span>
                    <span className="price-value">€{pricing.monthlyPrice.toFixed(2)}</span>
                  </div>
                  {config.paymentInterval === 'Annual' && (
                    <div className="price-row price-discount">
                      <span>Annual Discount</span>
                      <span>-{pricing.discount}</span>
                    </div>
                  )}
                </div>
                <div className="price-total">
                  <div className="price-row">
                    <span>
                      {config.paymentInterval === 'Annual' ? 'Yearly Total' : 'Monthly Total'}
                    </span>
                    <span className="price-value total">
                      €{config.paymentInterval === 'Annual' 
                        ? pricing.yearlyPrice.toFixed(2) 
                        : pricing.monthlyPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configurator;
