# 本地开发测试指南

## 本地启动后端

1. **启动 Cloudflare Workers 开发服务器**：
   ```bash
   npm run dev
   ```
   或者
   ```bash
   npm start
   ```

2. **查看启动信息**：
   启动后，你会看到类似这样的输出：
   ```
   ⚡️ wrangler dev
   [mf:inf] Ready on http://localhost:8787
   ```
   
   默认端口是 **8787**，如果被占用会自动使用其他端口。

## 前端调用方式

### 方式一：使用示例 HTML 文件

1. **确保后端已启动**（运行 `npm run dev`）

2. **打开示例文件**：
   - 直接双击打开 `example-frontend.html`
   - 或者使用本地服务器：
     ```bash
     # 使用 Python
     python3 -m http.server 8000
     
     # 或使用 Node.js 的 http-server
     npx http-server -p 8000
     ```
     然后访问 `http://localhost:8000/example-frontend.html`

3. **测试调用**：
   - 在输入框中输入消息
   - 点击"发送"按钮
   - 查看 AI 回复

### 方式二：使用 JavaScript fetch

```javascript
// 本地开发 URL
const GRAPHQL_ENDPOINT = 'http://localhost:8787';

async function sendMessage(content) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation PostMessage($content: String!) {
          postMessage(content: $content) {
            id
            role
            content
          }
        }
      `,
      variables: {
        content: content
      }
    })
  });

  const result = await response.json();
  return result.data.postMessage;
}

// 使用示例
sendMessage('你好').then(message => {
  console.log('AI 回复:', message.content);
});
```

### 方式三：使用 curl 测试

```bash
curl -X POST http://localhost:8787 \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { postMessage(content: \"你好\") { id role content } }"
  }'
```

## 常见问题

### 1. CORS 跨域问题

如果前端和 Worker 不在同一个域名下，可能会遇到 CORS 错误。

**解决方案**：在 `src/index.ts` 中添加 CORS 配置：

```typescript
const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  cors: {
    origin: '*', // 开发环境允许所有来源
    // 生产环境应该指定具体域名：
    // origin: ['https://yourdomain.com']
  },
})
```

### 2. 端口被占用

如果 8787 端口被占用，Wrangler 会自动使用其他端口。查看终端输出确认实际端口。

### 3. API Key 未配置

确保 `wrangler.toml` 中配置了 `DEEPSEEK_API_KEY`。

## 测试步骤

1. ✅ 启动后端：`npm run dev`
2. ✅ 确认后端运行在 `http://localhost:8787`
3. ✅ 打开前端页面或使用 curl 测试
4. ✅ 发送测试消息
5. ✅ 查看 AI 回复

## 注意事项

- 本地开发时，Worker 运行在本地，但会调用真实的 DeepSeek API
- 确保网络连接正常，可以访问 `api.deepseek.com`
- API Key 会从 `wrangler.toml` 中读取

