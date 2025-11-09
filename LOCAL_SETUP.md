# 本地开发配置指南

## 本地开发时配置 API Key

为了在本地开发时使用 API Key，同时确保不会提交到 GitHub，有两种方式：

### 方式一：使用 wrangler.local.toml（推荐）

1. **复制示例文件**：
   ```bash
   cp wrangler.local.toml.example wrangler.local.toml
   ```

2. **编辑 wrangler.local.toml**：
   ```toml
   name = 'crimson-brook-04a5'
   main = "src/index.ts"
   compatibility_date = "2023-10-30"

   [vars]
   DEEPSEEK_API_KEY = "你的实际 API Key"
   ```

3. **启动本地开发服务器**：
   ```bash
   npm run dev
   ```

   Wrangler 会自动读取 `wrangler.local.toml` 文件（如果存在）。

**注意**：`wrangler.local.toml` 已在 `.gitignore` 中，不会被提交到 GitHub。

### 方式二：使用环境变量

1. **创建 .env 文件**（已在 .gitignore 中）：
   ```bash
   echo "DEEPSEEK_API_KEY=你的实际 API Key" > .env
   ```

2. **在 wrangler.toml 中引用环境变量**：
   ```toml
   [vars]
   DEEPSEEK_API_KEY = { from_secrets = true }
   ```

   或者直接使用环境变量：
   ```bash
   export DEEPSEEK_API_KEY="你的实际 API Key"
   npm run dev
   ```

### 方式三：临时在 wrangler.toml 中添加（不推荐）

如果你只是临时测试，可以在 `wrangler.toml` 中添加：

```toml
[vars]
DEEPSEEK_API_KEY = "你的 API Key"
```

**⚠️ 重要**：提交代码前，一定要移除这个配置！

## 生产环境配置

生产环境**必须**使用 Cloudflare Workers Secrets：

```bash
npx wrangler secret put DEEPSEEK_API_KEY
```

这样 API Key 就不会出现在代码或配置文件中。

## 检查配置

确保以下文件不会被提交到 GitHub：

- ✅ `wrangler.local.toml` - 已在 .gitignore 中
- ✅ `.env` - 已在 .gitignore 中
- ✅ `.env.local` - 已在 .gitignore 中

检查命令：
```bash
git status
```

如果看到这些文件，说明它们不会被提交。

## 安全最佳实践

1. ✅ **生产环境**：使用 `npx wrangler secret put DEEPSEEK_API_KEY`
2. ✅ **本地开发**：使用 `wrangler.local.toml`（不会被提交）
3. ❌ **不要**：在 `wrangler.toml` 中直接写 API Key 并提交到 GitHub
4. ❌ **不要**：将 API Key 硬编码在代码中

## 验证配置

启动本地开发服务器后，检查日志中是否有 API Key 相关的错误：

```bash
npm run dev
```

如果看到 "API key is not configured" 错误，说明配置没有生效，请检查：
1. `wrangler.local.toml` 文件是否存在
2. API Key 是否正确填写
3. 文件格式是否正确

