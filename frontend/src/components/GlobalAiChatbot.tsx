import React, { useState, useRef, useEffect } from "react";
import { X, Send, Sparkles, Image as ImageIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AiApi } from '@/lib/api-client';
import { AiRichMessageRenderer } from "./AiRichMessageRenderer";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
}

const AI_IMAGE = "/assets/images/123.jpg";

const RobotHead = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C11.4 2 11 2.4 11 3V4H8C5.8 4 4 5.8 4 8V17C4 19.2 5.8 21 8 21H16C18.2 21 20 19.2 20 17V8C20 5.8 18.2 4 16 4H13V3C13 2.4 12.6 2 12 2ZM8 10C8.8 10 9.5 10.7 9.5 11.5C9.5 12.3 8.8 13 8 13C7.2 13 6.5 12.3 6.5 11.5C6.5 10.7 7.2 10 8 10ZM16 10C16.8 10 17.5 10.7 17.5 11.5C17.5 12.3 16.8 13 16 13C15.2 13 14.5 12.3 14.5 11.5C14.5 10.7 15.2 10 16 10ZM12 15C13.7 15 15 16.3 15 18H9C9 16.3 10.3 15 12 15Z" />
    <path d="M2 10C2 9.4 2.4 9 3 9H4V15H3C2.4 15 2 14.6 2 14V10ZM20 9H21C21.6 9 22 9.4 22 10V14C22 14.6 21.6 15 21 15H20V9Z" fillOpacity="0.6" />
  </svg>
);

