import { createYoga, createSchema } from 'graphql-yoga'
import typeDefs from './schema'

// 定义我们期望从DeepSeek API收到的响应体结构
interface DeepSeekResponse {
  id: string;
  choices: {
    message: {
      role: 'assistant';
      content: string;
    }
  }[];
}

const resolvers = {
  Query: {
    placeholder: () => 'This is a placeholder.',
  },
  Mutation: {
    postMessage: async (parent, { content }, c) => {
      console.log("Entering postMessage resolver...");
      try {
        console.log(`Received content: ${content}`);

        const apiKey = c.DEEPSEEK_API_KEY;
        if (!apiKey) {
          console.error("DEEPSEEK_API_KEY is not available in context.");
          throw new Error("API key is not configured.");
        }
        console.log("DEEPSEEK_API_KEY exists in context.");

        const deepseekResponse = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [{ role: "user", content: content }],
          }),
        });

        console.log(`DeepSeek API response status: ${deepseekResponse.status}`);

        if (!deepseekResponse.ok) {
          const errorText = await deepseekResponse.text();
          console.error("DeepSeek API Error:", errorText);
          throw new Error(`Failed to get response from DeepSeek API. Status: ${deepseekResponse.status}`);
        }

        const responseData: DeepSeekResponse = await deepseekResponse.json();
        console.log("Successfully parsed JSON response from API.");
        
        const responseMessage = responseData.choices[0].message;

        return {
          id: responseData.id,
          role: responseMessage.role,
          content: responseMessage.content,
        }
      } catch (error) {
        console.error("Error in postMessage resolver:", error);
        // 重新抛出错误，以便GraphQL可以捕获它并返回INTERNAL_SERVER_ERROR
        throw error;
      }
    },
  },
}

const yoga = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),
  // 配置 CORS，允许前端跨域调用
  cors: {
    origin: '*', // 开发环境允许所有来源
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
})

export default {
  fetch: yoga.fetch,
}
