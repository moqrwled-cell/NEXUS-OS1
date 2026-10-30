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

  // Periodic cleanup to avoid memory leaks
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

  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, message: 'Method Not Allowed' });
  }

  // Rate Limiting Check
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ valid: false, message: 'Too many requests. Please wait a minute before retrying.' });
  }

  try {
    const { licenseKey } = req.body || {};

    // Input validation & sanitization
    if (!licenseKey || typeof licenseKey !== 'string') {
      return res.status(400).json({ valid: false, message: 'License key is required and must be a string' });
    }

    const sanitizedKey = licenseKey.trim();
    if (sanitizedKey.length === 0 || sanitizedKey.length > 128) {
      return res.status(400).json({ valid: false, message: 'Invalid license key length' });
    }

    const whopApiKey = process.env.WHOP_API_KEY || process.env.VITE_WHOP_API_KEY;
    if (!whopApiKey) {
      console.error('WHOP_API_KEY environment variable is missing.');
      return res.status(500).json({ valid: false, message: 'Server configuration error' });
    }

    // Call Whop API to validate the license
    const whopResponse = await fetch(`https://api.whop.com/api/v2/memberships/${encodeURIComponent(sanitizedKey)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${whopApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!whopResponse.ok) {
      return res.status(401).json({ valid: false, message: 'Invalid or expired license key' });
    }

    const data = await whopResponse.json();

    if (data.valid || data.status === 'active') {
      return res.status(200).json({ valid: true, message: 'License is valid' });
    } else {
      return res.status(401).json({ valid: false, message: 'License is no longer active' });
    }
  } catch (error) {
    console.error('Error validating license:', error);
    return res.status(500).json({ valid: false, message: 'Internal server error' });
  }
}
