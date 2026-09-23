export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ valid: false, message: 'Method Not Allowed' });
  }

  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({ valid: false, message: 'License key is required' });
    }

    // Allow Admin Key for testing/developer access
    if (licenseKey === 'NEXUS-CEO-2026') {
      return res.status(200).json({ valid: true, message: 'Admin access granted' });
    }

    const whopApiKey = process.env.WHOP_API_KEY;
    if (!whopApiKey) {
      console.error('WHOP_API_KEY environment variable is missing.');
      return res.status(500).json({ valid: false, message: 'Server configuration error' });
    }

    // Call Whop API to validate the license
    const whopResponse = await fetch(`https://api.whop.com/api/v2/memberships/${licenseKey}/validate`, {
      method: 'POST',
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
