// Manual initialization endpoint - visit /init to trigger first data fetch
// Remove this file after initialization or keep it for manual updates

export async function onRequest(context) {
  const { env, request } = context;
  
  // Simple authentication check (optional)
  // You can add a secret token in the URL to prevent unauthorized access
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  
  // Uncomment and set your secret if you want authentication
  // const INIT_SECRET = 'your-secret-here';
  // if (secret !== INIT_SECRET) {
  //   return new Response('Unauthorized', { status: 401 });
  // }
  
  try {
    console.log('Manual initialization triggered...');
    
    // Calculate AHR999
    const ahr999Data = await calculateAHR999();
    
    // Store in KV
    await env.AHR999_DATA.put('latest', JSON.stringify(ahr999Data));
    await env.AHR999_DATA.put(`history_${Date.now()}`, JSON.stringify(ahr999Data));
    
    return new Response(JSON.stringify({
      success: true,
      message: 'AHR999 data initialized successfully',
      data: ahr999Data
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Initialization error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

async function calculateAHR999() {
  try {
    // Fetch current Bitcoin price from CoinGecko API
    const priceResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const priceData = await priceResponse.json();
    const currentPrice = priceData.bitcoin.usd;
    
    // Fetch historical data for 200-day MA
    const historyResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=200');
    const historyData = await historyResponse.json();
    
    // Calculate 200-day moving average
    const prices = historyData.prices.map(p => p[1]);
    const ma200 = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Calculate AHR999 index
    const priceRatio = currentPrice / ma200;
    const ahr999 = priceRatio * (currentPrice / Math.pow(ma200, 2));
    
    // Determine market signal
    let signal = '';
    let signalColor = '';
    let advice = '';
    
    if (ahr999 < 0.45) {
      signal = '抄底区间';
      signalColor = '#00ff00';
      advice = '极度低估，适合大量买入';
    } else if (ahr999 < 1.2) {
      signal = '定投区间';
      signalColor = '#00cc00';
      advice = '适合定投建仓';
    } else if (ahr999 < 3) {
      signal = '观望区间';
      signalColor = '#ffaa00';
      advice = '持币观望，不建议操作';
    } else if (ahr999 < 5) {
      signal = '减仓区间';
      signalColor = '#ff6600';
      advice = '价格偏高，建议减仓';
    } else {
      signal = '逃顶区间';
      signalColor = '#ff0000';
      advice = '严重高估，建议大量卖出';
    }
    
    return {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      currentPrice: currentPrice,
      ma200: ma200,
      ahr999: ahr999,
      signal: signal,
      signalColor: signalColor,
      advice: advice
    };
  } catch (error) {
    console.error('Error calculating AHR999:', error);
    throw error;
  }
}
