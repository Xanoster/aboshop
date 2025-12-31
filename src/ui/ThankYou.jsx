"use client";

import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../context/SubscriptionContext';

function ThankYou() {
  const router = useRouter();
  const { state, reset, setCurrentStep } = useSubscription();

  useEffect(() => {
    setCurrentStep(7);
    
    // Redirect if order is not complete
    if (!state.orderComplete) {
      router.push('/');
    }
  }, [router, setCurrentStep, state.orderComplete]);

  const handleStartOver = () => {
    reset();
    router.push('/');
  };

  const getEditionName = () => {
    return state.deliveryInfo.availableEditions.find(
      e => e.id === state.configuration.edition
    )?.name || 'Standard';
  };

  // Use the stored order id to keep SSR/CSR consistent
  const orderNumber = useMemo(() => {
    if (state.orderId) return state.orderId;
    // Fallback is deterministic to avoid hydration mismatch
    const emailSeed = state.customer?.email || 'pending';
    return `ABO-${emailSeed.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 8) || 'PENDING'}-DEMO`;
  }, [state.orderId, state.customer?.email]);

  return (
    <div className="thankyou-page">
      <div className="thankyou-container">
        <div className="thankyou-card">
          <div className="success-animation">
            <div className="checkmark-circle">
              <div className="checkmark"></div>
            </div>
          </div>
          
          <h1 className="thankyou-title">Thank You for Your Order!</h1>
          <p className="thankyou-subtitle">
            Your subscription has been successfully created.
          </p>
          
          <div className="order-confirmation">
            <div className="order-number">
              <span className="order-number-label">Order Number</span>
              <span className="order-number-value">{orderNumber}</span>
            </div>
            
            <p className="confirmation-email">
              A confirmation email has been sent to <strong>{state.customer?.email}</strong>
            </p>
          </div>
          
          <div className="order-details">
            <h3>Order Details</h3>
            
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-icon">📰</span>
                <div className="detail-content">
                  <span className="detail-label">Subscription</span>
                  <span className="detail-value">
                    {getEditionName()} - {state.configuration.subscriptionType}
                  </span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📅</span>
                <div className="detail-content">
                  <span className="detail-label">First Delivery</span>
                  <span className="detail-value">{state.configuration.startDate}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">📍</span>
                <div className="detail-content">
                  <span className="detail-label">Delivery Address</span>
                  <span className="detail-value">
                    {state.deliveryAddress.street} {state.deliveryAddress.houseNumber}
                    {state.deliveryAddress.street2 ? `, ${state.deliveryAddress.street2}` : ''},
                    {' '}{state.deliveryAddress.plz} {state.deliveryAddress.city}
                  </span>
                </div>
              </div>
              
              <div className="detail-item">
                <span className="detail-icon">💰</span>
                <div className="detail-content">
                  <span className="detail-label">Payment</span>
                  <span className="detail-value">
                    €{state.pricing.total?.toFixed(2)} / {state.configuration.paymentInterval === 'Annual' ? 'year' : 'month'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="next-steps">
            <h3>What Happens Next?</h3>
            <div className="steps-timeline">
              <div className="timeline-step">
                <div className="step-marker">1</div>
                <div className="step-content">
                  <span className="step-title">Confirmation Email</span>
                  <span className="step-desc">
                    You'll receive a confirmation email with all the details shortly.
                  </span>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-marker">2</div>
                <div className="step-content">
                  <span className="step-title">Delivery Setup</span>
                  <span className="step-desc">
                    {state.deliveryInfo.method === 'Local Agent' 
                      ? 'Your local delivery agent will be notified.'
                      : 'Your subscription will be delivered via postal service.'}
                  </span>
                </div>
              </div>
              
              <div className="timeline-step">
                <div className="step-marker">3</div>
                <div className="step-content">
                  <span className="step-title">First Delivery</span>
                  <span className="step-desc">
                    Your first newspaper will arrive on {state.configuration.startDate}.
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="thankyou-actions">
            <a 
              href="https://www.tagesschau.de" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Go to tagesschau.de
            </a>
            
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleStartOver}
            >
              Start New Subscription
            </button>
          </div>
          
          <div className="support-info">
            <p>
              Questions about your order? Contact our support team at{' '}
              <a href="mailto:support@tagesschau-zeitung.de">support@tagesschau-zeitung.de</a>
              {' '}or call <a href="tel:+4908001234567">0800 123 4567</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
