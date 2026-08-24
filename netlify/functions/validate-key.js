export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { licenseKey } = JSON.parse(event.body);
    
    // Admin Master Key (For your own testing and video creation)
    if (licenseKey === "NEXUS-ADMIN") {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ valid: true, message: "Admin access granted" }) 
      };
    }

    const WHOP_API_KEY = process.env.WHOP_API_KEY;
    
    if (!WHOP_API_KEY) {
      // If you haven't set the API key in Netlify yet, we return a 500 error
      return { 
        statusCode: 500, 
        body: JSON.stringify({ valid: false, error: "System not configured. Admin needs to add WHOP_API_KEY in Netlify." }) 
      };
    }

    // Call Whop API to validate the license key
    // Whop API V2 checks if the license (membership) is active
    const response = await fetch(`https://api.whop.com/api/v2/memberships/${licenseKey}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${WHOP_API_KEY}`,
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ valid: false, error: "كود التفعيل غير صحيح" }) 
      };
    }

    const data = await response.json();

    // Check if the subscription is still active
    if (data && data.status === 'active') {
      return { 
        statusCode: 200, 
        body: JSON.stringify({ valid: true }) 
      };
    } else {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ valid: false, error: "كود التفعيل منتهي الصلاحية أو غير فعال" }) 
      };
    }

  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ valid: false, error: "حدث خطأ في السيرفر أثناء التحقق" }) 
    };
  }
};
