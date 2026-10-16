/**
 * Whop Payment & Licensing Configuration
 * 
 * Replace these product IDs with your actual Whop Product or Plan IDs from:
 * https://whop.com/dashboard/products
 */
export const WHOP_CONFIG = {
  solo: {
    productId: 'prod_ETdsHhJlU1fMM', // Default / Replace with your real Solo Product ID ($199)
    name: 'ContractGuard Solo Practitioner (1 User)',
    price: 199,
    seats: 1
  },
  firm: {
    productId: 'prod_ETdsHhJlU1fMM', // Replace with your real Law Firm Suite Product ID ($299)
    name: 'ContractGuard Law Firm Suite (5 Users)',
    price: 299,
    seats: 5
  }
};
