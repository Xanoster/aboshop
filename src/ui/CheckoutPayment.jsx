"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../context/SubscriptionContext';
import { subscriptionService } from '../services/api';
import ProgressSteps from '../components/ProgressSteps';

function CheckoutPayment() {
  const router = useRouter();
  const { state, setPayment, setCurrentStep } = useSubscription();
  
  const paymentMethods = subscriptionService.getPaymentMethods();
  
  const [selectedMethod, setSelectedMethod] = useState(
    state.payment.method || 'invoice'
  );
  const [bankDetails, setBankDetails] = useState({
    accountHolder: state.payment.accountHolder || '',
    iban: state.payment.iban || '',
    bic: state.payment.bic || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setCurrentStep(5);
    
    // Redirect if no billing address
    if (!state.billingAddress.plz) {
      router.push('/abokauf/zeitung/druckausgabe/checkout/billing');
    }
  }, [router, setCurrentStep, state.billingAddress.plz]);

  const validateIBAN = (iban) => {
    // Basic IBAN validation (simplified)
    const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
    return /^[A-Z]{2}[0-9]{2}[A-Z0-9]{10,30}$/.test(cleanIBAN);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (selectedMethod === 'directDebit') {
      if (!bankDetails.accountHolder.trim()) {
        newErrors.accountHolder = 'Account holder name is required';
      }
      if (!bankDetails.iban.trim()) {
        newErrors.iban = 'IBAN is required';
      } else if (!validateIBAN(bankDetails.iban)) {
        newErrors.iban = 'Please enter a valid IBAN';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBankDetailsChange = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatIBAN = (value) => {
    // Format IBAN with spaces every 4 characters
    const cleaned = value.replace(/\s/g, '').toUpperCase();
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const paymentData = {
      method: selectedMethod,
      ...(selectedMethod === 'directDebit' ? bankDetails : {}),
    };
    
    setPayment(paymentData);
    router.push('/abokauf/zeitung/druckausgabe/checkout/review');
  };

  const getMethodInfo = (methodId) => {
    return paymentMethods.find(m => m.id === methodId);
  };

  return (
    <div className="checkout-page">
      <ProgressSteps currentStep={5} />
      
      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-substeps">
            <div className="substep completed">
              <span className="substep-number">✓</span>
              <span className="substep-label">Billing</span>
            </div>
            <div className="substep-line"></div>
            <div className="substep active">
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
              <h1 className="card-title">Payment Method</h1>
              <p className="card-subtitle">
                Choose how you would like to pay for your subscription.
              </p>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="payment-methods">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`payment-method-card ${selectedMethod === method.id ? 'selected' : ''}`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="payment-method-radio">
                      <input
                        type="radio"
                        name="paymentMethod"
                        id={`payment-${method.id}`}
                        value={method.id}
                        checked={selectedMethod === method.id}
                        onChange={(e) => setSelectedMethod(e.target.value)}
                      />
                    </div>
                    <div className="payment-method-icon">{method.icon}</div>
                    <div className="payment-method-info">
                      <span className="payment-method-name">{method.name}</span>
                      <span className="payment-method-desc">{method.description}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Invoice Info */}
              {selectedMethod === 'invoice' && (
                <div className="payment-info-box">
                  <div className="payment-info-icon">📧</div>
                  <div className="payment-info-content">
                    <h4>Invoice Payment</h4>
                    <p>
                      You will receive an invoice via email at{' '}
                      <strong>{state.customer?.email}</strong> after your subscription starts.
                      Payment is due within 14 days.
                    </p>
                    <ul>
                      <li>Invoice sent via email</li>
                      <li>14 days payment term</li>
                      <li>Bank transfer or online banking</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Direct Debit Form */}
              {selectedMethod === 'directDebit' && (
                <div className="direct-debit-form">
                  <div className="payment-info-box compact">
                    <div className="payment-info-icon">🔒</div>
                    <div className="payment-info-content">
                      <p>
                        Your bank details are securely encrypted. The amount will be 
                        automatically debited from your account {state.configuration.paymentInterval === 'Monthly' ? 'monthly' : 'annually'}.
                      </p>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="accountHolder" className="form-label required">
                      Account Holder Name
                    </label>
                    <input
                      type="text"
                      id="accountHolder"
                      value={bankDetails.accountHolder}
                      onChange={(e) => handleBankDetailsChange('accountHolder', e.target.value)}
                      className={`form-input ${errors.accountHolder ? 'error' : ''}`}
                      placeholder="John Doe"
                    />
                    {errors.accountHolder && (
                      <span className="error-text">{errors.accountHolder}</span>
                    )}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="iban" className="form-label required">
                      IBAN
                    </label>
                    <input
                      type="text"
                      id="iban"
                      value={bankDetails.iban}
                      onChange={(e) => handleBankDetailsChange('iban', formatIBAN(e.target.value))}
                      className={`form-input ${errors.iban ? 'error' : ''}`}
                      placeholder="DE89 3704 0044 0532 0130 00"
                      maxLength={34}
                    />
                    {errors.iban && <span className="error-text">{errors.iban}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="bic" className="form-label">
                      BIC (Optional)
                    </label>
                    <input
                      type="text"
                      id="bic"
                      value={bankDetails.bic}
                      onChange={(e) => handleBankDetailsChange('bic', e.target.value.toUpperCase())}
                      className="form-input"
                      placeholder="COBADEFFXXX"
                      maxLength={11}
                    />
                    <p className="form-hint">BIC is usually auto-detected from IBAN</p>
                  </div>
                  
                  <div className="sepa-mandate">
                    <h4>SEPA Direct Debit Mandate</h4>
                    <p>
                      By providing your bank details and confirming this payment, you authorize 
                      Tagesschau Zeitung GmbH to send instructions to your bank to debit your 
                      account in accordance with those instructions. You are entitled to a refund 
                      from your bank under the terms and conditions of your agreement with your bank.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="nav-buttons">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => router.push('/abokauf/zeitung/druckausgabe/checkout/billing')}
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Continue to Review →
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

export default CheckoutPayment;
