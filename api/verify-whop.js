// In-memory sliding-window rate limiter per client IP
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count += 1;
  }
  rateLimitMap.set(ip, record);

  // Periodic cleanup
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  return record.count > MAX_REQUESTS_PER_WINDOW;
}

export default async function handler(req, res) {
  // Enforce security headers on response
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate Limiting Check
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute before retrying.' });
  }

  const { licenseKey } = req.body || {};

  if (!licenseKey || typeof licenseKey !== 'string') {
    return res.status(400).json({ error: 'License key is required and must be a string' });
  }

  const sanitizedKey = licenseKey.trim();
  if (sanitizedKey.length === 0 || sanitizedKey.length > 128) {
    return res.status(400).json({ error: 'Invalid license key length' });
  }

  const apiKey = process.env.WHOP_API_KEY || process.env.VITE_WHOP_API_KEY;
  if (!apiKey) {
    console.error('WHOP_API_KEY is not configured on server.');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // Whop API endpoint for validating a license key
    const response = await fetch(`https://api.whop.com/api/v2/memberships/${encodeURIComponent(sanitizedKey)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const data = await response.json();

    // Check if the response indicates a valid membership
    if (response.ok && data.id && data.status === 'active') {
      return res.status(200).json({ 
        valid: true, 
        message: 'License verified successfully',
        membership: {
          id: data.id,
          product: data.product?.name,
          email: data.user?.email
        }
      });
    } else {
      return res.status(403).json({ 
        valid: false, 
        error: 'Invalid or inactive license key' 
      });
    }

  } catch (error) {
    console.error('Whop Verification Error:', error);
    return res.status(500).json({ 
      valid: false, 
      error: 'Server error while verifying license' 
    });
  }
}
