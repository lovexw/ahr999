# 常见问题解答 (FAQ)

## 关于 AHR999 指标

### 什么是 AHR999？

AHR999 是一个比特币定投指标，由中国比特币投资者 ahr999 创建。它通过比较比特币当前价格与其 200 日移动平均线的关系来评估市场状态。

### AHR999 是如何计算的？

```
AHR999 = (Bitcoin Price / 200-day MA) × (Bitcoin Price / (200-day MA)²)
```

### 如何解读 AHR999 指数？

| 指数值 | 区间 | 含义 | 建议 |
|--------|------|------|------|
| < 0.45 | 抄底区间 | 极度低估 | 适合大量买入 |
| 0.45 - 1.2 | 定投区间 | 相对低估 | 适合定投建仓 |
| 1.2 - 3 | 观望区间 | 合理估值 | 持币观望 |
| 3 - 5 | 减仓区间 | 价格偏高 | 建议减仓 |
| > 5 | 逃顶区间 | 严重高估 | 建议大量卖出 |

### AHR999 准确吗？

AHR999 是一个参考指标，不是绝对准确的预测工具。它基于历史数据和统计规律，但：

- ✅ 适合长期投资决策
- ✅ 可以帮助避免情绪化交易
- ❌ 不适合短期交易
- ❌ 不能预测确切的顶部和底部

## 关于本网站

### 数据多久更新一次？

每小时自动更新一次。Cloudflare Workers 的 Cron Trigger 会在每个整点执行更新任务。

### 数据来源是什么？

- **Bitcoin 价格**: CoinGecko API
- **历史数据**: CoinGecko API (200 天历史价格)
- **更新频率**: 每小时

### 为什么选择 CoinGecko？

- 免费且可靠的 API
- 提供历史数据
- 全球范围的价格汇总
- 良好的 API 文档

### 网站会收费吗？

不会！本项目完全开源免费。部署在 Cloudflare 的免费套餐上，成本为零。

### 可以商业使用吗？

可以！本项目使用 MIT 许可证，允许商业使用。但请注意：

1. 保留原始许可证声明
2. 投资建议仅供参考
3. 使用者需自行承担风险

## 部署相关

### 部署需要什么？

- Cloudflare 账号（免费）
- GitHub 账号（可选）
- 基本的 Git 知识（可选）

### 部署需要多长时间？

按照快速开始指南，大约 10-15 分钟即可完成部署。

### 部署失败怎么办？

1. **检查 KV 绑定**：确保在 Settings -> Functions -> KV namespace bindings 中正确绑定了 `AHR999_DATA`
2. **检查 Cron Trigger**：确保在 Settings -> Functions -> Cron Triggers 中添加了 `0 * * * *`
3. **查看日志**：在 Functions 标签查看错误日志
4. **访问 /init**：手动初始化数据
5. **查看文档**：阅读 DEPLOY.md 获取详细说明

### 如何更新网站？

如果使用 Git 集成：
```bash
git add .
git commit -m "Update"
git push
```

Cloudflare Pages 会自动重新部署。

### 如何回滚到之前的版本？

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. 点击 "Deployments" 标签
3. 找到之前的成功部署
4. 点击 "..." -> "Rollback to this deployment"

### 如何删除项目？

1. 在 Cloudflare Dashboard 中进入你的 Pages 项目
2. Settings -> 滚动到底部
3. 点击 "Delete project"
4. 同时在 KV 中删除 `AHR999_DATA` 命名空间

## API 使用

### API 有使用限制吗？

Cloudflare 免费套餐：
- 100,000 请求/天
- 对于个人使用完全足够

### API 需要认证吗？

不需要。所有 API 端点都是公开的，支持 CORS。

### 可以用于自己的应用吗？

当然可以！这就是我们提供 API 的目的。

### API 响应速度如何？

- 全球 CDN 加速
- 平均响应时间 < 100ms
- KV 读取延迟 < 50ms

### 如何处理 API 错误？

```javascript
try {
  const response = await fetch('/api/ahr999');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  // 使用数据
} catch (error) {
  console.error('API 错误:', error);
  // 显示错误提示给用户
}
```

## 技术问题

### 为什么选择 Cloudflare？

- ✅ 免费且强大
- ✅ 全球 CDN
- ✅ 边缘计算
- ✅ 稳定可靠（99.99% 可用性）
- ✅ KV 存储
- ✅ Cron Triggers
- ✅ 零配置部署

### 为什么不使用数据库？

Cloudflare KV 足够：
- 快速读取
- 全球分布
- 简单易用
- 免费额度充足

