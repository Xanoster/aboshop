import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import ProgressSteps from '../components/ProgressSteps';
import './Checkout.css';

function CheckoutBilling() {
  const navigate = useNavigate();
  const { state, setBillingAddress, copyDeliveryToBilling, setCurrentStep } = useSubscription();
  
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [formData, setFormData] = useState({
    salutation: state.billingAddress.salutation || state.customer?.salutation || 'Herr',
    firstName: state.billingAddress.firstName || state.customer?.firstName || '',
    lastName: state.billingAddress.lastName || state.customer?.lastName || '',
    company: state.billingAddress.company || '',
    street: state.billingAddress.street || '',
    houseNumber: state.billingAddress.houseNumber || '',
    plz: state.billingAddress.plz || '',
    city: state.billingAddress.city || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCurrentStep(3);
    
    // Redirect if no customer logged in
    if (!state.customer) {
      navigate('/abokauf/zeitung/druckausgabe/konfigurator');
    }
  }, [setCurrentStep, state.customer, navigate]);

  useEffect(() => {
    if (sameAsDelivery) {
      setFormData({
        salutation: state.customer?.salutation || 'Herr',
        firstName: state.customer?.firstName || '',
        lastName: state.customer?.lastName || '',
        company: '',
        street: state.deliveryAddress.street,
        houseNumber: state.deliveryAddress.houseNumber,
        plz: state.deliveryAddress.plz,
        city: state.deliveryAddress.city,
      });
    }
  }, [sameAsDelivery, state.deliveryAddress, state.customer]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!sameAsDelivery) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      if (!formData.street.trim()) {
        newErrors.street = 'Street is required';
      }
      if (!formData.houseNumber.trim()) {
        newErrors.houseNumber = 'House number is required';
      }
      if (!formData.plz.trim()) {
        newErrors.plz = 'PLZ is required';
      } else if (!/^\d{5}$/.test(formData.plz)) {
        newErrors.plz = 'PLZ must be 5 digits';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (sameAsDelivery) {
      copyDeliveryToBilling();
    } else {
      setBillingAddress(formData);
    }
    
    navigate('/abokauf/zeitung/druckausgabe/checkout/payment');
  };

  return (
    <div className="checkout-page">
      <ProgressSteps currentStep={4} />
      
      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-substeps">
            <div className="substep active">
              <span className="substep-number">1</span>
              <span className="substep-label">Billing</span>
            </div>
            <div className="substep-line"></div>
            <div className="substep">
              <span className="substep-number">2</span>
              <span className="substep-label">Payment</span>
            </div>
            <div className="substep-line"></div>
            <div className="substep">
              <span className="substep-number">3</span>
              <span className="substep-label">Review</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Billing Address</h1>
              <p className="card-subtitle">
                Enter the address for your invoice.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="sameAsDelivery"
                  checked={sameAsDelivery}
                  onChange={(e) => setSameAsDelivery(e.target.checked)}
                />
                <label htmlFor="sameAsDelivery">
                  Same as delivery address
                </label>
              </div>
              
              {sameAsDelivery ? (
                <div className="address-preview">
                  <div className="preview-icon">📍</div>
                  <div className="preview-content">
                    <p className="preview-name">
                      {state.customer?.salutation} {state.customer?.firstName} {state.customer?.lastName}
                    </p>
                    <p className="preview-address">
                      {state.deliveryAddress.street} {state.deliveryAddress.houseNumber}
                    </p>
                    <p className="preview-city">
                      {state.deliveryAddress.plz} {state.deliveryAddress.city}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="billing-form">
                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 100px' }}>
                      <label htmlFor="salutation" className="form-label">
                        Salutation
                      </label>
                      <select
                        id="salutation"
                        value={formData.salutation}
                        onChange={(e) => handleChange('salutation', e.target.value)}
                        className="form-input"
                      >
                        <option value="Herr">Herr</option>
                        <option value="Frau">Frau</option>
                        <option value="Firma">Firma</option>
                      </select>
                    </div>
                    
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="firstName" className="form-label required">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        className={`form-input ${errors.firstName ? 'error' : ''}`}
                      />
                      {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                    </div>
                    
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="lastName" className="form-label required">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        className={`form-input ${errors.lastName ? 'error' : ''}`}
                      />
                      {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                    </div>
                  </div>
                  
                  {formData.salutation === 'Firma' && (
                    <div className="form-group">
                      <label htmlFor="company" className="form-label">
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleChange('company', e.target.value)}
                        className="form-input"
                      />
                    </div>
                  )}
                  
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 3 }}>
                      <label htmlFor="street" className="form-label required">
                        Street
                      </label>
                      <input
                        type="text"
                        id="street"
                        value={formData.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        className={`form-input ${errors.street ? 'error' : ''}`}
                      />
                      {errors.street && <span className="error-text">{errors.street}</span>}
                    </div>
                    
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="houseNumber" className="form-label required">
                        House No.
                      </label>
                      <input
                        type="text"
                        id="houseNumber"
                        value={formData.houseNumber}
                        onChange={(e) => handleChange('houseNumber', e.target.value)}
                        className={`form-input ${errors.houseNumber ? 'error' : ''}`}
                      />
                      {errors.houseNumber && <span className="error-text">{errors.houseNumber}</span>}
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label htmlFor="plz" className="form-label required">
                        PLZ
                      </label>
                      <input
                        type="text"
                        id="plz"
                        value={formData.plz}
                        onChange={(e) => handleChange('plz', e.target.value)}
                        className={`form-input ${errors.plz ? 'error' : ''}`}
                        maxLength={5}
                      />
                      {errors.plz && <span className="error-text">{errors.plz}</span>}
                    </div>
                    
                    <div className="form-group" style={{ flex: 2 }}>
                      <label htmlFor="city" className="form-label required">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        className={`form-input ${errors.city ? 'error' : ''}`}
                      />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="nav-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/abokauf/zeitung/druckausgabe/konfigurator')}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Continue to Payment →
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="summary-card">
            <h3>Order Summary</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span className="summary-label">Product</span>
                <span className="summary-value">Newspaper Subscription</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Edition</span>
                <span className="summary-value">
                  {state.deliveryInfo.availableEditions.find(
                    e => e.id === state.configuration.edition
                  )?.name || 'Standard'}
                </span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Type</span>
                <span className="summary-value">{state.configuration.subscriptionType}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Payment</span>
                <span className="summary-value">{state.configuration.paymentInterval}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Start Date</span>
                <span className="summary-value">{state.configuration.startDate}</span>
              </div>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">€{state.pricing.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutBilling;
