import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, Lightbulb, Target, BarChart3, BookOpen, GraduationCap, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useSkills } from "@/hooks/use-profile";
import ReactMarkdown from "react-markdown";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickActions = [
  { label: "Recommend Courses", icon: GraduationCap, prompt: "Recommend the best online courses and tutorials for my skill gaps. Include free and paid options with links, difficulty levels, and time estimates." },
  { label: "Career Path", icon: Target, prompt: "Based on my profile, analyze my career path options. What roles am I closest to qualifying for? What's the most realistic next step?" },
  { label: "Skill Gaps", icon: BarChart3, prompt: "Analyze my current skills vs my dream goals. What are my biggest skill gaps and how should I prioritize filling them?" },
  { label: "Learning Roadmap", icon: Lightbulb, prompt: "Create a detailed 3-month learning roadmap for me with specific resources, milestones, and weekly goals." },
  { label: "Free Resources", icon: BookOpen, prompt: "Find me the best FREE tutorials, YouTube channels, and open-source resources to improve my weakest skills." },
  { label: "Projects to Build", icon: Code, prompt: "Suggest practical projects I should build to strengthen my portfolio and fill my skill gaps. Include difficulty and estimated time." },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`;

export default function Mentor() {
  const { user, session } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const { data: skills } = useSkills(user?.id);
  const isMobile = useIsMobile();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 **Welcome to SYNAPSE AI Mentor!**\n\nI'm your personal career intelligence assistant. I can:\n\n🎓 **Recommend courses & tutorials** from Coursera, Udemy, YouTube, and more\n📊 **Analyze your skill gaps** and prioritize what to learn\n🗺️ **Create learning roadmaps** tailored to your goals\n💼 **Guide your career path** with actionable steps\n\nTry the quick actions below or ask me anything!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isStreaming]);

  const userContext = {
    skills: skills?.map((s) => `${s.name} (${s.level}%)`).join(", ") || "",
    goals: profile?.dream_goals?.join(", ") || "",
    strengths: profile?.strengths?.join(", ") || "",
    weaknesses: profile?.weaknesses?.join(", ") || "",
  };

  const streamChat = async (chatMessages: ChatMessage[]) => {
    setIsStreaming(true);
    let assistantContent = "";

    try {
      if (!session?.access_token) {
        throw new Error("Please sign in again to use the AI Mentor.");
      }

      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: chatMessages.map((m) => ({ role: m.role, content: m.content })),
          userContext,
        }),
      });

      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Request failed (${resp.status})`);
      }

      if (!resp.body) throw new Error("No response body");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const assistantId = Date.now().toString();
      setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIdx: number;
        while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, newlineIdx);
          buffer = buffer.slice(newlineIdx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              assistantContent += delta;
              setMessages((prev) =>
                prev.map((m) => (m.id === assistantId ? { ...m, content: assistantContent } : m))
              );
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e: any) {
      console.error("AI Mentor error:", e);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: "assistant", content: `❌ **Error:** ${e.message || "Something went wrong."}` },
      ]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSend = (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content };
    setInput("");
    setMessages((prev) => [...prev, userMsg]);
    streamChat([...messages, userMsg]);
  };

  return (
    <div className={`max-w-3xl mx-auto flex flex-col ${isMobile ? "h-[calc(100vh-5rem)]" : "h-[calc(100vh-4rem)]"}`}>
      <div className="flex items-center gap-3 mb-3 sm:mb-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-foreground">AI Mentor</h1>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Personalized career intelligence & learning recommendations</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">Online</span>
        </div>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => handleSend(action.prompt)}
            disabled={isStreaming}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors whitespace-nowrap disabled:opacity-50"
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 mb-3 sm:mb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-card-foreground rounded-bl-md"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">SYNAPSE AI</span>
                  </div>
                )}
                <div className="prose prose-sm dark:prose-invert max-w-none [&_a]:text-primary [&_a]:underline">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isStreaming && messages[messages.length - 1]?.content === "" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-4">
            {[0, 1, 2].map((i) => (
              <span key={i} className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </motion.div>
        )}
      </div>

      <div className="flex gap-2 pb-2 sm:pb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about courses, career paths, tutorials..."
          className="bg-card border-border"
          disabled={isStreaming}
        />
        <Button onClick={() => handleSend()} disabled={isStreaming} className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-3 sm:px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
