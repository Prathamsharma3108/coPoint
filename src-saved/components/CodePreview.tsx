"use client";
import React, { useEffect, useRef } from 'react';

interface CodePreviewProps {
  code: string;
  mode: 'html' | 'react';
}

export default function CodePreview({ code, mode }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        // We inject Tailwind via CDN so the preview looks right immediately
        const content = `
          <!DOCTYPE html>
          <html>
            <head>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>body { margin: 0; padding: 20px; }</style>
            </head>
            <body>
              ${code}
            </body>
          </html>
        `;
        doc.open();
        doc.write(content);
        doc.close();
      }
    }
  }, [code]);

  return (
    <div className="w-full h-full min-h-[500px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Live Preview
        </span>
        <div className="flex gap-2">
           <div className="w-3 h-3 rounded-full bg-red-400"></div>
           <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
           <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
      </div>
      <iframe 
        ref={iframeRef} 
        className="w-full h-full border-none" 
        title="Preview" 
        sandbox="allow-scripts" // Security: Prevents malicious code execution
      />
    </div>
  );
}