import { useState } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Search, Send, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Contact {
  id: string;
  name: string;
  role: string;
  lastMessage: string;
  online: boolean;
  matchScore: number;
}

const mockContacts: Contact[] = [
  { id: "1", name: "Sarah Miller", role: "Recruiter at TechFlow", lastMessage: "Let's schedule a chat!", online: true, matchScore: 92 },
  { id: "2", name: "James Park", role: "Mentor – Full Stack", lastMessage: "Great progress on React!", online: false, matchScore: 87 },
  { id: "3", name: "Emily Davis", role: "HR at DesignLab", lastMessage: "We have an opening...", online: true, matchScore: 78 },
];

export default function Chat() {
  const [activeContact, setActiveContact] = useState(mockContacts[0]);
  const [messages, setMessages] = useState([
    { id: "1", sender: "other", text: "Hi Alex! I saw your profile and I think you'd be a great fit for our frontend role." },
    { id: "2", sender: "me", text: "Thanks Sarah! I'd love to learn more about the position." },
    { id: "3", sender: "other", text: "Let's schedule a chat! Are you available this week?" },
  ]);
  const [input, setInput] = useState("");
  const [showAISuggest, setShowAISuggest] = useState(false);

  const aiSuggestions = [
    "Yes, I'm available Thursday or Friday afternoon!",
    "I'd love to! Could you share more about the team first?",
    "Absolutely — here's a link to my portfolio as well.",
  ];

  const handleSend = (text?: string) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now().toString(), sender: "me", text: msg }]);
    setInput("");
    setShowAISuggest(false);
  };

  return (
    <div className="max-w-5xl mx-auto flex h-[calc(100vh-4rem)] gap-4">
      {/* Contacts */}
      <div className="w-72 flex-shrink-0 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Messages</h2>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-8 h-8 text-xs bg-secondary border-border" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {mockContacts.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveContact(c)}
              className={`w-full p-3 flex items-center gap-3 text-left hover:bg-secondary/50 transition-colors ${
                activeContact.id === c.id ? "bg-secondary/50" : ""
              }`}
            >
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {c.name[0]}
                </div>
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-success border-2 border-card" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
              </div>
              <span className="text-xs font-medium text-primary">{c.matchScore}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 border border-border rounded-xl bg-card overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {activeContact.name[0]}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{activeContact.name}</p>
              <p className="text-xs text-muted-foreground">{activeContact.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-border"
            onClick={() => setShowAISuggest(!showAISuggest)}
          >
            <Sparkles className="w-3 h-3 mr-1" /> AI Assist
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === "me"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-secondary text-secondary-foreground rounded-bl-md"
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Suggestions */}
        {showAISuggest && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 pb-2"
          >
            <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" /> Suggested replies
            </p>
            <div className="flex flex-wrap gap-2">
              {aiSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s)}
                  className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 text-xs text-primary hover:bg-primary/10 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message..."
            className="bg-secondary border-border"
          />
          <Button onClick={() => handleSend()} className="bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
