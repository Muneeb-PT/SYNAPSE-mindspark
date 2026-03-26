import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"seeker" | "recruiter">("seeker");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isLogin) {
      const { error } = await login(email, password);
      if (error) { toast.error(error); setLoading(false); return; }
    } else {
      const { error } = await signup(email, password, name, role);
      if (error) { toast.error(error); setLoading(false); return; }
      toast.success("Account created! Check your email to confirm, or sign in now.");
    }
    setLoading(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-card" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="relative text-center px-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-8">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Welcome to Synapse</h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mx-auto">
            This system cares like a mother, teaches like a teacher, mentors like a guide, supports like a friend.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Synapse</span>
          </Link>

          <h1 className="text-2xl font-bold mb-1 text-foreground">{isLogin ? "Welcome back" : "Create your account"}</h1>
          <p className="text-muted-foreground mb-8 text-sm">
            {isLogin ? "Sign in to continue your journey" : "Start your AI-powered career journey"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                  <Input
                    type="text"
                    placeholder="Alex Chen"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-secondary border-border"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(["seeker", "recruiter"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          role === r
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        {r === "seeker" ? "🎯 Seeker" : "🏢 Recruiter"}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary border-border"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary border-border"
                required
                minLength={6}
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 h-11">
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
              {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-medium">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