export default function GlobalAiChatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState("");

  const getRole = () => {
    const path = (location.pathname || "").toLowerCase();
    if (
      path === "/" ||
      path.startsWith("/login") ||
      path.startsWith("/register") ||
      path.startsWith("/auth") ||
      path.startsWith("/forgot")
    ) {
      return "GUEST";
    }
    if (path.startsWith("/admin")) return "ADMIN";
    if (path.startsWith("/instructor")) return "INSTRUCTOR";
    if (path.startsWith("/student")) return "STUDENT";
    return "GUEST";
  };

  const currentRole = getRole();

  // Re-evaluate user identity on every route change; NEVER use cached storage names on GUEST/login/register pages
  useEffect(() => {
    if (currentRole === "GUEST") {
      setUserName("");
      return;
    }
    try {
      const token =
        sessionStorage.getItem("labtrack_token") ||
        localStorage.getItem("labtrack_token") ||
        localStorage.getItem("labtrack_access_token") ||
        localStorage.getItem("jrmsu_labtrack_auth_token");
      const raw = sessionStorage.getItem("labtrack_user") || localStorage.getItem("labtrack_user");
      if (raw && (token || currentRole === "STUDENT")) {
        const parsed = JSON.parse(raw);
        const name = parsed.fullName || parsed.name || parsed.username || parsed.email?.split("@")[0] || "";
        // Ignore placeholder test strings like "xc" unless actually logged in as admin
        if (name && name.toLowerCase() !== "xc") {
          setUserName(name);
        } else {
          setUserName("");
        }
      } else {
        setUserName("");
      }
    } catch {
      setUserName("");
    }
  }, [location.pathname, currentRole]);

  // Reset conversation when switching between pages so each page has its own private AI context
  useEffect(() => {
    const path = (location.pathname || "/").toLowerCase();
    const nameStr = currentRole !== "GUEST" && userName ? ` ${userName}` : "";
    let greeting = "";

    if (path.startsWith("/register")) {
      greeting = "Hi there! Welcome to the JRMSU LabTrack Registration Page. I am your LabTrack AI Assistant. Need help creating your account or logging in?";
    } else if (path.startsWith("/login")) {
      greeting = "Hi there! Welcome to the JRMSU LabTrack Login Portal. I am your LabTrack AI Assistant. Ask me anything or let me help you sign in!";
    } else if (currentRole === "ADMIN") {
      greeting = `Hi Admin${nameStr}! I am your private Admin LabTrack AI Assistant. How can I help you manage the system today?`;
    } else if (currentRole === "INSTRUCTOR") {
      greeting = `Hi Instructor${nameStr}! I am your private Instructor LabTrack AI Assistant. How can I assist you with your classes and labs today?`;
    } else if (currentRole === "STUDENT") {
      greeting = `Hi Student${nameStr}! I am your private Student LabTrack AI Assistant. Ask me any question, check lab availability, or request media!`;
    } else {
      greeting = "Hi there! Welcome to JRMSU LabTrack. I am your LabTrack AI Assistant. How can I help you today?";
    }

    setMessages([{ id: "init-" + path, role: "bot", text: greeting }]);
  }, [location.pathname, currentRole, userName]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendPromptText = async (promptText: string) => {
    if (!promptText.trim() || isTyping) return;
    const cleanPrompt = promptText.trim();
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: cleanPrompt };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const safePathKey = (location.pathname || "/").replace(/[^a-zA-Z0-9]/g, "_");
      const storageKey = `labtrack_ai_sid_${currentRole}_${safePathKey}`;
      let sid = sessionStorage.getItem(storageKey);
      if (!sid) {
        sid = `private-${currentRole.toLowerCase()}-${safePathKey}-${Date.now()}`;
        sessionStorage.setItem(storageKey, sid);
      }

      let botResponseText = "";
      try {
        const aiResult = await AiApi.chat({
          prompt: cleanPrompt,
          sessionId: sid,
          role: currentRole,
          userName: currentRole === "GUEST" ? "" : userName,
          path: location.pathname,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
        });
        botResponseText = aiResult.response || "I have processed your request.";
      } catch {
        botResponseText = "I'm having trouble connecting to the AI backend right now. (Check if C# and Python servers are running).";
      }

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: botResponseText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendPromptText(input);
  };

  const handleQuickImageRequest = () => {
    const trimmed = input.trim();
    if (trimmed) {
      sendPromptText("Show me a picture of " + trimmed);
    } else {
      sendPromptText("Bigyan mo ako ng pic ng UI/UX ng system page kung saan ako ngayon");
    }
  };

  return (
    <>
      <style>{`
        @keyframes ai-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes ai-ring-pulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .ai-btn-float {
          animation: ai-float 3s ease-in-out infinite;
        }
        .ai-ring {
          animation: ai-ring-pulse 2s ease-out infinite;
        }
      `}</style>

      <div
        data-ai-floating-root="true"
        className={`fixed z-[9999] flex flex-col items-end gap-2 sm:gap-3 right-4 sm:right-6 ${
          currentRole === "STUDENT" ? "bottom-16 sm:bottom-6" : "bottom-6"
        }`}
      >
        {isOpen && (
          <div
            className="w-[calc(100vw-2rem)] sm:w-[390px] max-w-[410px] h-[520px] max-h-[calc(100dvh-150px)] sm:max-h-[570px] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-600/50 relative animate-in slide-in-from-bottom-5 fade-in duration-200"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${AI_IMAGE}')` }}
            ></div>

            <div className="absolute inset-0 bg-slate-950/85"></div>

            <div className="relative z-10 flex flex-col h-full w-full">
              <div className="shrink-0 bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-slate-600/50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full border-2 border-cyan-400/50 shadow-lg shrink-0 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                    <RobotHead className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-white font-extrabold text-sm leading-tight">
                      LabTrack AI Assistant <Sparkles className="w-3 h-3 text-amber-400 inline" />
                    </p>
                    <p className="text-cyan-200 text-[10px] sm:text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      {currentRole === "GUEST" ? "Guest / Auth Guide" : `${currentRole} Private Mode`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {m.role === "bot" && (
                      <div className="w-6 h-6 rounded-full shrink-0 mr-2 mt-0.5 border border-cyan-400/40 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                        <RobotHead className="w-4 h-4 text-cyan-400" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] sm:max-w-[80%] px-3 py-2 rounded-2xl text-[11px] sm:text-xs leading-relaxed ${
                        m.role === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-sm shadow-lg"
                          : "bg-slate-800/95 backdrop-blur-md text-slate-100 border border-slate-600/50 rounded-tl-sm shadow-sm"
                      }`}
                    >
                      <AiRichMessageRenderer text={m.text} />
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="w-6 h-6 rounded-full shrink-0 mr-2 mt-0.5 border border-cyan-400/40 bg-gradient-to-b from-slate-700 to-slate-900 flex items-center justify-center">
                      <RobotHead className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-2xl rounded-tl-sm px-3 sm:px-4 py-2 sm:py-3">
                      <div className="flex gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSend}
                className="shrink-0 p-2 sm:p-3 bg-slate-900/90 backdrop-blur-lg border-t border-slate-600/50 flex items-center gap-1.5"
              >
                <button
                  type="button"
                  onClick={handleQuickImageRequest}
                  disabled={isTyping}
                  title="Capture UI/UX or Request Picture"
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-600/80 rounded-2xl transition flex items-center justify-center shrink-0 cursor-pointer active:scale-95"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <div className="relative flex-1 flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask any question, music, video, or pic..."
                    className="w-full bg-slate-800/90 border border-slate-600/80 text-white text-[16px] sm:text-xs rounded-2xl px-3.5 py-2.5 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder-slate-400 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="p-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0 active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ai-btn-float bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white border-2 border-cyan-400/50 cursor-pointer"
          style={{ boxShadow: "0 10px 30px rgba(59, 130, 246, 0.5)" }}
          title="Ask LabTrack AI Assistant"
        >
          <span className="absolute inset-0 rounded-full ai-ring pointer-events-none z-10"></span>
          <RobotHead className="w-7 h-7 sm:w-9 sm:h-9 relative z-20 drop-shadow-md" />
        </button>
      </div>
    </>
  );
}


