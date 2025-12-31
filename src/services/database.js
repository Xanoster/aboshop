/**
 * Database Module for AboShop
 * Contains mock data and helper functions for the subscription shop
 * Based on the provided _Database.js structure
 */

//*********************************/
// Database - Local Paper Versions
//*********************************/
const localpaperversions = {
  1: {
    id: 1,
    name: 'Stadtausgabe',
    description: 'City Edition - Local news from the city center',
    picture: '',
  },
  2: {
    id: 2,
    name: 'Sportversion',
    description: 'Sports Edition - Extended sports coverage',
    picture: '',
  },
  3: {
    id: 3,
    name: 'Landkreisinfos',
    description: 'County Edition - News from surrounding areas',
    picture: '',
  },
};

//*********************************/
// Database - Company Infos
//*********************************/
const pressCompanyInfos = {
  name: 'New Digital Media Power',
  plz: '72762',
  city: 'Reutlingen',
  employees: 346,
};

//*********************************/
// Database - Edition coverage per city (simplified mapping)
//*********************************/
const cityEditionMap = {
  Stuttgart: 1,
  Reutlingen: 1,
  Tübingen: 3,
  Esslingen: 1,
  Ulm: 2,
  München: 2,
  Berlin: 2,
  Hamburg: 2,
  Köln: 1,
  Frankfurt: 2,
  Dresden: 1,
  Leipzig: 1,
  Bremen: 2,
  Essen: 1,
  Dortmund: 1,
  Nürnberg: 1,
  Karlsruhe: 1,
  Lübeck: 1,
};

//*********************************/
// Database - PLZ to Coordinates (sample)
//*********************************/
const plzToCoordinates = {
  '70173': { zipcode: '70173', city: 'Stuttgart', latitude: 48.7758, longitude: 9.1829 },
  '72762': { zipcode: '72762', city: 'Reutlingen', latitude: 48.4921, longitude: 9.2144 },
  '72764': { zipcode: '72764', city: 'Reutlingen', latitude: 48.4833, longitude: 9.2167 },
  '72070': { zipcode: '72070', city: 'Tübingen', latitude: 48.5216, longitude: 9.0576 },
  '73728': { zipcode: '73728', city: 'Esslingen', latitude: 48.7406, longitude: 9.3108 },
  '89073': { zipcode: '89073', city: 'Ulm', latitude: 48.4011, longitude: 9.9876 },
  '80331': { zipcode: '80331', city: 'München', latitude: 48.1374, longitude: 11.5755 },
  '10115': { zipcode: '10115', city: 'Berlin', latitude: 52.5328, longitude: 13.3884 },
  '20095': { zipcode: '20095', city: 'Hamburg', latitude: 53.5511, longitude: 9.9937 },
  '50667': { zipcode: '50667', city: 'Köln', latitude: 50.9375, longitude: 6.9603 },
  '60311': { zipcode: '60311', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821 },
  '01067': { zipcode: '01067', city: 'Dresden', latitude: 51.0504, longitude: 13.7373 },
  '04109': { zipcode: '04109', city: 'Leipzig', latitude: 51.3397, longitude: 12.3731 },
  '28195': { zipcode: '28195', city: 'Bremen', latitude: 53.0793, longitude: 8.8017 },
  '45127': { zipcode: '45127', city: 'Essen', latitude: 51.4582, longitude: 7.0158 },
  '44135': { zipcode: '44135', city: 'Dortmund', latitude: 51.5136, longitude: 7.4653 },
  '90402': { zipcode: '90402', city: 'Nürnberg', latitude: 49.4521, longitude: 11.0767 },
  '04275': { zipcode: '04275', city: 'Leipzig', latitude: 51.3195, longitude: 12.3731 },
  '76133': { zipcode: '76133', city: 'Karlsruhe', latitude: 49.0069, longitude: 8.4037 },
  '23552': { zipcode: '23552', city: 'Lübeck', latitude: 53.8655, longitude: 10.6866 },
};

