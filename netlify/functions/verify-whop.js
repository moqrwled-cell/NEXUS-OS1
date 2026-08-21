export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { licenseKey } = JSON.parse(event.body);

    if (!licenseKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'License key is required' })
      };
    }

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
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          valid: true, 
          message: 'License verified successfully',
          membership: {
            id: data.id,
            product: data.product?.name,
            email: data.user?.email
          }
        })
      };
    } else {
      return {
        statusCode: 403,
        body: JSON.stringify({ 
          valid: false, 
          error: 'Invalid or inactive license key' 
        })
      };
    }
  } catch (error) {
    console.error('Whop Verification Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        valid: false, 
        error: 'Server error while verifying license' 
      })
    };
  }
};
