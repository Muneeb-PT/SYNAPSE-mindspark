import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useProfile, useSkills } from "@/hooks/use-profile";
import { useCareerIntelligence } from "@/hooks/use-career-intelligence";
import { mockRoadmap, mockOpportunities } from "@/lib/mock-data";
import {
  Brain, TrendingUp, Target, Zap, ArrowRight, CheckCircle2, Circle, Sparkles, BookOpen,
  AlertTriangle, BarChart3, Shield,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 },
  }),
};

function DifficultyBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-destructive bg-destructive/10" : score >= 50 ? "text-warning bg-warning/10" : "text-success bg-success/10";
  const label = score >= 80 ? "Hard" : score >= 50 ? "Moderate" : "Achievable";
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${color}`}>{label} ({score}%)</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const color = priority === "critical" ? "text-destructive bg-destructive/10" : priority === "important" ? "text-warning bg-warning/10" : "text-muted-foreground bg-muted";
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${color}`}>{priority}</span>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: skills = [] } = useSkills();
  const roadmap = mockRoadmap;

  const { confidenceMetrics, realityChecks, skillGaps } = useCareerIntelligence(
    skills,
    profile?.dream_goals,
    profile?.strengths,
  );

  // Redirect to onboarding if profile is empty (new user)
  if (!isLoading && profile && !profile.headline && !profile.bio && skills.length === 0) {
    return <Navigate to="/onboarding" replace />;
  }

  const completedTasks = roadmap.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const totalTasks = roadmap.flatMap((m) => m.tasks).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  const profileComplete = Math.min(100, Math.round(
    (profile?.name ? 10 : 0) + (profile?.headline ? 10 : 0) + (profile?.bio ? 10 : 0) +
    (profile?.location ? 10 : 0) + (skills.length > 0 ? 15 : 0) + 15 + 15 + 15
  ));

  const stats = [
    { label: "Profile Complete", value: `${profileComplete}%`, icon: Target, color: "text-primary" },
    { label: "Roadmap Progress", value: `${overallProgress}%`, icon: TrendingUp, color: "text-success" },
    { label: "Skill Gaps", value: `${skillGaps.length}`, icon: AlertTriangle, color: "text-warning" },
    { label: "Goals Tracked", value: `${realityChecks.length}`, icon: Zap, color: "text-accent" },
  ];

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <motion.div variants={fadeUp} custom={0}>
        <h1 className="text-xl sm:text-2xl font-bold text-foreground">
          Welcome back, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">Here's your career intelligence overview</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp} custom={i + 1}
            className="p-4 sm:p-5 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
              <span className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Skill Confidence Metrics + Reality Check */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Skill Confidence */}
        <motion.div variants={fadeUp} custom={5}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Skill Confidence</h2>
            </div>
            {confidenceMetrics.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">Add skills to see your confidence metrics.</p>
                <Link to="/profile" className="text-sm text-primary hover:underline">Go to Profile →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {confidenceMetrics.slice(0, 6).map((metric) => (
                  <div key={metric.skill}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-foreground">{metric.skill}</span>
                      <span className={`text-xs font-medium ${metric.color}`}>{metric.label}</span>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.level}%` }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      />
                    </div>
                  </div>
                ))}
                {confidenceMetrics.length > 6 && (
                  <Link to="/profile" className="text-xs text-primary hover:underline">
                    View all {confidenceMetrics.length} skills →
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Reality Check */}
        <motion.div variants={fadeUp} custom={6}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-warning" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Reality Check</h2>
            </div>
            {realityChecks.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">Set dream goals in your profile to see reality checks.</p>
                <Link to="/onboarding" className="text-sm text-primary hover:underline">Complete Onboarding →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {realityChecks.map((check) => (
                  <div key={check.goalLabel} className="p-3 rounded-lg bg-secondary/30 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-foreground">{check.goalLabel}</h3>
                      <DifficultyBadge score={check.difficultyScore} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>⏱ {check.timeEstimate}</span>
                      <span>🎯 {check.readiness}% ready</span>
                    </div>
                    <Progress value={check.readiness} className="h-1.5" />
                    {check.missingSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {check.missingSkills.slice(0, 3).map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-destructive/10 text-destructive text-[10px]">⚠ {s}</span>
                        ))}
                        {check.missingSkills.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">+{check.missingSkills.length - 3} more</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Skill Gap Analysis */}
      {skillGaps.length > 0 && (
        <motion.div variants={fadeUp} custom={7}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Skill Gap Analysis</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillGaps.slice(0, 6).map((gap) => (
                <div key={gap.skill} className="p-3 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{gap.skill}</span>
                    <PriorityBadge priority={gap.priority} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1.5">
                    <span>Current: {gap.current}%</span>
                    <ArrowRight className="w-3 h-3" />
                    <span>Needed: {gap.required}%</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-muted-foreground/30"
                      style={{ width: `${gap.required}%` }}
                    />
                    <div
                      className="h-full rounded-full bg-primary absolute top-0 left-0"
                      style={{ width: `${gap.current}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* AI Mentor + Roadmap */}
      <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div variants={fadeUp} custom={8} className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">AI Mentor Insight</h2>
            </div>
            <div className="p-3 sm:p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="text-sm text-secondary-foreground leading-relaxed">
                {skillGaps.length > 0
                  ? `I've identified ${skillGaps.length} skill gap${skillGaps.length > 1 ? "s" : ""} across your goals. ${
                      skillGaps[0]?.priority === "critical"
                        ? `Your most critical gap is in **${skillGaps[0].skill}** — I recommend focusing there first.`
                        : `Start with ${skillGaps[0]?.skill} to make the biggest impact on your readiness.`
                    }`
                  : "Complete your profile and add skills to get personalized career intelligence and recommendations."
                }
              </p>
              <Link to="/mentor" className="inline-flex items-center gap-1 text-primary text-sm font-medium mt-3 hover:underline">
                Talk to AI Mentor <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={9}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6 h-full">
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Your Profile</h2>
            {profile?.personality_tags && profile.personality_tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {profile.personality_tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">Complete your profile to see personality insights.</p>
            )}
            <Link to="/profile" className="text-sm text-primary hover:underline font-medium">
              View full profile →
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Roadmap + Matches */}
      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        <motion.div variants={fadeUp} custom={10}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Current Roadmap</h2>
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
                  {task.completed ? <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" /> : <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  <span className={task.completed ? "text-muted-foreground line-through" : "text-foreground"}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={11}>
          <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-warning" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Top Matches</h2>
            </div>
            <div className="space-y-3">
              {mockOpportunities.map((opp) => (
                <div key={opp.id} className="p-3 rounded-lg border border-border hover:border-primary/20 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-medium text-foreground">{opp.title}</h3>
                    <span className="text-xs font-semibold text-primary">{opp.matchScore}% match</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opp.company}</p>
                  <div className="flex gap-1.5 mt-2 flex-wrap">
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