对于这个项目的数据量，KV 是最佳选择。

### 可以修改更新频率吗？

可以！编辑 `wrangler.toml` 或在 Cloudflare Dashboard 中修改 Cron Trigger：

- 每 30 分钟：`*/30 * * * *`
- 每 2 小时：`0 */2 * * *`
- 每天一次：`0 0 * * *`

### 如何备份数据？

使用 Wrangler CLI：

```bash
# 列出所有键
npx wrangler kv:key list --namespace-id=你的ID

# 导出数据
npx wrangler kv:key get "latest" --namespace-id=你的ID > backup.json
```

### 如何恢复数据？

```bash
npx wrangler kv:key put "latest" --path=backup.json --namespace-id=你的ID
```

### 网站加载慢怎么办？

1. **检查网络**：确认网络连接正常
2. **清除缓存**：清除浏览器缓存
3. **检查 CDN**：Cloudflare 可能在首次访问时较慢
4. **自定义域名**：使用自定义域名可能更快

### 如何添加自定义域名？

1. 在 Cloudflare Pages 项目中
2. Settings -> Custom domains
3. Add custom domain
4. 按提示配置 DNS（通常是添加 CNAME 记录）
5. 等待 DNS 生效（5-10 分钟）

## 投资相关

### 我应该完全依赖 AHR999 吗？

**不应该！** AHR999 只是众多指标之一。建议：

1. 结合多个指标使用
2. 了解基本面
3. 控制风险
4. 不要投入超过承受能力的资金

### 还有哪些类似指标？

- **MVRV Ratio**：市值与实现市值比率
- **NUPL**：净未实现盈亏
- **Rainbow Chart**：彩虹图
- **Stock-to-Flow**：存量流量模型
- **Fear & Greed Index**：恐惧与贪婪指数

### AHR999 在牛市顶部有效吗？

历史数据显示，AHR999 在识别牛市顶部方面有一定参考价值，但：

- 每次牛市的顶部可能不同
- 宏观经济环境会影响
- 不要试图精确抄底逃顶
- 分批操作是更好的策略

### AHR999 在熊市底部有效吗？

在识别熊市底部方面，AHR999 表现较好。当指数 < 0.45 时，历史上多次是不错的买入时机。但请注意：

- 底部可能持续很长时间
- 可能跌破历史低点
- 建议分批建仓
- 保持足够的现金储备

## 贡献和开发

### 如何贡献代码？

请阅读 CONTRIBUTING.md 文件。

### 如何报告 Bug？

在 GitHub 上创建 Issue，包含：
- 问题描述
- 复现步骤
- 预期结果
- 实际结果
- 截图（如果有）

### 如何建议新功能？

1. 在 GitHub 上创建 Issue
2. 说明功能的用途
3. 解释为什么需要这个功能
4. 讨论实现方案

### 项目使用什么技术栈？

- **前端**: HTML, CSS, Vanilla JavaScript
- **后端**: Cloudflare Workers
- **存储**: Cloudflare KV
- **部署**: Cloudflare Pages

### 为什么不使用框架（React/Vue）？

- 保持简单
- 减少依赖
- 更快的加载速度
- 更容易理解和修改

但如果你想用框架重写，完全可以！这是开源项目。

## 其他问题

### 网站是否收集用户数据？

不收集！本网站：
- ❌ 不使用 Cookie
- ❌ 不收集个人信息
- ❌ 不使用追踪代码
- ✅ 完全开源透明

### 数据的隐私性如何？

- 所有数据都是公开的市场数据
- 不涉及个人隐私信息
- KV 存储的只是 AHR999 计算结果

### 可以离线使用吗？

目前不支持离线使用，因为需要实时获取比特币价格。但你可以：

1. 将项目改造为 PWA
2. 添加 Service Worker
3. 缓存历史数据

这些功能欢迎贡献！

### 移动端体验如何？

网站使用响应式设计，在手机和平板上都能良好显示。

### 支持哪些浏览器？

支持所有现代浏览器：
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

不支持 IE11。

### 如何联系开发者？

- GitHub Issues
- GitHub Discussions
- 项目文档中的链接

### 这个项目的未来计划？

查看 GitHub 上的 Roadmap 和 Issues。欢迎提供建议！

---

## 还有其他问题？

如果这个 FAQ 没有回答你的问题：

1. 查看 README.md
2. 查看 DEPLOY.md
3. 在 GitHub 上创建 Issue
4. 查看现有的 Issues 和 Discussions

祝投资顺利！📈
