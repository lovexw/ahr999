// Statistics endpoint - provides summary statistics of AHR999 data
export async function onRequest(context) {
  const { env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  if (context.request.method === 'OPTIONS') {
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
    
    if (history.length === 0) {
      return new Response(JSON.stringify({
        error: 'No historical data available'
      }), {
        status: 404,
        headers: corsHeaders
      });
    }
    
    // Calculate statistics
    const ahr999Values = history.map(d => d.ahr999);
    const prices = history.map(d => d.currentPrice);
    
    const stats = {
      dataPoints: history.length,
      period: {
        start: new Date(Math.min(...history.map(d => d.timestamp))).toISOString(),
        end: new Date(Math.max(...history.map(d => d.timestamp))).toISOString()
      },
      ahr999: {
        current: ahr999Values[ahr999Values.length - 1],
        min: Math.min(...ahr999Values),
        max: Math.max(...ahr999Values),
        avg: ahr999Values.reduce((a, b) => a + b, 0) / ahr999Values.length,
        median: calculateMedian(ahr999Values)
      },
      price: {
        current: prices[prices.length - 1],
        min: Math.min(...prices),
        max: Math.max(...prices),
        avg: prices.reduce((a, b) => a + b, 0) / prices.length,
        change24h: prices.length >= 24 ? 
          ((prices[prices.length - 1] - prices[prices.length - 24]) / prices[prices.length - 24] * 100) : null
      },
      signals: calculateSignalDistribution(ahr999Values)
    };
    
    return new Response(JSON.stringify(stats), {
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

function calculateMedian(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function calculateSignalDistribution(ahr999Values) {
  const distribution = {
    '抄底区间': 0,
    '定投区间': 0,
    '观望区间': 0,
    '减仓区间': 0,
    '逃顶区间': 0
  };
  
  ahr999Values.forEach(value => {
    if (value < 0.45) distribution['抄底区间']++;
    else if (value < 1.2) distribution['定投区间']++;
    else if (value < 3) distribution['观望区间']++;
    else if (value < 5) distribution['减仓区间']++;
    else distribution['逃顶区间']++;
  });
  
  return distribution;
}
