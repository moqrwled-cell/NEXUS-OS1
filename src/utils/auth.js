// A simple client-side security utility to prevent URL-hopping and basic tampering.
// It encodes the license and allowed tool into a single token.

const SECRET_SALT = "NEXUS_ENTERPRISE_2026_SECURE";

export const grantToolAccess = (licenseKey, toolName) => {
  // We encode the toolName to prevent casual console tampering
  const payload = btoa(`${licenseKey}:${toolName}:${SECRET_SALT}`);
  localStorage.setItem('nexus_access_token', payload);
  localStorage.setItem('nexus_license', licenseKey); // keep for backward compatibility
};

export const verifyToolAccess = (toolName) => {
  const token = localStorage.getItem('nexus_access_token');
  const ceoKey = localStorage.getItem('nexus_license');

  // CEO Backdoor - Always allow
  if (ceoKey === "NEXUS-CEO-2026") return true;

  if (!token) return false;

  try {
    const decoded = atob(token);
    const [license, allowedTool, salt] = decoded.split(':');
    
    // Check if the token was tampered with and if it matches the current tool
    if (salt === SECRET_SALT && allowedTool === toolName) {
      return true;
    }
    return false;
  } catch (e) {
    return false; // Invalid token format
  }
};

export const logout = () => {
  localStorage.removeItem('nexus_access_token');
  localStorage.removeItem('nexus_license');
};
