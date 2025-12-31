import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Initial state for the subscription wizard
const initialState = {
  // Current step in the wizard
  currentStep: 1,
  
  // Step 1: Delivery Address
  deliveryAddress: {
    street1: '',
    street2: '',
    plz: '',
    city: '',
    country: 'Germany',
  },
  
  // Delivery info (calculated based on address)
  deliveryInfo: {
    distance: 0,
    method: 'Local Agent', // 'Local Agent' or 'Post'
    availableEditions: [],
  },
  
  // Step 2: Configuration
  configuration: {
    edition: null, // Local edition ID
    subscriptionType: 'Daily', // 'Daily' or 'Weekend'
    paymentInterval: 'Annual', // 'Monthly' or 'Annual'
    startDate: null,
    deliveryNotes: '',
  },
  
  // Pricing (calculated based on configuration)
  pricing: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    deliveryFee: 0,
    discount: '0%',
    total: 0,
  },
  
  // Customer info (auto-set via demo login)
  customer: null,
  
  // Step 4: Checkout - Billing Address
  billingAddress: {
    street1: '',
    street2: '',
    plz: '',
    city: '',
    country: 'Germany',
    sameAsDelivery: false,
  },
  
  // Step 5: Payment Method
  payment: {
    method: 'invoice', // 'invoice' or 'directDebit'
    // For Direct Debit
    iban: '',
    bic: '',
    accountHolder: '',
  },
  
  // Terms acceptance
  termsAccepted: false,
  
  // Order status
  orderComplete: false,
  orderId: null,
  
  // Loading and error states
  isLoading: false,
  error: null,
};

// Action types
const actionTypes = {
  SET_DELIVERY_ADDRESS: 'SET_DELIVERY_ADDRESS',
  SET_DELIVERY_INFO: 'SET_DELIVERY_INFO',
  SET_CONFIGURATION: 'SET_CONFIGURATION',
  SET_PRICING: 'SET_PRICING',
  SET_CUSTOMER: 'SET_CUSTOMER',
  SET_BILLING_ADDRESS: 'SET_BILLING_ADDRESS',
  SET_PAYMENT: 'SET_PAYMENT',
  SET_TERMS_ACCEPTED: 'SET_TERMS_ACCEPTED',
  SET_ORDER_COMPLETE: 'SET_ORDER_COMPLETE',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET: 'RESET',
};

// Reducer function
function subscriptionReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_DELIVERY_ADDRESS:
      return {
        ...state,
        deliveryAddress: { ...state.deliveryAddress, ...action.payload },
      };
    
    case actionTypes.SET_DELIVERY_INFO:
      return {
        ...state,
        deliveryInfo: { ...state.deliveryInfo, ...action.payload },
      };
    
    case actionTypes.SET_CONFIGURATION:
      return {
        ...state,
        configuration: { ...state.configuration, ...action.payload },
      };
    
    case actionTypes.SET_PRICING:
      return {
        ...state,
        pricing: { ...state.pricing, ...action.payload },
      };
    
    case actionTypes.SET_CUSTOMER:
      return {
        ...state,
        customer: action.payload,
      };
    
    case actionTypes.SET_BILLING_ADDRESS:
      return {
        ...state,
        billingAddress: { ...state.billingAddress, ...action.payload },
      };
    
    case actionTypes.SET_PAYMENT:
      return {
        ...state,
        payment: { ...state.payment, ...action.payload },
      };
    
    case actionTypes.SET_TERMS_ACCEPTED:
      return {
        ...state,
        termsAccepted: action.payload,
      };
    
    case actionTypes.SET_ORDER_COMPLETE:
      return {
        ...state,
        orderComplete: true,
        orderId: action.payload,
      };
    
    case actionTypes.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };
    
    case actionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case actionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    
    case actionTypes.RESET:
      return initialState;
    
    default:
      return state;
  }
}

// Create context
const SubscriptionContext = createContext(null);

// Provider component
export function SubscriptionProvider({ children }) {
  const [state, dispatch] = useReducer(subscriptionReducer, initialState);

  // Action creators
  const setDeliveryAddress = useCallback((address) => {
    dispatch({ type: actionTypes.SET_DELIVERY_ADDRESS, payload: address });
  }, []);

  const setDeliveryInfo = useCallback((info) => {
    dispatch({ type: actionTypes.SET_DELIVERY_INFO, payload: info });
  }, []);

  const setConfiguration = useCallback((config) => {
    dispatch({ type: actionTypes.SET_CONFIGURATION, payload: config });
  }, []);

  const setPricing = useCallback((pricing) => {
    dispatch({ type: actionTypes.SET_PRICING, payload: pricing });
  }, []);

  const setCustomer = useCallback((customer) => {
    dispatch({ type: actionTypes.SET_CUSTOMER, payload: customer });
  }, []);

  const setBillingAddress = useCallback((address) => {
    dispatch({ type: actionTypes.SET_BILLING_ADDRESS, payload: address });
  }, []);

  const setPayment = useCallback((payment) => {
    dispatch({ type: actionTypes.SET_PAYMENT, payload: payment });
  }, []);

  const setTermsAccepted = useCallback((accepted) => {
    dispatch({ type: actionTypes.SET_TERMS_ACCEPTED, payload: accepted });
  }, []);

  const setOrderComplete = useCallback((orderId) => {
    dispatch({ type: actionTypes.SET_ORDER_COMPLETE, payload: orderId });
  }, []);

  const setCurrentStep = useCallback((step) => {
    dispatch({ type: actionTypes.SET_CURRENT_STEP, payload: step });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: actionTypes.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: actionTypes.SET_ERROR, payload: error });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: actionTypes.RESET });
  }, []);

  // Copy delivery address to billing address
  const copyDeliveryToBilling = useCallback(() => {
    dispatch({
      type: actionTypes.SET_BILLING_ADDRESS,
      payload: {
        ...state.deliveryAddress,
        sameAsDelivery: true,
      },
    });
  }, [state.deliveryAddress]);

  const value = {
    state,
    setDeliveryAddress,
    setDeliveryInfo,
    setConfiguration,
    setPricing,
    setCustomer,
    setBillingAddress,
    setPayment,
    setTermsAccepted,
    setOrderComplete,
    setCurrentStep,
    setLoading,
    setError,
    reset,
    copyDeliveryToBilling,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// Custom hook to use the context
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}

export default SubscriptionContext;
