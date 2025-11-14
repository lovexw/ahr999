# 更新日志

本文档记录项目的所有重要变更。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-01-01

### 新增

- ✨ 核心功能
  - AHR999 指数计算和展示
  - 每小时自动更新机制
  - 比特币价格和 200 日均线显示
  - 投资信号和建议

- 📊 数据可视化
  - 历史数据图表
  - 实时数据刷新
  - 响应式设计

- 🔌 API 接口
  - `/api/ahr999` - 获取最新数据
  - `/api/history` - 获取历史数据
  - `/api/stats` - 获取统计信息
  - `/health` - 健康检查

- 🎨 用户界面
  - 现代化深色主题
  - 移动端适配
  - 平滑动画效果
  - 直观的指标说明

- 🧪 开发工具
  - 测试页面 (`/test.html`)
  - 初始化端点 (`/init`)
  - 健康检查端点

- 📚 文档
  - 中文 README
  - 快速开始指南
  - 详细部署文档
  - FAQ 常见问题
  - 贡献指南

### 技术实现

- Cloudflare Workers 定时任务
- Cloudflare KV 数据存储
- CoinGecko API 数据源
- 原生 JavaScript（无框架依赖）
- CSS Grid 和 Flexbox 布局
- Canvas 图表绘制

### 部署特性

- 零配置部署到 Cloudflare Pages
- 全球 CDN 加速
- 自动 HTTPS
- 自定义域名支持

---

## 未来计划

### [1.1.0] - 计划中

- [ ] 添加更多比特币指标
  - [ ] MVRV Ratio
  - [ ] NUPL (Net Unrealized Profit/Loss)
  - [ ] Rainbow Chart
  - [ ] Stock-to-Flow Model

- [ ] 通知功能
  - [ ] 邮件通知
  - [ ] Telegram Bot
  - [ ] Webhook 支持

- [ ] 用户功能
  - [ ] 自定义告警阈值
  - [ ] 个人持仓跟踪
  - [ ] 收益计算器

- [ ] 界面增强
  - [ ] 深色/浅色主题切换
  - [ ] 多语言支持（英文、日文）
  - [ ] 更多图表类型
  - [ ] PWA 支持

- [ ] 数据增强
  - [ ] 更长的历史数据（90 天、180 天）
  - [ ] 数据导出功能
  - [ ] 对比分析工具

### [1.2.0] - 计划中

- [ ] 高级功能
  - [ ] AI 分析和预测
  - [ ] 市场情绪分析
  - [ ] 链上数据整合
  - [ ] 社交媒体热度追踪

- [ ] 开发者工具
  - [ ] GraphQL API
  - [ ] WebSocket 实时推送
  - [ ] SDK 和客户端库
  - [ ] API 文档站点

- [ ] 性能优化
  - [ ] Service Worker 缓存
  - [ ] 图片懒加载
  - [ ] 代码分割
  - [ ] 性能监控

---

## 贡献

欢迎为项目贡献代码或提出建议！查看 [CONTRIBUTING.md](CONTRIBUTING.md) 了解如何参与。

## 支持

如果这个项目对你有帮助，请给个 ⭐️ Star！
