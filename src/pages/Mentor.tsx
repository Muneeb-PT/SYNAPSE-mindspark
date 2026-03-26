import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, Lightbulb, Target, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiMentorQuestions, aiResponses, ChatMessage } from "@/lib/mock-data";

const quickActions = [
  { label: "Career Suggestions", icon: Target, key: "career" },
  { label: "Skill Gap Analysis", icon: BarChart3, key: "skill_gap" },
  { label: "Generate Roadmap", icon: Lightbulb, key: "roadmap" },
];

export default function Mentor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "ai", content: aiResponses.greeting, timestamp: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const addAIResponse = (key?: string) => {
    setIsTyping(true);
    setTimeout(() => {
      const content = key && aiResponses[key] ? aiResponses[key] : aiResponses.default;
      const followUp = questionIndex < aiMentorQuestions.length
        ? `\n\n💡 **Quick question:** ${aiMentorQuestions[questionIndex]}`
        : "";
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "ai", content: content + followUp, timestamp: new Date() },
      ]);
      setQuestionIndex((i) => i + 1);
      setIsTyping(false);
    }, 1200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", content: input, timestamp: new Date() },
    ]);
    setInput("");
    addAIResponse();
  };

  const handleQuickAction = (key: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", content: quickActions.find((a) => a.key === key)?.label || key, timestamp: new Date() },
    ]);
    addAIResponse(key);
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Brain className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-foreground">AI Mentor</h1>
          <p className="text-xs text-muted-foreground">Your personal career intelligence</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success">Online</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-2 mb-4">
        {quickActions.map((action) => (
          <button
            key={action.key}
            onClick={() => handleQuickAction(action.key)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card border border-border text-card-foreground rounded-bl-md"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-xs font-medium text-primary">Synapse AI</span>
                  </div>
                )}
                <div className="whitespace-pre-wrap">{msg.content}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-1 p-4">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="w-2 h-2 rounded-full bg-primary/40 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2 pb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask your AI Mentor anything..."
          className="bg-card border-border"
        />
        <Button onClick={handleSend} className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-4">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
