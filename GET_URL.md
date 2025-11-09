# 如何获取线上接口 URL

## 方法一：从 Cloudflare Workers 控制台获取（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** 页面
3. 找到你的 Worker：`crimson-brook-04a5`
4. 点击右上角的蓝色 **"Visit"** 按钮
5. 这会打开你的 Worker URL，格式通常是：
   ```
   https://crimson-brook-04a5.your-username.workers.dev
   ```
   或者
   ```
   https://crimson-brook-04a5.your-subdomain.workers.dev
   ```

## 方法二：从 Worker 详情页获取

1. 在 Workers & Pages 页面，点击你的 Worker 名称
2. 在 **Overview** 页面，你会看到 **"Visit"** 按钮
3. 点击后即可获取 URL

## 方法三：通过命令行获取

```bash
# 需要先登录
npx wrangler login

# 查看部署信息
npx wrangler deployments list
```

## URL 格式说明

根据你的 `wrangler.toml`，项目名称是 `crimson-brook-04a5`，所以 URL 可能是：

- `https://crimson-brook-04a5.your-username.workers.dev`
- `https://crimson-brook-04a5.your-subdomain.workers.dev`

其中 `your-username` 或 `your-subdomain` 是你的 Cloudflare 账户标识。

## 测试线上接口

获取到 URL 后，可以使用 curl 测试：

```bash
curl -X POST https://crimson-brook-04a5.your-username.workers.dev \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { postMessage(content: \"你好\") { id role content } }"
  }'
```

## 更新前端代码

获取到 URL 后，更新 `example-frontend.html` 中的 `GRAPHQL_ENDPOINT`：

```javascript
const GRAPHQL_ENDPOINT = 'https://crimson-brook-04a5.your-username.workers.dev';
```

