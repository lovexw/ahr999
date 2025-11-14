// Auto-refresh every 5 minutes
const REFRESH_INTERVAL = 5 * 60 * 1000;
let chartInstance = null;

async function fetchAHR999Data() {
    try {
        const response = await fetch('/api/ahr999');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        updateUI(data);
        return data;
    } catch (error) {
        console.error('Error fetching AHR999 data:', error);
        showError();
    }
}

async function fetchHistoryData() {
    try {
        const response = await fetch('/api/history');
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        const data = await response.json();
        updateChart(data);
    } catch (error) {
        console.error('Error fetching history:', error);
    }
}

function updateUI(data) {
    document.getElementById('ahr999-value').textContent = data.ahr999.toFixed(4);
    document.getElementById('btc-price').textContent = '$ ' + formatNumber(data.currentPrice);
    document.getElementById('ma200').textContent = '$ ' + formatNumber(data.ma200);
    document.getElementById('signal-text').textContent = data.signal;
    document.getElementById('advice').textContent = data.advice;
    
    const signalElement = document.getElementById('signal-text');
    signalElement.style.background = `linear-gradient(135deg, ${data.signalColor}, ${adjustBrightness(data.signalColor, -20)})`;
    
    const updateTime = new Date(data.timestamp);
    document.getElementById('update-time').textContent = updateTime.toLocaleString('zh-CN');
    
    document.querySelectorAll('.loading').forEach(el => el.classList.remove('loading'));
}

function updateChart(historyData) {
    if (!historyData || historyData.length === 0) return;
    
    const canvas = document.getElementById('historyChart');
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    const sortedData = historyData.sort((a, b) => a.timestamp - b.timestamp);
    
    const values = sortedData.map(d => d.ahr999);
    const labels = sortedData.map(d => new Date(d.timestamp).toLocaleDateString('zh-CN'));
    
    drawChart(ctx, canvas.width, canvas.height, values, labels);
}

function drawChart(ctx, width, height, values, labels) {
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    ctx.clearRect(0, 0, width, height);
    
    const maxValue = Math.max(...values, 5);
    const minValue = 0;
    const range = maxValue - minValue;
    
    ctx.strokeStyle = '#2d3748';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
        
        const value = maxValue - (range / 5) * i;
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(value.toFixed(2), padding - 10, y + 4);
    }
    
    ctx.strokeStyle = '#4c6ef5';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    values.forEach((value, index) => {
        const x = padding + (chartWidth / (values.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / range) * chartHeight;
        
        ctx.fillStyle = '#4c6ef5';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
    });
    
    const thresholds = [
        { value: 0.45, color: '#00ff00', label: '抄底' },
        { value: 1.2, color: '#00cc00', label: '定投' },
        { value: 3, color: '#ffaa00', label: '观望' },
        { value: 5, color: '#ff0000', label: '逃顶' }
    ];
    
    thresholds.forEach(threshold => {
        if (threshold.value <= maxValue) {
            const y = padding + chartHeight - ((threshold.value - minValue) / range) * chartHeight;
            ctx.strokeStyle = threshold.color;
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
            ctx.setLineDash([]);
            
            ctx.fillStyle = threshold.color;
            ctx.font = '11px Arial';
            ctx.textAlign = 'left';
            ctx.fillText(threshold.label, width - padding + 5, y + 4);
        }
    });
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(num);
}

function adjustBrightness(color, amount) {
    const num = parseInt(color.replace('#', ''), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) + amount));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
    const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
}

function showError() {
    document.getElementById('ahr999-value').textContent = 'Error';
    document.getElementById('signal-text').textContent = '无法获取数据';
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchAHR999Data();
    await fetchHistoryData();
    
    setInterval(fetchAHR999Data, REFRESH_INTERVAL);
});

window.addEventListener('resize', () => {
    fetchHistoryData();
});
