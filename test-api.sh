#!/bin/bash

# 测试 Cloudflare Workers API 的脚本
# 使用方法：./test-api.sh <你的-worker-url>

if [ -z "$1" ]; then
    echo "❌ 错误：请提供 Worker URL"
    echo ""
    echo "使用方法："
    echo "  ./test-api.sh https://crimson-brook-04a5.your-username.workers.dev"
    echo ""
    echo "或者直接设置环境变量："
    echo "  export WORKER_URL=https://crimson-brook-04a5.your-username.workers.dev"
    echo "  ./test-api.sh"
    exit 1
fi

WORKER_URL="$1"

echo "🧪 测试 Worker API: $WORKER_URL"
echo ""

# 测试 GraphQL mutation
echo "📤 发送测试消息..."
RESPONSE=$(curl -s -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation PostMessage($content: String!) { postMessage(content: $content) { id role content } }",
    "variables": { "content": "你好，请介绍一下自己" }
  }')

echo "📥 响应结果："
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"
echo ""

# 检查是否有错误
if echo "$RESPONSE" | grep -q '"errors"'; then
    echo "❌ API 调用失败，请检查："
    echo "   1. Worker URL 是否正确"
    echo "   2. Worker 是否已正确部署"
    echo "   3. API Key 是否已配置（使用: npx wrangler secret put DEEPSEEK_API_KEY）"
    exit 1
else
    echo "✅ API 调用成功！"
    echo ""
    echo "💡 提示：现在可以更新 example-frontend.html 中的 GRAPHQL_ENDPOINT 为："
    echo "   $WORKER_URL"
fi

