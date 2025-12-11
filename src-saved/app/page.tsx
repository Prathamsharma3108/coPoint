"use client";

import { useState } from "react";
import CodePreview from "@/components/CodePreview";
import { Loader2, UploadCloud, Code, Image as ImageIcon, Eye, FileCode } from "lucide-react";

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"html" | "react">("html");
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const generateCode = async () => {
    if (!image) return;
    setLoading(true);
    setCode(""); 

    try {
      console.log("🚀 Sending request to backend...");
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image, mode }),
      });

      const data = await res.json();
      console.log("✅ Data received:", data); // Check your browser console for this!

      if (data.code) {
        setCode(data.code);
        setActiveTab("preview"); // Switch to preview automatically
      }
    } catch (error) {
      console.error("❌ Error generating code:", error);
      alert("Something went wrong. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8 font-sans">
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Code className="text-blue-600" /> RepliCode
        </h1>
        <div className="flex gap-2 bg-white p-1 rounded-lg border shadow-sm">
          <button onClick={() => setMode("html")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${mode === "html" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>HTML</button>
          <button onClick={() => setMode("react")} className={`px-4 py-1.5 text-sm font-medium rounded-md transition ${mode === "react" ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>React</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 h-[800px]">
        
        {/* LEFT: Upload */}
        <div className="flex flex-col gap-6">
          <div className="flex-1 border-2 border-dashed border-gray-300 rounded-2xl bg-white flex flex-col items-center justify-center p-8 relative hover:border-blue-400 transition group">
            {!image ? (
              <>
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                </div>
                <p className="text-lg font-medium text-gray-700">Upload a screenshot</p>
              </>
            ) : (
              <img src={image} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg shadow-sm" />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>

          <button
            onClick={generateCode}
            disabled={!image || loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-lg font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 className="animate-spin" /> Generating...</> : "Generate Code 🚀"}
          </button>
        </div>

        {/* RIGHT: Output (Preview + Code) */}
        <div className="flex-1 bg-white border rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex border-b">
            <button 
              onClick={() => setActiveTab("preview")}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'preview' ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              <Eye className="w-4 h-4" /> Live Preview
            </button>
            <button 
              onClick={() => setActiveTab("code")}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'code' ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              <FileCode className="w-4 h-4" /> Raw Code
            </button>
          </div>

          <div className="flex-1 relative bg-gray-100 overflow-auto">
            {code ? (
              activeTab === "preview" ? (
                <CodePreview code={code} mode={mode} />
              ) : (
                <pre className="p-4 text-xs font-mono text-gray-800 whitespace-pre-wrap">{code}</pre>
              )
            ) : (
              <div className="flex-1 h-full flex flex-col items-center justify-center text-gray-400">
                <ImageIcon className="w-16 h-16 mb-4 opacity-20" />
                <p>Output will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}