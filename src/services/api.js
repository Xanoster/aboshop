/**
 * API Service Layer for AboShop
 * Provides a clean interface between the UI and the database/backend
 */

import db from './database';

/**
 * Address & Delivery Services
 */
export const addressService = {
  /**
   * Get distance from company headquarters to delivery address
   * @param {string} plz - Postal code
   * @returns {Promise<{distance: number, plzDestination: string}>}
   */
  async getDeliveryDistance(plz) {
    return db.checkDatabaseDistance(plz);
  },

  /**
   * Get available local editions for a postal code
   * @param {string} plz - Postal code
   * @returns {Promise<Array>}
   */
  async getAvailableEditions(plz) {
    return db.getLocalVersionsForPlz(plz);
  },

  /**
   * Get postal code information (city name, etc.)
   * @param {string} plz - Postal code
   * @returns {Promise<Object>}
   */
  async getPLZInfo(plz) {
    return db.getPLZInfo(plz);
  },
};

/**
 * Customer Services (Simulated SSO)
 */
export const customerService = {
  /**
   * Register a new customer
   * @param {Object} customerData - Customer registration data
   * @returns {Promise<{success: boolean, customer?: Object}>}
   */
  async register(customerData) {
    const result = await db.saveCustomer(customerData);
    return result;
  },

  /**
   * Login customer with email and password
   * @param {string} email
   * @param {string} password
   * @returns {Promise<Object|null>}
   */
  async login(email, password) {
    return db.loginCustomer(email, password);
  },

  /**
   * Get customer by email
   * @param {string} email
   * @returns {Promise<Object|null>}
   */
  async getByEmail(email) {
    return db.readCustomer(email);
  },

  /**
   * Update customer data
   * @param {Object} customer
   * @returns {Promise<boolean>}
   */
  async update(customer) {
    return db.updateCustomer(customer);
  },
};

/**
 * Subscription Services
 */
export const subscriptionService = {
  /**
   * Calculate subscription price based on configuration
   * @param {Object} config - Subscription configuration
   * @returns {Promise<Object>}
   */
  async calculatePrice(config) {
    return db.calculatePrice(config);
  },

  /**
   * Create a new subscription
   * @param {Object} subscriptionData
   * @returns {Promise<{success: boolean, abo?: Object}>}
   */
  async create(subscriptionData) {
    return db.saveAbo(subscriptionData);
  },

  /**
   * Get subscription by ID
   * @param {number} aboId
   * @returns {Promise<Object|null>}
   */
  async getById(aboId) {
    return db.readAbo(aboId);
  },

  /**
   * Get all subscriptions for a customer
   * @param {number} customerId
   * @returns {Promise<Array>}
   */
  async getByCustomerId(customerId) {
    return db.getAllAbosForCustomer(customerId);
  },

  /**
   * Get available subscription types
   * @returns {Array}
   */
  getSubscriptionTypes() {
    return [
      { id: 'Daily', name: 'Daily Delivery', description: 'Newspaper delivered every day (Mon-Sat)' },
      { id: 'Weekend', name: 'Weekend Only', description: 'Newspaper delivered on weekends only (Sat-Sun)' },
    ];
  },

  /**
   * Get available payment intervals
   * @returns {Array}
   */
  getPaymentIntervals() {
    return [
      { id: 'Monthly', name: 'Monthly', description: 'Pay every month', discount: null },
      { id: 'Annual', name: 'Yearly', description: 'Pay once per year', discount: '10%' },
    ];
  },

  /**
   * Get available payment methods
   * @returns {Array}
   */
  getPaymentMethods() {
    return [
      { id: 'invoice', name: 'Invoice', description: 'Pay by invoice (bank transfer)', icon: '📄' },
      { id: 'directDebit', name: 'Direct Debit', description: 'Automatic bank debit (SEPA)', icon: '🏦' },
    ];
  },

  /**
   * Get minimum start date (subscriptions cannot start tomorrow)
   * @returns {Date}
   */
  getMinStartDate() {
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 3); // At least 3 days from now
    return minDate;
  },

  /**
   * Create a new subscription
   * @param {Object} subscriptionData
   * @returns {Promise<{success: boolean, abo?: Object}>}
   */
  async createSubscription(subscriptionData) {
    const result = await db.saveAbo(subscriptionData);
    if (result?.success) {
      try {
        const emailResult = await db.sendConfirmationEmail(
          result.abo,
          subscriptionData.customerEmail
        );
        return { ...result, emailSent: !!emailResult?.sent };
      } catch (err) {
        return { ...result, emailSent: false };
      }
    }

    return result;
  },
};

/**
 * Company Services
 */
export const companyService = {
  /**
   * Get company information
   * @returns {Promise<Object>}
   */
  async getInfo() {
    return db.getCompanyInfo();
  },
};

export default {
  addressService,
  customerService,
  subscriptionService,
  companyService,
};