//*********************************/
// Database - Subscriptions
//*********************************/
let abos = {
  1: {
    id: 1,
    cid: 1,
    created: '10.05.2021',
    startabodate: '01.05.2021',
    endabodate: '01.05.2022',
    dataprivacyaccepted: true,
    abotype: 'Printed',
    deliverymethod: 'Post',
    paymenttype: 'Credit Card',
    payment: 'Annual',
    subscriptiontype: 'Daily',
    calculatedprice: 12.99,
    calculatedyearprice: 130.0,
    localpaperversions: 1,
  },
};

//*********************************/
// Database - Customers
//*********************************/
let customers = {
  1: {
    id: 1,
    firstname: 'Test',
    lastname: 'User',
    companyname: '',
    email: 'test@example.com',
    password: 'password123',
    salutation: 'Herr',
    firstName: 'Test',
    lastName: 'User',
    phone: '',
    deliveryAddress: {
      street: 'Musterstraße',
      houseNumber: '10',
      street2: '',
      city: 'Reutlingen',
      plz: '72762',
    },
    billingAddress: {
      street: 'Musterstraße',
      houseNumber: '10',
      street2: '',
      city: 'Reutlingen',
      plz: '72762',
    },
  },
};

//*********************************/
// Helper Functions
//*********************************/
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

//*********************************/
// Export Functions
//*********************************/

// 1. Distance Calculation
export function checkDatabaseDistance(plzDestination) {
  return new Promise((resolve) => {
    if (pressCompanyInfos.plz === plzDestination) {
      setTimeout(() => resolve({ distance: 0, plzDestination }), 100);
    } else {
      const companyCoord = plzToCoordinates[pressCompanyInfos.plz];
      const destinationCoord = plzToCoordinates[plzDestination];

      if (companyCoord && destinationCoord) {
        const distanceResult = getDistanceFromLatLonInKm(
          companyCoord.latitude,
          companyCoord.longitude,
          destinationCoord.latitude,
          destinationCoord.longitude
        );
        setTimeout(() => resolve({ distance: distanceResult, plzDestination }), 500);
      } else {
        // For unknown PLZ, calculate a default distance based on first digit
        const defaultDistance = parseInt(plzDestination.charAt(0), 10) * 50 + 100;
        setTimeout(() => resolve({ distance: defaultDistance, plzDestination }), 500);
      }
    }
  });
}

// 2. Customer Operations
export function saveCustomer(customerObj) {
  return new Promise((resolve) => {
    const isEmailUsed = Object.values(customers).find((c) => c.email === customerObj.email);
    if (isEmailUsed) {
      setTimeout(() => resolve({ success: false, message: 'Email already registered' }), 300);
    } else {
      const newId = Object.keys(customers).length + 1;
      const newCustomer = { ...customerObj, id: newId };
      customers = { ...customers, [newId]: newCustomer };
      setTimeout(() => resolve({ success: true, customer: newCustomer }), 300);
    }
  });
}

export function readCustomer(customerEmail) {
  return new Promise((resolve) => {
    const customer = Object.values(customers).find((c) => c.email === customerEmail);
    setTimeout(() => resolve(customer || null), 300);
  });
}

export function updateCustomer(customer) {
  return new Promise((resolve) => {
    customers[customer.id] = customer;
    setTimeout(() => resolve(true), 100);
  });
}

export function loginCustomer(email, password) {
  return new Promise((resolve) => {
    // Accept any credentials; create a customer record if one does not exist
    const existingCustomer = Object.values(customers).find((c) => c.email === email);

    if (existingCustomer) {
      setTimeout(() => resolve({ success: true, customer: existingCustomer }), 200);
      return;
    }

    const newId = Object.keys(customers).length + 1;
    const newCustomer = {
      id: newId,
      firstname: 'Demo',
      lastname: 'User',
      firstName: 'Demo',
      lastName: 'User',
      companyname: '',
      email,
      password,
      salutation: 'Herr',
      phone: '',
      deliveryAddress: {
        street: '',
        houseNumber: '',
        street2: '',
        city: '',
        plz: '',
      },
      billingAddress: {
        street: '',
        houseNumber: '',
        street2: '',
        city: '',
        plz: '',
      },
    };

    customers = { ...customers, [newId]: newCustomer };
    setTimeout(() => resolve({ success: true, customer: newCustomer }), 200);
  });
}

