// API endpoint to get historical AHR999 data
export async function onRequest(context) {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const list = await env.AHR999_DATA.list({ prefix: 'history_' });
    const history = [];
    
    for (const key of list.keys) {
      const data = await env.AHR999_DATA.get(key.name);
      if (data) {
        history.push(JSON.parse(data));
      }
    }
    
    // Sort by timestamp
    history.sort((a, b) => b.timestamp - a.timestamp);
    
    return new Response(JSON.stringify(history), {
      status: 200,
      headers: corsHeaders
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: error.message
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
