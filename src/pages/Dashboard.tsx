import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { mockSeekerProfile, mockRoadmap, mockOpportunities } from "@/lib/mock-data";
import {
  Brain,
  TrendingUp,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Circle,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

export default function Dashboard() {
  const { user } = useAuth();
  const profile = mockSeekerProfile;
  const roadmap = mockRoadmap;

  const completedTasks = roadmap.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const totalTasks = roadmap.flatMap((m) => m.tasks).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  const stats = [
    { label: "Profile Complete", value: `${profile.completionPercent}%`, icon: Target, color: "text-primary" },
    { label: "Roadmap Progress", value: `${overallProgress}%`, icon: TrendingUp, color: "text-success" },
    { label: "AI Interactions", value: "24", icon: Brain, color: "text-accent" },
    { label: "Match Score", value: "92%", icon: Zap, color: "text-warning" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div variants={fadeUp} custom={0}>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your career intelligence overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            custom={i + 1}
            className="p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Insight */}
        <motion.div variants={fadeUp} custom={5} className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">AI Mentor Insight</h2>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                Based on your profile, you're leaning toward <strong>Product Engineering</strong> — a role that combines
                your analytical thinking with creative design skills. Your React proficiency is in the top 20%
                of learners at your stage. Focus on System Design this week to accelerate your growth.
              </p>
              <Link to="/mentor" className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline">
                Talk to AI Mentor <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Personality Tags */}
        <motion.div variants={fadeUp} custom={6}>
          <div className="rounded-xl border border-border bg-card p-6 h-full">
            <h2 className="text-lg font-semibold text-foreground mb-4">Personality Profile</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.personalityTags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
            <Link to="/profile" className="text-sm text-primary hover:underline font-medium">
              View full profile →
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Roadmap Preview */}
        <motion.div variants={fadeUp} custom={7}>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Current Roadmap</h2>
              </div>
              <Link to="/roadmap" className="text-xs text-primary hover:underline">View all</Link>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium text-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="space-y-2">
              {roadmap[0].tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-2 text-sm">
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Opportunities */}
        <motion.div variants={fadeUp} custom={8}>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-warning" />
              <h2 className="text-lg font-semibold text-foreground">Top Matches</h2>
            </div>
            <div className="space-y-3">
              {mockOpportunities.map((opp) => (
                <div key={opp.id} className="p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground">{opp.title}</h3>
                    <span className="text-xs font-semibold text-primary">{opp.matchScore}% match</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opp.company}</p>
                  <div className="flex gap-1.5 mt-2">
                    {opp.skills.slice(0, 3).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-secondary text-xs text-secondary-foreground">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
