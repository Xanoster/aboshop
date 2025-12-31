"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../context/SubscriptionContext';
import { customerService } from '../services/api';
import ProgressSteps from '../components/ProgressSteps';

function CheckoutLogin() {
  const router = useRouter();
  const { state, setCustomer, setCurrentStep, setError, setLoading } = useSubscription();

  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    salutation: 'Herr',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setCurrentStep(3);

    if (!state.deliveryAddress.plz) {
      router.push('/abokauf/zeitung/druckausgabe');
      return;
    }

    if (state.customer) {
      router.push('/abokauf/zeitung/druckausgabe/checkout/billing');
    }
  }, [router, setCurrentStep, state.customer, state.deliveryAddress.plz]);

  const handleLoginChange = (field, value) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRegisterChange = (field, value) => {
    setRegisterForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!loginForm.email.trim()) newErrors.email = 'Email is required';
    if (!loginForm.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};
    if (!registerForm.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!registerForm.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!registerForm.email.trim()) newErrors.email = 'Email is required';
    if (!registerForm.password.trim()) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const finishLogin = (customer) => {
    setCustomer(customer);
    router.push('/abokauf/zeitung/druckausgabe/checkout/billing');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const result = await customerService.login(loginForm.email, loginForm.password);
      if (result?.success && result.customer) {
        finishLogin(result.customer);
      } else {
        setErrors({ submit: result?.message || 'Invalid credentials' });
      }
    } catch (err) {
      setErrors({ submit: 'Login failed. Please try again.' });
    }

    setIsSubmitting(false);
    setLoading(false);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const payload = {
        salutation: registerForm.salutation,
        firstName: registerForm.firstName,
        lastName: registerForm.lastName,
        email: registerForm.email,
        password: registerForm.password,
      };
      const result = await customerService.register(payload);
      if (result?.success && result.customer) {
        finishLogin(result.customer);
      } else {
        setErrors({ submit: result?.message || 'Registration failed' });
      }
    } catch (err) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }

    setIsSubmitting(false);
    setLoading(false);
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    setLoading(true);
    setError(null);

    try {
      const demo = await customerService.login('test@example.com', 'password123');
      if (demo?.success && demo.customer) {
        finishLogin(demo.customer);
      } else {
        setErrors({ submit: 'Demo login unavailable right now.' });
      }
    } catch (err) {
      setErrors({ submit: 'Demo login failed.' });
    }

    setIsSubmitting(false);
    setLoading(false);
  };

  return (
    <div className="checkout-page">
      <ProgressSteps currentStep={3} />

      <div className="checkout-layout">
        <div className="checkout-main">
          <div className="checkout-substeps">
            <div className={`substep ${mode === 'login' ? 'active' : ''}`}>
              <span className="substep-number">1</span>
              <span className="substep-label">Login</span>
            </div>
            <div className="substep-line"></div>
            <div className={`substep ${mode === 'register' ? 'active' : ''}`}>
              <span className="substep-number">2</span>
              <span className="substep-label">Register</span>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Login or Register</h1>
              <p className="card-subtitle">
                Sign in to continue or create a quick account. You can also use our demo access.
              </p>
            </div>

            {errors.submit && (
              <div className="alert alert-error">{errors.submit}</div>
            )}

            <div className="tab-buttons">
              <button
                type="button"
                className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMode('login')}
              >
                I have an account
              </button>
              <button
                type="button"
                className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setMode('register')}
              >
                Create account
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={handleDemoLogin}
                disabled={isSubmitting}
              >
                Continue with demo user
              </button>
            </div>

            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="loginEmail" className="form-label required">Email</label>
                  <input
                    type="email"
                    id="loginEmail"
                    value={loginForm.email}
                    onChange={(e) => handleLoginChange('email', e.target.value)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="loginPassword" className="form-label required">Password</label>
                  <input
                    type="password"
                    id="loginPassword"
                    value={loginForm.password}
                    onChange={(e) => handleLoginChange('password', e.target.value)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="********"
                    autoComplete="current-password"
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="nav-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push('/abokauf/zeitung/druckausgabe/konfigurator')}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Signing in…' : 'Continue →'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="auth-form">
                <div className="form-row">
                  <div className="form-group" style={{ flex: '0 0 120px' }}>
                    <label htmlFor="regSalutation" className="form-label">Salutation</label>
                    <select
                      id="regSalutation"
                      value={registerForm.salutation}
                      onChange={(e) => handleRegisterChange('salutation', e.target.value)}
                      className="form-input"
                    >
                      <option value="Herr">Herr</option>
                      <option value="Frau">Frau</option>
                      <option value="Firma">Firma</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="regFirstName" className="form-label required">First Name</label>
                    <input
                      type="text"
                      id="regFirstName"
                      value={registerForm.firstName}
                      onChange={(e) => handleRegisterChange('firstName', e.target.value)}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      autoComplete="given-name"
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label htmlFor="regLastName" className="form-label required">Last Name</label>
                    <input
                      type="text"
                      id="regLastName"
                      value={registerForm.lastName}
                      onChange={(e) => handleRegisterChange('lastName', e.target.value)}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      autoComplete="family-name"
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="regEmail" className="form-label required">Email</label>
                  <input
                    type="email"
                    id="regEmail"
                    value={registerForm.email}
                    onChange={(e) => handleRegisterChange('email', e.target.value)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="regPassword" className="form-label required">Password</label>
                  <input
                    type="password"
                    id="regPassword"
                    value={registerForm.password}
                    onChange={(e) => handleRegisterChange('password', e.target.value)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    placeholder="********"
                    autoComplete="new-password"
                  />
                  {errors.password && <span className="error-text">{errors.password}</span>}
                </div>

                <div className="nav-buttons">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push('/abokauf/zeitung/druckausgabe/konfigurator')}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account…' : 'Continue →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="checkout-sidebar">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Why login?</h3>
              <p className="card-subtitle">
                We need your contact email to send order confirmations and invoices.
              </p>
            </div>
            <ul className="feature-list">
              <li>🔐 Secure access to your subscription</li>
              <li>✉️ Confirmation email after checkout</li>
              <li>🧾 View invoices and billing info</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutLogin;
