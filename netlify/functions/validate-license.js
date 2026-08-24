// Uses native fetch available in Node.js 18+

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { licenseKey } = JSON.parse(event.body);

    if (!licenseKey) {
      return {
        statusCode: 400,
        body: JSON.stringify({ valid: false, message: 'License key is required' }),
      };
    }

    // Allow Admin Key for testing/developer access
    if (licenseKey === 'NEXUS-ADMIN') {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, message: 'Admin access granted' }),
      };
    }

    const whopApiKey = process.env.WHOP_API_KEY;
    if (!whopApiKey) {
      console.error('WHOP_API_KEY environment variable is missing.');
      return {
        statusCode: 500,
        body: JSON.stringify({ valid: false, message: 'Server configuration error' }),
      };
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
      return {
        statusCode: 401,
        body: JSON.stringify({ valid: false, message: 'Invalid or expired license key' }),
      };
    }

    const data = await whopResponse.json();

    // The validation endpoint returns information about whether the license is valid
    if (data.valid || data.status === 'active') {
      return {
        statusCode: 200,
        body: JSON.stringify({ valid: true, message: 'License is valid' }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ valid: false, message: 'License is no longer active' }),
      };
    }
  } catch (error) {
    console.error('Error validating license:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ valid: false, message: 'Internal server error' }),
    };
  }
};
