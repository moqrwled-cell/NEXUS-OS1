export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { licenseKey } = req.body;

  if (!licenseKey) {
    return res.status(400).json({ error: 'License key is required' });
  }

  try {
    // Whop API endpoint for validating a license key
    const response = await fetch(`https://api.whop.com/api/v2/memberships/${licenseKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_WHOP_API_KEY}`,
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
