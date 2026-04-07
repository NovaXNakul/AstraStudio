import axios from "axios";

async function callAI(prompt) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo", // ✅ FIXED
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "AI Agent Project",
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (err) {
    console.error("OPENROUTER ERROR:", err.response?.data || err.message);
    throw new Error("AI request failed");
  }
}

// 🔍 Research Agent
export async function researchAgent(topic) {
  return await callAI(`Give key research points on ${topic}`);
}

// ✍️ Writer Agent
export async function writerAgent(data) {
  return await callAI(`Write a professional blog using:\n${data}`);
}

// 📈 SEO Agent
export async function seoAgent(blog) {
  return await callAI(`Optimize this blog for SEO + add keywords:\n${blog}`);
}

// 🔁 Reviewer Agent
export async function reviewAgent(blog) {
  let improved = blog;

  for (let i = 0; i < 2; i++) {
    improved = await callAI(`Improve this blog quality:\n${improved}`);
  }

  return improved;
}

// 📱 Social Agent
export async function socialAgent(blog) {
  return await callAI(`Create LinkedIn + Twitter post for:\n${blog}`);
}