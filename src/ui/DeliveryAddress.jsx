"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../context/SubscriptionContext';
import { addressService } from '../services/api';
import ProgressSteps from '../components/ProgressSteps';

function DeliveryAddress() {
  const router = useRouter();
  const { state, setDeliveryAddress, setDeliveryInfo, setCurrentStep, setLoading, setError } = useSubscription();
  
  const [formData, setFormData] = useState({
    street: state.deliveryAddress.street || '',
    houseNumber: state.deliveryAddress.houseNumber || '',
    street2: state.deliveryAddress.street2 || '',
    plz: state.deliveryAddress.plz || '',
    city: state.deliveryAddress.city || '',
    country: state.deliveryAddress.country || 'Germany',
  });
  
  const [errors, setErrors] = useState({});
  const [cityLoading, setCityLoading] = useState(false);

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  // Auto-fill city when PLZ changes
  useEffect(() => {
    const fetchCity = async () => {
      if (formData.plz.length === 5) {
        setCityLoading(true);
        try {
          const plzInfo = await addressService.getPLZInfo(formData.plz);
          if (plzInfo && plzInfo.city) {
            setFormData(prev => ({ ...prev, city: plzInfo.city }));
          }
        } catch (err) {
          console.error('Error fetching city:', err);
        }
        setCityLoading(false);
      }
    };
    
    fetchCity();
  }, [formData.plz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.street.trim()) {
      newErrors.street = 'Street is required';
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = 'House number is required';
    }
    
    if (!formData.plz.trim()) {
      newErrors.plz = 'Postal code is required';
    } else if (!/^\d{5}$/.test(formData.plz)) {
      newErrors.plz = 'Please enter a valid 5-digit postal code';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Save delivery address
      setDeliveryAddress(formData);
      
      // Get distance and available editions
      const [distanceResult, editions] = await Promise.all([
        addressService.getDeliveryDistance(formData.plz),
        addressService.getAvailableEditions(formData.plz),
      ]);
      
      // Determine delivery method based on distance
      const deliveryMethod = distanceResult.distance > 50 ? 'Post' : 'Local Agent';
      
      // Save delivery info
      setDeliveryInfo({
        distance: distanceResult.distance,
        method: deliveryMethod,
        availableEditions: editions,
      });
      
      // Navigate to configurator
      router.push('/abokauf/zeitung/druckausgabe/konfigurator');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error:', err);
    }
    
    setLoading(false);
  };

  return (
    <div className="delivery-address-page">
      <ProgressSteps currentStep={1} />
      
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Delivery Address</h1>
          <p className="card-subtitle">
            Enter your delivery address to see available editions and pricing for your area.
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group" style={{ flex: 3 }}>
              <label htmlFor="street" className="form-label">
                Street *
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`form-input ${errors.street ? 'error' : ''}`}
                placeholder="e.g., Musterstraße"
              />
              {errors.street && <p className="form-error">{errors.street}</p>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
              <label htmlFor="houseNumber" className="form-label">
                House No. *
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className={`form-input ${errors.houseNumber ? 'error' : ''}`}
                placeholder="e.g., 123A"
              />
              {errors.houseNumber && <p className="form-error">{errors.houseNumber}</p>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="street2" className="form-label">
              Address Line 2 (Optional)
            </label>
            <input
              type="text"
              id="street2"
              name="street2"
              value={formData.street2}
              onChange={handleChange}
              className="form-input"
              placeholder="Apartment, suite, etc."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="plz" className="form-label">
                Postal Code *
              </label>
              <input
                type="text"
                id="plz"
                name="plz"
                value={formData.plz}
                onChange={handleChange}
                className={`form-input ${errors.plz ? 'error' : ''}`}
                placeholder="e.g., 72762"
                maxLength={5}
              />
              {errors.plz && <p className="form-error">{errors.plz}</p>}
            </div>
            
            <div className="form-group">
              <label htmlFor="city" className="form-label">
                City *
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`form-input ${errors.city ? 'error' : ''}`}
                placeholder={cityLoading ? 'Loading...' : 'e.g., Reutlingen'}
                disabled={cityLoading}
              />
              {errors.city && <p className="form-error">{errors.city}</p>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Germany">Germany</option>
              <option value="Austria">Austria</option>
              <option value="Switzerland">Switzerland</option>
            </select>
          </div>
          
          {state.error && (
            <div className="alert alert-error">
              {state.error}
            </div>
          )}
          
          <div className="nav-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => router.push('/')}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <>
                  <span className="spinner"></span>
                  Loading...
                </>
              ) : (
                'Continue →'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="info-box">
        <div className="info-box-icon">💡</div>
        <div className="info-box-content">
          <h4>Why do we need your address?</h4>
          <p>
            Your delivery address helps us determine which local editions are available
            in your area and calculate accurate delivery costs. Pricing varies based on
            whether local agent delivery or postal delivery is available.
          </p>
        </div>
      </div>
    </div>
  );
}

export default DeliveryAddress;
