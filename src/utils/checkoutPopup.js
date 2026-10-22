/**
 * Nexus Seamless In-Page Checkout Pop-up Engine
 * Opens a focused, high-converting checkout modal window without sending 
 * the user away from the site, and listens for automated license activation.
 */

import { WHOP_CONFIG } from '../config/whopConfig.js';

export const openSeamlessCheckout = (options = {}) => {
  // Support string argument format: openSeamlessCheckout('firm') or openSeamlessCheckout('solo')
  const config = typeof options === 'string' ? { plan: options } : options;
  const plan = config.plan || 'solo';
  
  const targetProduct = WHOP_CONFIG[plan] || WHOP_CONFIG.solo;
  const productId = config.productId || targetProduct.productId;
  const toolName = config.toolName || 'contractcompare';
  const onSuccess = config.onSuccess;

  const width = 520;
  const height = 760;
  const left = Math.max(0, Math.floor((window.screen.width - width) / 2));
  const top = Math.max(0, Math.floor((window.screen.height - height) / 2));
  const sessionNonce = `whop_sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const checkoutTicket = {
    sessionId: sessionNonce,
    plan,
    productId,
    createdAt: Date.now()
  };
  
  // Persist session ticket to verify genuine purchase completion
  try {
    sessionStorage.setItem('nexus_pending_checkout', JSON.stringify(checkoutTicket));
    localStorage.setItem('nexus_pending_checkout', JSON.stringify(checkoutTicket));
  } catch {
    // Ignore storage errors in restricted contexts
  }

  const returnUrl = encodeURIComponent(`${window.location.origin}/welcome?plan=${plan}&redirect=${toolName}&status=success&session_id=${sessionNonce}&whop=1`);
  const targetUrl = targetProduct?.url || `https://whop.com/checkout/${productId}`;
  const checkoutUrl = targetUrl.includes('?') 
    ? `${targetUrl}&return_url=${returnUrl}&redirect_url=${returnUrl}` 
    : `${targetUrl}?return_url=${returnUrl}&redirect_url=${returnUrl}`;

  // Open centered popup window
  const popup = window.open(
    checkoutUrl,
    'NexusSecureCheckout',
    `width=${width},height=${height},top=${top},left=${left},resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no`
  );

  // Message listener from /welcome window
  const handleMessage = (event) => {
    if (event.data && event.data.type === 'NEXUS_LICENSE_ACTIVATED') {
      window.removeEventListener('message', handleMessage);
      clearInterval(storagePoller);
      if (onSuccess) onSuccess(event.data);
    }
  };

  window.addEventListener('message', handleMessage);

  // Fallback Poller for localStorage changes
  const storagePoller = setInterval(() => {
    const isVerified = localStorage.getItem('nexus_whop_verified') === 'true';
    const hasToken = !!localStorage.getItem('nexus_access_token');
    
    if (isVerified || hasToken) {
      clearInterval(storagePoller);
      window.removeEventListener('message', handleMessage);
      if (onSuccess) onSuccess();
    }

    if (popup && popup.closed) {
      clearInterval(storagePoller);
    }
  }, 1000);

  return popup;
};
