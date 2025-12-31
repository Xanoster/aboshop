import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import DeliveryAddress from './pages/DeliveryAddress';
import Configurator from './pages/Configurator';
import CheckoutBilling from './pages/CheckoutBilling';
import CheckoutPayment from './pages/CheckoutPayment';
import CheckoutReview from './pages/CheckoutReview';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/abokauf/zeitung/druckausgabe" element={<DeliveryAddress />} />
        <Route path="/abokauf/zeitung/druckausgabe/konfigurator" element={<Configurator />} />
        <Route path="/abokauf/zeitung/druckausgabe/checkout/billing" element={<CheckoutBilling />} />
        <Route path="/abokauf/zeitung/druckausgabe/checkout/payment" element={<CheckoutPayment />} />
        <Route path="/abokauf/zeitung/druckausgabe/checkout/review" element={<CheckoutReview />} />
        <Route path="/abokauf/zeitung/druckausgabe/thankyou" element={<ThankYou />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
