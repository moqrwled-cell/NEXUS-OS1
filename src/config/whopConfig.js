/**
 * Whop Payment & Licensing Configuration
 * 
 * Replace these product IDs with your actual Whop Product or Plan IDs from:
 * https://whop.com/dashboard/products
 */
export const WHOP_CONFIG = {
  solo: {
    productId: 'prod_ETdsHhJlU1fMM',
    name: 'ContractGuard Solo Practitioner (1 User)',
    price: 199,
    seats: 1,
    url: 'https://whop.com/nexus-os-85c8/nexus-contractguard-solo-practitioner-lifetime-license'
  },
  firm: {
    productId: 'prod_ETdsHhJlU1fMM',
    name: 'ContractGuard Law Firm Suite (5 Users)',
    price: 299,
    seats: 5,
    url: 'https://whop.com/nexus-os-85c8/nexus-contractguard-law-firm-suite-5-attorney-seats-bundle'
  }
};
