# 部署指南

本指南将帮助你将 AHR999 指数网站部署到 Cloudflare Pages。

## 快速部署步骤

### 方法 1: 使用 Cloudflare Pages (推荐)

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com
   - 登录你的账号

2. **创建 Pages 项目**
   - 进入 "Workers & Pages"
   - 点击 "Create application"
   - 选择 "Pages" -> "Connect to Git"
   - 连接你的 GitHub 仓库

3. **配置构建设置**
   ```
   Build command: (留空)
   Build output directory: public
   Root directory: /
   ```

4. **创建 KV 命名空间**
   - 在 Cloudflare Dashboard 中，进入 "Workers & Pages" -> "KV"
   - 点击 "Create namespace"
   - 命名为 `AHR999_DATA`
   - 记下 Namespace ID

5. **绑定 KV 到 Pages**
   - 进入你的 Pages 项目
   - Settings -> Functions
   - KV namespace bindings
   - 添加绑定:
     - Variable name: `AHR999_DATA`
     - KV namespace: 选择刚创建的命名空间

6. **配置 Cron Triggers**
   - Settings -> Functions -> Cron Triggers
   - 添加: `0 * * * *` (每小时执行一次)

7. **部署**
   - 推送代码到 GitHub
   - Cloudflare Pages 会自动部署

### 方法 2: 使用 Wrangler CLI

1. **安装依赖**
   ```bash
   npm install
   ```

2. **登录 Cloudflare**
   ```bash
   npx wrangler login
   ```

3. **创建 KV 命名空间**
   ```bash
   npx wrangler kv:namespace create "AHR999_DATA"
   ```
   
   复制输出的配置，更新 `wrangler.toml`：
   ```toml
   [[kv_namespaces]]
   binding = "AHR999_DATA"
   id = "你的_ID_这里"
   ```

4. **部署**
   ```bash
   npx wrangler pages deploy public --project-name=ahr999-index
   ```

5. **配置 Cron (首次部署后)**
   ```bash
   npx wrangler pages deployment tail
   ```
   
   然后在 Cloudflare Dashboard 中设置 Cron Trigger

### 方法 3: 手动部署

1. **上传文件**
   - 将 `public/` 目录下的所有文件上传到 Cloudflare Pages
   - 将 `functions/` 目录上传到项目根目录

2. **配置环境**
   - 按照方法 1 的步骤 4-6 配置 KV 和 Cron

## 首次运行初始化

部署完成后，需要初始化数据：

### 选项 1: 手动触发 (推荐)

访问你的网站 URL，这会触发 Worker 函数。然后：

1. 在 Cloudflare Dashboard 中找到你的 Pages 项目
2. 进入 "Functions" 标签
3. 找到 "scheduled" 函数
4. 点击 "Quick edit" -> "Send test event"

### 选项 2: 等待 Cron 执行

等待下一个整点，Cron Trigger 会自动执行并初始化数据。

### 选项 3: 使用 API 手动初始化

如果需要立即初始化，可以创建一个临时的初始化脚本：

1. 创建 `functions/init.js`:
   ```javascript
   import { onSchedule } from './scheduled.js';
   
   export async function onRequest(context) {
     await onSchedule(null, context.env, null);
     return new Response('Initialized', { status: 200 });
   }
   ```

2. 访问 `https://your-site.pages.dev/init`
3. 初始化完成后删除该文件

## 验证部署

1. **检查网站**
   - 访问你的 Pages URL
   - 确认页面加载正常

2. **检查 API**
   ```bash
   curl https://your-site.pages.dev/api/ahr999
   ```

3. **检查 Cron**
   - 在 Dashboard 中查看 Functions logs
   - 确认每小时有执行记录

## 自定义域名

1. 在 Cloudflare Pages 项目中
2. Settings -> Custom domains
3. 添加你的域名
4. 按照提示配置 DNS

## 监控和日志

### 查看实时日志
```bash
npx wrangler pages deployment tail
```

### 在 Dashboard 中查看
- Workers & Pages -> 你的项目 -> Logs

## 故障排除

### 数据未更新
1. 检查 KV 命名空间是否正确绑定
2. 检查 Cron Trigger 是否配置正确
3. 查看 Functions 日志是否有错误

### API 返回 404
1. 确认 `functions/` 目录已正确部署
2. 检查文件路径是否正确

### CoinGecko API 限流
- 免费 API 有速率限制
- 考虑升级到付费 API
- 或增加缓存时间

## 性能优化

### 启用缓存
在 `functions/api/ahr999.js` 中添加缓存头：

```javascript
headers: {
  ...corsHeaders,
  'Cache-Control': 'public, max-age=300'
}
```

### CDN 优化
- Cloudflare Pages 自动提供 CDN
- 静态资源会自动缓存和压缩

## 成本估算

使用 Cloudflare 免费套餐：
- ✅ Pages: 无限请求
- ✅ Workers: 100,000 请求/天
- ✅ KV: 100,000 读取/天, 1000 写入/天
- ✅ Cron Triggers: 包含在 Workers 配额内

每小时更新 = 24 次写入/天 (远低于限制)

预估流量：
- 假设 1000 访问/天
- API 调用约 2000 次/天
- 完全在免费套餐内

## 备份和恢复

### 备份 KV 数据
```bash
npx wrangler kv:key list --namespace-id=你的ID
npx wrangler kv:key get "latest" --namespace-id=你的ID
```

### 恢复数据
```bash
npx wrangler kv:key put "latest" --path=backup.json --namespace-id=你的ID
```

## 更新部署

### Git 推送自动部署
```bash
git add .
git commit -m "Update"
git push
```

Cloudflare Pages 会自动重新部署。

### 手动重新部署
```bash
npx wrangler pages deploy public
```

## 需要帮助？

- Cloudflare 文档: https://developers.cloudflare.com/pages/
- Cloudflare Community: https://community.cloudflare.com/
- 项目 Issues: 在 GitHub 上提交 Issue

## 下一步

- 考虑添加更多指标 (如 MVRV, NUPL)
- 添加邮件或 Telegram 通知
- 实现更复杂的数据分析
- 添加用户自定义告警
