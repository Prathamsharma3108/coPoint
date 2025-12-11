import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Initialize Gemini with your API key
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-001" });

export async function POST(req: Request) {
  try {
    // 2. Parse the incoming request
    const body = await req.json();
    const { image, mode = "html" } = body;

    // 3. Security Check: Did they send an image?
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 4. Smart Prompts (This gets you "Technical Depth" points)
    let systemPrompt = "";
    
    if (mode === "react") {
      // Prompt for React Code
      systemPrompt = `
        You are an expert React developer.
        Analyze the screenshot and generate a functional React component.
        Rules:
        - Use 'lucide-react' for icons.
        - Use Tailwind CSS for styling.
        - Return ONLY the JSX code.
        - No imports or exports, just the component code.
      `;
    } else {
      // Prompt for HTML Code (Default)
      systemPrompt = `
        You are an expert Frontend Developer.
        Analyze the screenshot and generate HTML/Tailwind code.
        Rules:
        - Use standard HTML tags and Tailwind classes.
        - Ensure mobile responsiveness.
        - Return ONLY the HTML code (divs, sections, etc) without <html> or <body> tags.
      `;
    }

    // 5. Handle Base64 Image
    const base64Data = image.split(",")[1] || image;

    // 6. Call Google Gemini
    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg",
        },
      },
    ]);

    const code = result.response.text();
    
    // 7. Clean the output (Remove markdown ``` symbols)
    const cleanCode = code.replace(/```(html|jsx|javascript|tsx)?/g, "").replace(/```/g, "").trim();

    // 8. Return the code to the Frontend
    return NextResponse.json({ code: cleanCode });

  } catch (error) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate code" }, { status: 500 });
  }
}