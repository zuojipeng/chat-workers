# Cloudflare Workers 部署指南

## 部署步骤

### 1. 安装 Wrangler CLI（如果还没有安装）

```bash
npm install -g wrangler
```

或者使用项目本地的 wrangler：

```bash
npm install
```

### 2. 登录 Cloudflare

```bash
npx wrangler login
```

这会打开浏览器，让你登录 Cloudflare 账户。

### 3. 配置 API Key（重要：使用 Secrets）

**⚠️ 安全提示**：不要将 API Key 直接放在 `wrangler.toml` 中提交到 GitHub！

使用 Cloudflare Workers 的 secrets 功能来安全地存储 API Key：

```bash
npx wrangler secret put DEEPSEEK_API_KEY
```

运行后会提示你输入 API Key，输入你的 DeepSeek API Key 即可。

**注意**：Secrets 是加密存储的，只有部署后的 Worker 可以访问，不会出现在代码或配置文件中。

### 4. 部署到 Cloudflare Workers

```bash
npm run deploy
```

或者：

```bash
npx wrangler deploy
```

### 5. 获取部署后的 URL

部署成功后，你会看到类似这样的输出：

```
✨  Deployed to https://chat-worker.your-username.workers.dev
```

这个 URL 就是你的 API 地址！

## 更新前端代码

部署成功后，更新前端代码中的 API 地址：

### 在 `example-frontend.html` 中：

```javascript
// 将本地开发 URL 改为生产环境 URL
const GRAPHQL_ENDPOINT = 'https://chat-worker.your-username.workers.dev';
```

### 在 React/Vue 等前端项目中：

```javascript
const GRAPHQL_ENDPOINT = 'https://chat-worker.your-username.workers.dev';
```

## 安全建议

### 1. 使用 Secrets 管理敏感信息

**不要**在 `wrangler.toml` 中直接写 API Key：

```toml
# ❌ 不要这样做
[vars]
DEEPSEEK_API_KEY = "sk-xxxxx"
```

**应该**使用 secrets：

```bash
# ✅ 正确做法
npx wrangler secret put DEEPSEEK_API_KEY
```

### 2. 更新 wrangler.toml

从 `wrangler.toml` 中移除 API Key：

```toml
name = "chat-worker"
main = "src/index.ts"
compatibility_date = "2023-10-30"

# 移除 [vars] 部分，使用 secrets 代替
```

### 3. 更新 .gitignore

确保 `.gitignore` 包含：

```
.env
.env.local
wrangler.toml  # 如果包含敏感信息
```

## 验证部署

部署后，可以使用 curl 测试：

```bash
curl -X POST https://chat-worker.your-username.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { postMessage(content: \"你好\") { id role content } }"
  }'
```

## 常见问题

### 1. 部署失败：API Key 未找到

**解决方案**：确保已经设置了 secret：

```bash
npx wrangler secret put DEEPSEEK_API_KEY
```

### 2. CORS 错误

如果前端调用时遇到 CORS 错误，检查 `src/index.ts` 中的 CORS 配置：

```typescript
cors: {
  origin: '*', // 开发环境
  // 生产环境建议指定具体域名：
  // origin: ['https://yourdomain.com']
}
```

### 3. 查看日志

```bash
npx wrangler tail
```

这会实时显示 Worker 的日志输出。

## 更新代码

每次修改代码后，重新部署：

```bash
git add .
git commit -m "Update code"
git push
npm run deploy
```

## 参考链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GraphQL Yoga 文档](https://the-guild.dev/graphql/yoga-server)

