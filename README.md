# AHR999 指数网站

实时追踪 AHR999 比特币定投指标，每小时自动更新。部署在 Cloudflare Pages/Workers 上，稳定可靠。

## ✨ 功能特点

- ⏰ **每小时自动更新** - 通过 Cloudflare Cron Triggers 定时更新数据
- 📊 **实时指标展示** - 显示当前 AHR999 指数、比特币价格、200日均线
- 🎨 **美观界面** - 现代化深色主题，响应式设计，参考专业配色
- 📈 **历史数据图表** - 可视化展示历史数据趋势
- 🔌 **完整 API** - 提供多个公开 API 接口（数据、历史、统计、健康检查）
- ⚡ **边缘计算** - 部署在 Cloudflare 边缘网络，全球访问快速
- 🧪 **测试页面** - 内置测试页面，方便验证部署
- 📱 **响应式设计** - 完美支持移动端和桌面端

## 🚀 快速开始

想要立即部署？查看 [快速开始.md](快速开始.md) 获取详细的中文部署指南！

## AHR999 指标说明

AHR999 指数是由比特币投资者 ahr999 创建的定投指标，通过比特币价格与 200 日移动平均线的关系判断投资价值：

| 指数范围 | 信号 | 建议 |
|---------|------|------|
| < 0.45 | 抄底区间 | 极度低估，适合大量买入 |
| 0.45 - 1.2 | 定投区间 | 适合定投建仓 |
| 1.2 - 3 | 观望区间 | 持币观望，不建议操作 |
| 3 - 5 | 减仓区间 | 价格偏高，建议减仓 |
| > 5 | 逃顶区间 | 严重高估，建议大量卖出 |

## 技术栈

- **前端**: HTML5, CSS3, Vanilla JavaScript
- **后端**: Cloudflare Workers
- **存储**: Cloudflare KV
- **API**: CoinGecko API
- **部署**: Cloudflare Pages

## 项目结构

```
.
├── public/                 # 静态文件
│   ├── index.html         # 主页面
│   ├── test.html          # 测试页面
│   ├── style.css          # 样式文件
│   └── script.js          # 前端脚本
├── functions/             # Cloudflare Workers 函数
│   ├── scheduled.js       # 定时任务（每小时更新）
│   ├── init.js            # 手动初始化端点
│   ├── health.js          # 健康检查端点
│   └── api/              # API 端点
│       ├── ahr999.js     # 获取最新数据
│       ├── history.js    # 获取历史数据
│       └── stats.js      # 获取统计信息
├── wrangler.toml         # Cloudflare 配置
├── package.json          # 项目配置
├── README.md            # 项目文档（中文）
├── DEPLOY.md            # 详细部署文档
├── 快速开始.md           # 快速开始指南
├── FAQ.md               # 常见问题解答
└── CONTRIBUTING.md      # 贡献指南
```

## 本地开发

### 前置要求

- Node.js 16+
- npm 或 yarn
- Cloudflare 账号

### 安装依赖

```bash
npm install
```

### 本地运行

```bash
npm run dev
```

访问 http://localhost:8788

## 部署到 Cloudflare

### 1. 登录 Cloudflare

```bash
npx wrangler login
```

### 2. 创建 KV 命名空间

```bash
npx wrangler kv:namespace create "AHR999_DATA"
```

记下返回的 `id`，更新 `wrangler.toml` 中的 KV 命名空间 ID：

```toml
[[kv_namespaces]]
binding = "AHR999_DATA"
id = "你的_KV_命名空间_ID"
```

### 3. 部署项目

```bash
npx wrangler pages deploy public --project-name=ahr999-index
```

### 4. 配置 Cron Trigger

在 Cloudflare Dashboard 中：

1. 进入 Workers & Pages
2. 选择你的项目
3. 进入 Settings -> Triggers
4. 添加 Cron Trigger: `0 * * * *` (每小时运行)
5. 绑定 KV 命名空间 `AHR999_DATA`

### 5. 初始化数据

部署后，访问 `/init` 端点初始化数据：

```
https://你的项目.pages.dev/init
```

### 6. 验证部署

访问测试页面验证所有功能：

```
https://你的项目.pages.dev/test.html
```

## 📚 API 文档

### 获取最新 AHR999 数据

```
GET /api/ahr999
```

**响应示例：**

```json
{
  "timestamp": 1704067200000,
  "date": "2024-01-01T00:00:00.000Z",
  "currentPrice": 50000,
  "ma200": 40000,
  "ahr999": 1.5625,
  "signal": "观望区间",
  "signalColor": "#ffaa00",
  "advice": "持币观望，不建议操作"
}
```

### 获取历史数据

```
GET /api/history
```

返回最近 30 天的历史数据数组。

### 获取统计信息

```
GET /api/stats
```

返回数据统计，包括最小值、最大值、平均值、中位数等。

### 健康检查

```
GET /health
```

检查系统健康状态和数据更新情况。

## 🧪 测试和验证

部署完成后，访问 `/test.html` 可以：

- ✅ 测试所有 API 端点
- ✅ 验证数据获取
- ✅ 检查系统健康状态
- ✅ 确认前端资源加载

历史数据保存最近 30 天。

## 数据来源

- **比特币价格**: CoinGecko API
- **历史数据**: CoinGecko API (200 天历史价格)
- **更新频率**: 每小时

## 注意事项

- 本项目使用免费的 CoinGecko API，请遵守其使用限制
- AHR999 指标仅供参考，不构成投资建议
- 投资有风险，入市需谨慎

## 自定义配置

### 修改更新频率

编辑 `wrangler.toml` 中的 cron 表达式：

```toml
[triggers]
crons = ["0 * * * *"]  # 每小时
# crons = ["*/30 * * * *"]  # 每30分钟
# crons = ["0 */2 * * *"]  # 每2小时
```

### 修改历史数据保留天数

编辑 `functions/scheduled.js` 中的 `cleanupOldHistory` 函数：

```javascript
const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
// 改为保留 60 天
const sixtyDaysAgo = Date.now() - (60 * 24 * 60 * 60 * 1000);
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！

## 支持

如果这个项目对你有帮助，请给个 ⭐️ Star！
