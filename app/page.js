"use client";
import { useState, useRef } from "react";
import {
  Cpu, Zap, Search, PenTool, Globe,
  Copy, Download, ChevronDown, Activity,
  Layers, Share2, Shield, CheckCircle2, AlertCircle
} from "lucide-react";

import DarkVeil from "./components/DarkVeil";

export default function App() {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [notification, setNotification] = useState(null);

  const scrollRef = useRef(null);

  const notify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

const typeEffect = (text) => {
  let i = 0;
  setDisplayText(text.charAt(0)); // ✅ force first char

  i = 1;

  const interval = setInterval(() => {
    setDisplayText((prev) => prev + text.charAt(i));
    i++;
    if (i >= text.length) clearInterval(interval);
  }, 5);
};

  const handleGenerate = async () => {
    if (!topic.trim()) {
      notify("Enter a topic", "error");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      setActiveStep(1);
      await new Promise(r => setTimeout(r, 500));

      setActiveStep(2);

      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ topic }),
      });

      const data = await res.json();

      if (data.error) throw new Error();

      setActiveStep(3);
      await new Promise(r => setTimeout(r, 400));

      setResult(data);
      typeEffect(data.blog);

      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 400);

      setActiveStep(0);

    } catch {
      notify("AI failed", "error");
      setActiveStep(0);
    }

    setLoading(false);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    notify("Copied!");
  };

  const downloadText = (text, name) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
  };

  return (
    <div className="min-h-screen text-white relative bg-transparent">

      {/* 🔥 DARKVEIL BACKGROUND - FIXED FULL SCREEN */}
      <div className="fixed inset-0 -z-20 w-full h-full">
        <DarkVeil
          hueShift={260}   // 🔥 PURPLE SHIFT
          noiseIntensity={0.2}
          scanlineIntensity={0.1}
          speed={2}
          scanlineFrequency={1.2}
          warpAmount={2.2}
        />
      </div>

      {/* 🔥 DARK OVERLAY - FOR READABILITY */}
      <div className="fixed inset-0 -z-10 w-full h-full bg-black/40 pointer-events-none"></div>

      {/* 🔔 Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded-xl flex gap-2 text-sm font-medium
        ${notification.type === "error" ? "bg-red-500/90 backdrop-blur" : "bg-purple-600/90 backdrop-blur"}`}>
          {notification.msg}
        </div>
      )}

      {/* 🔥 NAV */}
      <nav className="fixed top-0 w-full bg-black/40 backdrop-blur border-b border-purple-500/20 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-6 py-4">
          <div className="flex gap-2 items-center">
            <Cpu size={20} className="text-purple-400" />
            <span className="font-bold text-lg md:text-xl text-purple-300">AstraStudio</span>
          </div>

          <div className="hidden md:flex gap-6 text-gray-400 text-sm">
            {["Agents", "API", "Docs"].map(i => (
              <span key={i} className="hover:text-purple-300 cursor-pointer transition-colors">
                {i}
              </span>
            ))}
          </div>

          <div className="text-green-400 flex items-center gap-1 text-xs md:text-sm">
            <Activity size={14}/> LIVE
          </div>
        </div>
      </nav>

      {/* 🔥 HERO */}
      <div className="pt-24 md:pt-32 text-center px-4 md:px-6">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-purple-300 leading-tight">
          AI Content Orchestration
        </h1>

        <p className="text-sm md:text-base text-gray-400 mb-8 md:mb-10 max-w-2xl mx-auto">
          Multi-agent system powered by AI
        </p>

        {/* INPUT SECTION - RESPONSIVE */}
        <div className="max-w-2xl mx-auto bg-black/40 backdrop-blur p-2 md:p-3 rounded-2xl flex flex-col md:flex-row gap-2 border border-purple-500/20">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic..."
            className="flex-1 bg-transparent px-4 py-3 md:py-4 outline-none text-white placeholder-gray-500 text-base rounded-lg transition-all focus:ring-2 focus:ring-purple-500/50"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 px-4 md:px-6 py-3 md:py-4 rounded-xl font-medium text-white transition-all duration-200 text-sm md:text-base"
          >
            Generate
          </button>
        </div>

        {/* STEPS */}
        {loading && (
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[Search, PenTool, Globe].map((Icon, i) => (
              <div key={i} className="text-purple-400 flex justify-center">
                <Icon size={24} className="animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔥 OUTPUT */}
      {result && (
        <div ref={scrollRef} className="max-w-4xl mx-auto mt-12 md:mt-16 px-4 md:px-6 pb-12">

          {/* BLOG SECTION */}
          <div className="bg-black/40 backdrop-blur p-4 md:p-6 rounded-2xl border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 md:mb-6">
              <span className="text-gray-300 flex gap-2 items-center font-medium text-sm md:text-base">
                <Layers size={16} className="text-purple-400" /> Blog
              </span>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => copyText(result.blog)}
                  className="flex-1 md:flex-none bg-purple-600/40 hover:bg-purple-600/60 px-3 py-2 rounded-lg text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2 text-sm"
                  title="Copy blog text"
                >
                  <Copy size={16} />
                  <span className="hidden md:inline">Copy</span>
                </button>
                <button
                  onClick={() => downloadText(result.blog, "blog.txt")}
                  className="flex-1 md:flex-none bg-purple-600/40 hover:bg-purple-600/60 px-3 py-2 rounded-lg text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2 text-sm"
                  title="Download blog as text file"
                >
                  <Download size={16} />
                  <span className="hidden md:inline">Download</span>
                </button>
              </div>
            </div>

            <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm md:text-base">
              {displayText}
            </p>
          </div>

          {/* SOCIAL SECTION */}
          <div className="bg-black/40 backdrop-blur p-4 md:p-6 rounded-2xl mt-6 border border-purple-500/20 hover:border-purple-500/40 transition-all">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4 md:mb-3">
              <span className="flex gap-2 items-center text-gray-300 font-medium text-sm md:text-base">
                <Share2 size={16} className="text-purple-400" /> Social
              </span>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => copyText(result.social)}
                  className="flex-1 md:flex-none bg-purple-600/40 hover:bg-purple-600/60 px-3 py-2 rounded-lg text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2 text-sm"
                  title="Copy social content"
                >
                  <Copy size={16} />
                  <span className="hidden md:inline">Copy</span>
                </button>
                <button
                  onClick={() => downloadText(result.social, "social.txt")}
                  className="flex-1 md:flex-none bg-purple-600/40 hover:bg-purple-600/60 px-3 py-2 rounded-lg text-purple-300 hover:text-purple-200 transition-all flex items-center justify-center gap-2 text-sm"
                  title="Download social as text file"
                >
                  <Download size={16} />
                  <span className="hidden md:inline">Download</span>
                </button>
              </div>
            </div>

            <p className="text-gray-300 whitespace-pre-line leading-relaxed text-sm md:text-base">
              {result.social}
            </p>
          </div>

        </div>
      )}

      {/* FOOTER */}
      <footer className="text-center text-gray-500 text-xs md:text-sm mt-12 md:mt-20 px-4 py-6">
        © 2026 AstraStudio · Powered by Advanced AI Agents
      </footer>

    </div>
  );
}