// 3. Subscription Operations
export function saveAbo(newAbo) {
  return new Promise((resolve) => {
    const newId = Object.values(abos).length + 1;
    const abo = { ...newAbo, id: newId };
    abos = { ...abos, [newId]: abo };
    setTimeout(() => resolve({ success: true, abo }), 300);
  });
}

// 4. Local Editions
export function getLocalVersionsForPlz(plz) {
  return new Promise((resolve) => {
    if (!plz) {
      resolve([]);
      return;
    }

    // MVP simplification: only offer two editions consistently
    const localversions = Object.values(localpaperversions).filter((v) => v.id !== 3);

    setTimeout(() => resolve(localversions), 400);
  });
}

// 5. Price Calculation
export function calculatePrice(config) {
  return new Promise((resolve) => {
    const { distance, subscriptionType, paymentInterval, edition, plz } = config;

    const getLocalEditionForPlz = () => {
      const city = plzToCoordinates[plz]?.city;
      return cityEditionMap[city] || 1;
    };

    const localEdition = getLocalEditionForPlz();

    // Base prices
    let baseMonthlyPrice = 29.99; // Base monthly price

    // Subscription type adjustment
    if (subscriptionType === 'Weekend') {
      baseMonthlyPrice = 14.99; // Weekend only is cheaper
    }

    // Edition adjustment
    if (edition === 2) {
      baseMonthlyPrice += 5.0; // Sports edition premium
    } else if (edition === 3) {
      baseMonthlyPrice += 2.0; // County edition slightly more
    }

    // Distance and edition coverage adjustment (delivery cost)
    let deliveryFee = 0;
    let deliveryMethod = 'Local Agent';

    const requiresPost = distance > 50 || (edition && edition !== localEdition);

    if (requiresPost) {
      deliveryMethod = 'Post';
      if (distance <= 100) {
        deliveryFee = 3.0;
      } else if (distance <= 300) {
        deliveryFee = 5.0;
      } else if (distance <= 500) {
        deliveryFee = 8.0;
      } else {
        deliveryFee = 15.0; // Far distance
      }
    }

    const monthlyPrice = baseMonthlyPrice + deliveryFee;
    let yearlyPrice = monthlyPrice * 12;

    // Yearly discount (10% off)
    if (paymentInterval === 'Annual') {
      yearlyPrice = yearlyPrice * 0.9;
    }

    const result = {
      monthlyPrice: parseFloat(monthlyPrice.toFixed(2)),
      yearlyPrice: parseFloat(yearlyPrice.toFixed(2)),
      deliveryMethod,
      deliveryFee: parseFloat(deliveryFee.toFixed(2)),
      discount: paymentInterval === 'Annual' ? '10%' : '0%',
      deliveryMethod,
    };

    setTimeout(() => resolve(result), 300);
  });
}

// 6. Get PLZ Info
export function getPLZInfo(plz) {
  return new Promise((resolve) => {
    const info = plzToCoordinates[plz];
    setTimeout(() => resolve(info || { zipcode: plz, city: 'Unknown' }), 200);
  });
}

// 8. Confirmation Email (simulated)
export function sendConfirmationEmail(abo, customerEmail) {
  return new Promise((resolve) => {
    const emailPayload = {
      to: customerEmail,
      subject: 'Ihre Zeitungsbestellung - Bestätigung',
      body: `Danke für Ihre Bestellung. Abo-ID: ${abo?.id || 'pending'}.`,
    };

    // Simulate email transport delay
    setTimeout(() => {
      // eslint-disable-next-line no-console
      console.log('Mock email sent', emailPayload);
      resolve({ sent: true, payload: emailPayload });
    }, 300);
  });
}

export default {
  checkDatabaseDistance,
  saveCustomer,
  readCustomer,
  updateCustomer,
  loginCustomer,
  saveAbo,
  getLocalVersionsForPlz,
  calculatePrice,
  getPLZInfo,
  sendConfirmationEmail,
};
