// app/api/chat/route.ts
import siteConfig from '@/siteConfig';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 从环境变量读取 API Key
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (!apiKey) {
      console.error("❌ 找不到 GEMINI_API_KEY 环境变量");
      return new Response(
        JSON.stringify({ error: "API Key 未配置，请在 Vercel 环境变量中设置 GEMINI_API_KEY" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const modelId = siteConfig.geminiConfig.modelId;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: {
          parts: [{
            text: siteConfig.geminiConfig.systemPrompt
          }]
        },
        contents: [{
          parts: [{ text: message }]
        }],
        generationConfig: {
          maxOutputTokens: siteConfig.geminiConfig.maxOutputTokens,
          temperature: siteConfig.geminiConfig.temperature,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("🚨 Gemini API 错误:", JSON.stringify(data));
      return new Response(JSON.stringify({
        error: `API 请求失败: ${response.status}`,
        details: data.error?.message || "未知错误"
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "我现在有点累，稍后再聊吧~";

    return new Response(JSON.stringify({ reply }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("🔥 Chat API 错误:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({ status: "Ready", model: siteConfig.geminiConfig.modelId }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
