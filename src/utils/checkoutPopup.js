/**
 * Nexus Seamless In-Page Checkout Pop-up Engine
 * Opens a focused, high-converting checkout modal window without sending 
 * the user away from the site, and listens for automated license activation.
 */

export const openSeamlessCheckout = (options = {}) => {
  const {
    onSuccess,
    productId = 'prod_ETdsHhJlU1fMM',
    toolName = 'contractcompare'
  } = options;

  const width = 520;
  const height = 760;
  const left = Math.max(0, Math.floor((window.screen.width - width) / 2));
  const top = Math.max(0, Math.floor((window.screen.height - height) / 2));

  const returnUrl = encodeURIComponent(`${window.location.origin}/welcome?redirect=${toolName}&status=success`);
  const checkoutUrl = `https://whop.com/checkout/${productId}?return_url=${returnUrl}`;

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
