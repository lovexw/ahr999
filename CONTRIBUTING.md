# 贡献指南

感谢你对 AHR999 指数项目的关注！我们欢迎所有形式的贡献。

## 如何贡献

### 报告 Bug

如果你发现了 bug，请创建一个 Issue，并包含：

- 详细的问题描述
- 复现步骤
- 预期行为
- 实际行为
- 截图（如果适用）
- 浏览器和操作系统信息

### 提出新功能

如果你有新功能的想法，请：

1. 先创建一个 Issue 讨论该功能
2. 说明功能的用途和价值
3. 等待维护者的反馈

### 提交 Pull Request

1. **Fork 项目**
   ```bash
   # 点击 GitHub 上的 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/your-username/ahr999-index.git
   cd ahr999-index
   ```

3. **创建新分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```

4. **进行修改**
   - 遵循现有的代码风格
   - 添加必要的注释
   - 确保代码可以正常运行

5. **测试你的修改**
   ```bash
   npm install
   npm run dev
   ```
   
   在浏览器中测试所有功能

6. **提交修改**
   ```bash
   git add .
   git commit -m "描述你的修改"
   ```

7. **推送到你的 Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **创建 Pull Request**
   - 在 GitHub 上打开你的 Fork
   - 点击 "New Pull Request"
   - 填写 PR 描述，说明你的修改
   - 等待 review

## 代码规范

### JavaScript

- 使用 2 空格缩进
- 使用 `const` 和 `let`，不使用 `var`
- 使用模板字符串而不是字符串拼接
- 函数和变量使用驼峰命名法
- 添加必要的注释

```javascript
// Good
async function fetchData() {
  const response = await fetch('/api/ahr999');
  const data = await response.json();
  return data;
}

// Bad
function fetchData() {
  var response = fetch('/api/ahr999');
  return response.then(function(r) {
    return r.json();
  });
}
```

### CSS

- 使用 CSS 变量定义颜色和尺寸
- 使用语义化的类名
- 遵循现有的命名约定

```css
/* Good */
.card-header {
  background-color: var(--card-bg);
  padding: var(--spacing-md);
}

/* Bad */
.ch {
  background-color: #1a2142;
  padding: 20px;
}
```

### HTML

- 使用语义化标签
- 添加适当的 ARIA 标签
- 保持结构清晰

## 项目结构

```
.
├── public/              # 前端静态文件
│   ├── index.html      # 主页面
│   ├── style.css       # 样式
│   └── script.js       # 前端脚本
├── functions/          # Cloudflare Workers 函数
│   ├── scheduled.js    # 定时任务
│   ├── init.js         # 初始化端点
│   └── api/           # API 端点
├── wrangler.toml      # Cloudflare 配置
└── README.md          # 项目文档
```

## 可以贡献的领域

### 功能增强

- [ ] 添加更多比特币指标（MVRV, NUPL, Rainbow Chart）
- [ ] 实现通知功能（邮件、Telegram）
- [ ] 添加用户账户系统
- [ ] 多语言支持
- [ ] 移动应用

### 界面改进

- [ ] 深色/浅色主题切换
- [ ] 更丰富的图表类型
- [ ] 响应式设计优化
- [ ] 动画效果
- [ ] 可访问性改进

### 技术优化

- [ ] 添加单元测试
- [ ] 性能优化
- [ ] SEO 优化
- [ ] PWA 支持
- [ ] 错误处理改进

### 文档完善

- [ ] API 文档
- [ ] 使用教程
- [ ] 视频教程
- [ ] 多语言文档
- [ ] FAQ

## 测试

在提交 PR 前，请确保：

1. ✅ 代码可以正常运行
2. ✅ 没有控制台错误
3. ✅ 在不同浏览器中测试
4. ✅ 响应式设计正常工作
5. ✅ API 端点正常返回数据

## 行为准则

- 尊重所有贡献者
- 保持专业和友好
- 接受建设性批评
- 专注于对项目最有利的事情

## 问题和帮助

如果你有任何问题，可以：

- 创建 Issue
- 在 Discussion 中提问
- 查看现有的文档

## 许可证

通过贡献代码，你同意你的贡献将使用 MIT 许可证。

## 致谢

感谢所有贡献者的付出！你们让这个项目变得更好。

---

再次感谢你的贡献！🎉
