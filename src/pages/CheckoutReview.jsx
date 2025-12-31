import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionService } from '../services/api';
import ProgressSteps from '../components/ProgressSteps';
import './Checkout.css';
import './CheckoutReview.css';

function CheckoutReview() {
  const navigate = useNavigate();
  const { 
    state, 
    setTermsAccepted, 
    setOrderComplete, 
    setCurrentStep, 
    setLoading, 
    setError 
  } = useSubscription();
  
  const [termsChecked, setTermsChecked] = useState(state.termsAccepted);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [newsletterChecked, setNewsletterChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentStep(6);
    
    // Redirect if no payment method
    if (!state.payment.method) {
      navigate('/abokauf/zeitung/druckausgabe/checkout/payment');
    }
  }, [setCurrentStep, state.payment.method, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!termsChecked) {
      newErrors.terms = 'You must accept the Terms & Conditions';
    }
    
    if (!privacyChecked) {
      newErrors.privacy = 'You must accept the Privacy Policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setLoading(true);
    setError(null);
    
    try {
      // Create subscription
      const subscriptionData = {
        customerId: state.customer.id,
        customerEmail: state.customer.email,
        deliveryAddress: state.deliveryAddress,
        billingAddress: state.billingAddress,
        configuration: state.configuration,
        pricing: state.pricing,
        payment: state.payment,
        newsletter: newsletterChecked,
      };
      
      const result = await subscriptionService.createSubscription(subscriptionData);
      
      if (result.success) {
        setTermsAccepted(true);
        setOrderComplete(true);
        navigate('/abokauf/zeitung/druckausgabe/thankyou');
      } else {
        setErrors({ submit: result.message || 'Failed to create subscription' });
      }
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    }
    
    setIsSubmitting(false);
    setLoading(false);
  };

  const getEditionName = () => {
    return state.deliveryInfo.availableEditions.find(
      e => e.id === state.configuration.edition
    )?.name || 'Standard';
  };

  const getPaymentMethodName = () => {
    return state.payment.method === 'directDebit' ? 'Direct Debit (SEPA)' : 'Invoice';
  };

  const formatAddress = (address) => {
    const streetLine = [address.street, address.houseNumber].filter(Boolean).join(' ');
    const extraLine = address.street2 ? `${address.street2}, ` : '';
    return `${streetLine}, ${extraLine}${address.plz} ${address.city}`;
  };

  return (
    <div className="checkout-page">
      <ProgressSteps currentStep={4} />
      
      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-substeps">
            <div className="substep completed">
              <span className="substep-number">✓</span>
              <span className="substep-label">Billing</span>
            </div>
            <div className="substep-line"></div>
            <div className="substep completed">
              <span className="substep-number">✓</span>
              <span className="substep-label">Payment</span>
            </div>
            <div className="substep-line"></div>
            <div className="substep active">
              <span className="substep-number">3</span>
              <span className="substep-label">Review</span>
            </div>
          </div>
          
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Review Your Order</h1>
              <p className="card-subtitle">
                Please review your subscription details before confirming.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              {errors.submit && (
                <div className="alert alert-error">
                  {errors.submit}
                </div>
              )}
              
              {/* Subscription Details */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>📰 Subscription Details</h3>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => navigate('/abokauf/zeitung/druckausgabe/konfigurator')}
                  >
                    Edit
                  </button>
                </div>
                <div className="review-grid">
                  <div className="review-item">
                    <span className="review-label">Edition</span>
                    <span className="review-value">{getEditionName()}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Type</span>
                    <span className="review-value">{state.configuration.subscriptionType}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Payment Interval</span>
                    <span className="review-value">{state.configuration.paymentInterval}</span>
                  </div>
                  <div className="review-item">
                    <span className="review-label">Start Date</span>
                    <span className="review-value">{state.configuration.startDate}</span>
                  </div>
                </div>
              </div>
              
              {/* Delivery Address */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>📍 Delivery Address</h3>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => navigate('/abokauf/zeitung/druckausgabe')}
                  >
                    Edit
                  </button>
                </div>
                <div className="review-address">
                  <p>{formatAddress(state.deliveryAddress)}</p>
                  <p className="delivery-method-badge">
                    🚚 {state.deliveryInfo.method}
                  </p>
                  {state.configuration.deliveryNotes && (
                    <p className="delivery-notes">
                      <em>Notes: {state.configuration.deliveryNotes}</em>
                    </p>
                  )}
                </div>
              </div>
              
              {/* Billing Address */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>🧾 Billing Address</h3>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => navigate('/abokauf/zeitung/druckausgabe/checkout/billing')}
                  >
                    Edit
                  </button>
                </div>
                <div className="review-address">
                  <p>
                    {state.billingAddress.salutation} {state.billingAddress.firstName} {state.billingAddress.lastName}
                  </p>
                  <p>{formatAddress(state.billingAddress)}</p>
                </div>
              </div>
              
              {/* Payment Method */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>💳 Payment Method</h3>
                  <button
                    type="button"
                    className="btn-edit"
                    onClick={() => navigate('/abokauf/zeitung/druckausgabe/checkout/payment')}
                  >
                    Edit
                  </button>
                </div>
                <div className="review-payment">
                  <p className="payment-method-badge">
                    {state.payment.method === 'directDebit' ? '🏦' : '📧'} {getPaymentMethodName()}
                  </p>
                  {state.payment.method === 'directDebit' && (
                    <p className="payment-details">
                      Account: {state.payment.accountHolder}<br />
                      IBAN: {state.payment.iban.replace(/(.{4})/g, '$1 ').slice(0, -1).replace(/\s+(\S+)$/, ' ****')}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="review-section">
                <div className="review-section-header">
                  <h3>👤 Contact Information</h3>
                </div>
                <div className="review-contact">
                  <p>
                    <strong>{state.customer?.firstName} {state.customer?.lastName}</strong>
                  </p>
                  <p>{state.customer?.email}</p>
                  {state.customer?.phone && <p>{state.customer?.phone}</p>}
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div className="review-terms">
                <div className={`checkbox-row ${errors.terms ? 'error' : ''}`}>
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsChecked}
                    onChange={(e) => {
                      setTermsChecked(e.target.checked);
                      if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                    }}
                  />
                  <label htmlFor="terms">
                    I accept the <a href="#" target="_blank">Terms & Conditions</a> and 
                    the <a href="#" target="_blank">Cancellation Policy</a>. *
                  </label>
                </div>
                {errors.terms && <span className="error-text">{errors.terms}</span>}
                
                <div className={`checkbox-row ${errors.privacy ? 'error' : ''}`}>
                  <input
                    type="checkbox"
                    id="privacy"
                    checked={privacyChecked}
                    onChange={(e) => {
                      setPrivacyChecked(e.target.checked);
                      if (errors.privacy) setErrors(prev => ({ ...prev, privacy: '' }));
                    }}
                  />
                  <label htmlFor="privacy">
                    I accept the <a href="#" target="_blank">Privacy Policy</a>. *
                  </label>
                </div>
                {errors.privacy && <span className="error-text">{errors.privacy}</span>}
                
                <div className="checkbox-row optional">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={newsletterChecked}
                    onChange={(e) => setNewsletterChecked(e.target.checked)}
                  />
                  <label htmlFor="newsletter">
                    Yes, I would like to receive the newsletter with exclusive offers and news.
                  </label>
                </div>
              </div>
              
              <div className="nav-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/abokauf/zeitung/druckausgabe/checkout/payment')}
                  disabled={isSubmitting}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-large"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>Confirm Order - €{state.pricing.total?.toFixed(2) || '0.00'}</>
                  )}
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
                <span className="summary-value">{getEditionName()}</span>
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
              <div className="summary-row">
                <span className="summary-label">Delivery</span>
                <span className="summary-value">{state.deliveryInfo.method}</span>
              </div>
            </div>
            {state.pricing.discount && state.configuration.paymentInterval === 'Annual' && (
              <div className="summary-discount">
                <span>Annual Discount</span>
                <span className="discount-value">-{state.pricing.discount}</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">€{state.pricing.total?.toFixed(2) || '0.00'}</span>
            </div>
            <p className="summary-note">
              {state.configuration.paymentInterval === 'Annual' 
                ? 'Billed annually' 
                : 'Billed monthly'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutReview;
