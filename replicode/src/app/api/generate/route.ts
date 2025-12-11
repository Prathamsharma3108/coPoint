import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, mode } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;  // ✅ FIX
    console.log("API KEY:", apiKey);

    if (!apiKey) {
      return NextResponse.json({ error: "No API Key" }, { status: 500 });
    }

    console.log("🚀 Calling Google API (Gemini 2.5)...");

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");

    const payload = {
      contents: [{
        parts: [
          {
            text: `You are an expert Frontend Developer. Analyze this UI screenshot.
Generate ${mode === 'react' ? 'React component code' : 'HTML/Tailwind code'} to replicate it exactly.

RULES:
- Use Tailwind CSS for styling.
- Use <img src="https://placehold.co/600x400" /> for images.
- Return ONLY the raw code string. Do NOT use markdown backticks.`
          },
          { inline_data: { mime_type: "image/jpeg", data: base64Data } }
        ]
      }]
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("❌ Google API Error:", data.error.message);
      return NextResponse.json({ error: data.error.message }, { status: 500 });
    }

    const code = data.candidates?.[0]?.content?.parts?.[0]?.text
      ?.replace(/```(html|jsx|tsx|javascript)?/g, "")
      .replace(/```/g, "")
      .trim();

    return NextResponse.json({ code });

  } catch (error: any) {
    console.error("❌ Network Error:", error.message);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
