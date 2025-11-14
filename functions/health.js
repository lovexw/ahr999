// Health check endpoint for monitoring
export async function onRequest(context) {
  const { env } = context;
  
  try {
    // Check if we can read from KV
    const latestData = await env.AHR999_DATA.get('latest');
    
    const health = {
      status: 'healthy',
      timestamp: Date.now(),
      services: {
        kv: latestData ? 'operational' : 'no_data',
        api: 'operational'
      }
    };
    
    if (latestData) {
      const data = JSON.parse(latestData);
      const lastUpdate = Date.now() - data.timestamp;
      const hoursSinceUpdate = Math.floor(lastUpdate / (1000 * 60 * 60));
      
      health.lastUpdate = data.date;
      health.hoursSinceUpdate = hoursSinceUpdate;
      
      // Warn if data is more than 2 hours old
      if (hoursSinceUpdate > 2) {
        health.status = 'degraded';
        health.warning = 'Data is stale';
      }
    }
    
    return new Response(JSON.stringify(health, null, 2), {
      status: health.status === 'healthy' ? 200 : 503,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'unhealthy',
      error: error.message,
      timestamp: Date.now()
    }, null, 2), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
