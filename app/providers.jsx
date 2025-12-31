"use client";

import React from 'react';
import { SubscriptionProvider } from '../src/context/SubscriptionContext';

export default function Providers({ children }) {
  return <SubscriptionProvider>{children}</SubscriptionProvider>;
}
