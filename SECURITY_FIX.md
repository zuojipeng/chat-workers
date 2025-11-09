# 安全修复指南

## ⚠️ 重要：API Key 已从配置文件中移除

如果你之前已经将包含 API Key 的 `wrangler.toml` 提交到了 GitHub，需要采取以下措施：

## 1. 立即更换 API Key（推荐）

**最重要**：如果你的 API Key 已经暴露在 GitHub 上，应该立即更换它：

1. 登录 DeepSeek 控制台
2. 撤销当前的 API Key
3. 创建新的 API Key
4. 使用新的 API Key 配置 Cloudflare Workers Secrets

## 2. 从 Git 历史中移除敏感信息（可选）

如果你想要从 Git 历史记录中完全移除 API Key，可以使用 `git filter-branch` 或 `git filter-repo`：

### 方法一：使用 git filter-repo（推荐）

```bash
# 安装 git-filter-repo
pip install git-filter-repo

# 从历史记录中移除敏感信息
git filter-repo --path wrangler.toml --invert-paths
# 或者替换敏感内容
git filter-repo --replace-text <(echo 'sk-18fb922108e6494e8f24b1716f3af803==>REDACTED')
```

### 方法二：使用 BFG Repo-Cleaner

```bash
# 下载 BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# 创建替换文件
echo 'sk-18fb922108e6494e8f24b1716f3af803==>REDACTED' > replacements.txt

# 清理历史
java -jar bfg.jar --replace-text replacements.txt

# 强制推送（⚠️ 危险操作）
git push --force --all
```

### 方法三：手动编辑历史（不推荐）

```bash
# 使用交互式 rebase
git rebase -i HEAD~3

# 编辑包含敏感信息的提交
# 然后强制推送
git push --force
```

**⚠️ 警告**：修改 Git 历史后需要强制推送，这会影响所有协作者。建议在私有仓库中操作，或者通知团队成员。

## 3. 使用 Cloudflare Workers Secrets（已配置）

现在 API Key 已经不在 `wrangler.toml` 中了，使用 Secrets 来配置：

```bash
npx wrangler secret put DEEPSEEK_API_KEY
```

输入你的 API Key（建议使用新创建的 Key）。

## 4. 验证修复

1. **检查 wrangler.toml**：
   ```bash
   cat wrangler.toml
   ```
   确认没有 API Key

2. **检查 .gitignore**：
   ```bash
   cat .gitignore | grep wrangler
   ```
   确认 `wrangler.local.toml` 在忽略列表中

3. **检查 Git 状态**：
   ```bash
   git status
   ```
   确认没有敏感文件被跟踪

## 5. 本地开发配置

创建 `wrangler.local.toml` 用于本地开发：

```bash
cp wrangler.local.toml.example wrangler.local.toml
# 编辑 wrangler.local.toml，填入你的 API Key
```

这个文件已在 `.gitignore` 中，不会被提交。

## 最佳实践

✅ **生产环境**：使用 `npx wrangler secret put DEEPSEEK_API_KEY`
✅ **本地开发**：使用 `wrangler.local.toml`（不会被提交）
✅ **代码审查**：提交前检查是否包含敏感信息
❌ **不要**：在配置文件中硬编码 API Key
❌ **不要**：将包含敏感信息的文件提交到 Git

## 参考

- [Cloudflare Workers Secrets 文档](https://developers.cloudflare.com/workers/configuration/secrets/)
- [Git 历史清理指南](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

