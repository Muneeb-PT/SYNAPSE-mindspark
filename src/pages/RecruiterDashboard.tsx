import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/hooks/use-profile";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Brain, Users, Briefcase, TrendingUp, Zap, MessageSquare,
  ChevronDown, ChevronUp, Sparkles, Shield, Target, Eye,
  BookOpen, GraduationCap, ArrowRight, Star, Filter, X,
  Lightbulb, BarChart3, Heart, Clock, Rocket, Award,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.45 },
  }),
};

// ─── Mock Candidate Data (rich profiles) ───
const mockCandidates = [
  {
    id: "c1", name: "Arjun Mehta", avatar: "A",
    careerGoal: "Backend Developer", location: "Bangalore",
    skills: { Python: 82, "Node.js": 75, SQL: 70, Docker: 55, "System Design": 40 },
    interests: ["Backend Systems", "Cloud Infrastructure", "Open Source"],
    personality: { collaboration: 85, leadership: 60, communication: 72, adaptability: 80 },
    strengths: ["Logical thinking", "Problem solving", "Persistence"],
    weaknesses: ["Public speaking", "Documentation"],
    dreamGoals: ["Senior Backend Engineer", "Tech Lead"],
    learningStyle: "hands-on", teamOrSolo: "team",
    pressureTolerance: "high", growthTrajectory: "rising",
    journeyNotes: [
      { date: "Jan 2025", event: "Started learning Python" },
      { date: "Apr 2025", event: "Built first REST API" },
      { date: "Sep 2025", event: "Shifted interest from frontend to backend" },
      { date: "Jan 2026", event: "Completed Docker certification" },
    ],
    roadmapCompletion: 68,
    status: "actively_looking",
  },
  {
    id: "c2", name: "Priya Sharma", avatar: "P",
    careerGoal: "Full Stack Developer", location: "Mumbai",
    skills: { React: 88, TypeScript: 80, "Node.js": 65, PostgreSQL: 55, AWS: 35 },
    interests: ["Web Development", "UI/UX", "Startups"],
    personality: { collaboration: 92, leadership: 75, communication: 88, adaptability: 90 },
    strengths: ["Creativity", "Communication", "Fast learner"],
    weaknesses: ["Backend depth", "DevOps"],
    dreamGoals: ["Full Stack Lead", "Startup CTO"],
    learningStyle: "visual", teamOrSolo: "team",
    pressureTolerance: "medium", growthTrajectory: "accelerating",
    journeyNotes: [
      { date: "Mar 2025", event: "Mastered React fundamentals" },
      { date: "Jun 2025", event: "Built e-commerce platform" },
      { date: "Oct 2025", event: "Started learning Node.js" },
      { date: "Feb 2026", event: "Contributed to open-source project" },
    ],
    roadmapCompletion: 74,
    status: "open_to_work",
  },
  {
    id: "c3", name: "Rahul Verma", avatar: "R",
    careerGoal: "Data Scientist", location: "Delhi",
    skills: { Python: 70, "Machine Learning": 45, SQL: 60, Statistics: 55, "Data Viz": 40 },
    interests: ["AI/ML", "Data Analytics", "Research"],
    personality: { collaboration: 65, leadership: 45, communication: 58, adaptability: 72 },
    strengths: ["Analytical thinking", "Curiosity", "Math aptitude"],
    weaknesses: ["Team coordination", "Presentation skills"],
    dreamGoals: ["ML Engineer", "Research Scientist"],
    learningStyle: "reading", teamOrSolo: "solo",
    pressureTolerance: "medium", growthTrajectory: "steady",
    journeyNotes: [
      { date: "Feb 2025", event: "Started statistics course" },
      { date: "Jul 2025", event: "First ML project completed" },
      { date: "Dec 2025", event: "Kaggle competition - top 20%" },
      { date: "Mar 2026", event: "Exploring deep learning" },
    ],
    roadmapCompletion: 42,
    status: "casually_browsing",
  },
  {
    id: "c4", name: "Sneha Patel", avatar: "S",
    careerGoal: "DevOps Engineer", location: "Pune",
    skills: { Docker: 72, Kubernetes: 50, Linux: 80, Python: 60, CI_CD: 65 },
    interests: ["Cloud Infrastructure", "Automation", "Security"],
    personality: { collaboration: 78, leadership: 68, communication: 70, adaptability: 85 },
    strengths: ["Systematic approach", "Reliability", "Detail-oriented"],
    weaknesses: ["Creative thinking", "Rapid prototyping"],
    dreamGoals: ["SRE Lead", "Cloud Architect"],
    learningStyle: "hands-on", teamOrSolo: "both",
    pressureTolerance: "high", growthTrajectory: "rising",
    journeyNotes: [
      { date: "May 2025", event: "Linux administration mastery" },
      { date: "Aug 2025", event: "First Kubernetes deployment" },
      { date: "Nov 2025", event: "Automated CI/CD pipeline" },
      { date: "Feb 2026", event: "AWS Solutions Architect exam prep" },
    ],
    roadmapCompletion: 58,
    status: "open_to_work",
  },
  {
    id: "c5", name: "Karan Singh", avatar: "K",
    careerGoal: "Frontend Developer", location: "Hyderabad",
    skills: { React: 55, CSS: 70, JavaScript: 65, "UI Design": 50, Testing: 30 },
    interests: ["Design Systems", "Accessibility", "Animation"],
    personality: { collaboration: 88, leadership: 50, communication: 80, adaptability: 92 },
    strengths: ["Empathy", "Design sense", "Attention to detail"],
    weaknesses: ["Algorithm skills", "Backend knowledge"],
    dreamGoals: ["Senior Frontend Engineer", "Design Engineer"],
    learningStyle: "visual", teamOrSolo: "team",
    pressureTolerance: "low", growthTrajectory: "accelerating",
    journeyNotes: [
      { date: "Jun 2025", event: "Completed CSS animation course" },
      { date: "Sep 2025", event: "Built portfolio with React" },
      { date: "Jan 2026", event: "Learning accessibility standards" },
      { date: "Mar 2026", event: "Contributing to design system library" },
    ],
    roadmapCompletion: 45,
    status: "actively_looking",
  },
];

// ─── Fit Score Engine ───
interface FitBreakdown {
  skillMatch: number;
  interestAlignment: number;
  personalityFit: number;
  growthPotential: number;
  total: number;
  whyMatched: string;
  isUnderdog: boolean;
}

function computeFitScore(
  candidate: typeof mockCandidates[0],
  requiredSkills: string[],
  preferredTraits: string[],
  workStyle: string,
): FitBreakdown {
  // Skill match (30%)
  const skillScores = requiredSkills.map((s) => {
    const key = Object.keys(candidate.skills).find(
      (k) => k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()),
    );
    return key ? (candidate.skills as Record<string, number>)[key] || 0 : 0;
  });
  const avgSkill = skillScores.length > 0 ? skillScores.reduce((a, b) => a + b, 0) / skillScores.length : 50;
  const skillMatch = Math.min(100, Math.round(avgSkill));

  // Interest alignment (30%)
  const interestOverlap = candidate.interests.filter((interest) =>
    requiredSkills.some((s) => interest.toLowerCase().includes(s.toLowerCase())) ||
    candidate.careerGoal.toLowerCase().includes("backend") ||
    candidate.careerGoal.toLowerCase().includes("developer"),
  ).length;
  const interestAlignment = Math.min(100, Math.round((interestOverlap / Math.max(candidate.interests.length, 1)) * 100 + 20));

  // Personality fit (20%)
  const traitScore = preferredTraits.reduce((sum, trait) => {
    const matching = candidate.strengths.some((s) => s.toLowerCase().includes(trait.toLowerCase()));
    return sum + (matching ? 30 : 0);
  }, 0);
  const personalityAvg = (candidate.personality.collaboration + candidate.personality.communication + candidate.personality.adaptability) / 3;
  const personalityFit = Math.min(100, Math.round(personalityAvg * 0.6 + traitScore * 0.4));

  // Growth potential (20%)
  const trajectoryBonus = candidate.growthTrajectory === "accelerating" ? 25 : candidate.growthTrajectory === "rising" ? 15 : 5;
  const styleMatch = (workStyle === "team" && candidate.teamOrSolo === "team") || (workStyle === "independent" && candidate.teamOrSolo === "solo") || candidate.teamOrSolo === "both" ? 15 : 0;
  const growthPotential = Math.min(100, Math.round(candidate.roadmapCompletion * 0.4 + trajectoryBonus + styleMatch + 20));

  const total = Math.round(skillMatch * 0.3 + interestAlignment * 0.3 + personalityFit * 0.2 + growthPotential * 0.2);

  // Underdog: meets minimum (>40% skill) but not top
  const meetsMinimum = skillMatch >= 40;
  const isUnderdog = meetsMinimum && skillMatch < 65 && growthPotential >= 55;

  // Generate explanation
  const reasons: string[] = [];
  if (skillMatch >= 60) reasons.push(`strong ${requiredSkills[0] || "technical"} skills`);
  if (interestAlignment >= 60) reasons.push("aligned career interests");
  if (personalityFit >= 70) reasons.push("great personality fit");
  if (growthPotential >= 65) reasons.push("high growth potential");
  if (candidate.personality.collaboration >= 80) reasons.push("excellent collaborator");
  if (isUnderdog) reasons.push("high potential despite developing skills");
  const whyMatched = reasons.length > 0
    ? `${reasons.slice(0, 3).join(" + ")} — ${candidate.growthTrajectory} trajectory`
    : "Meets baseline requirements with room to grow";

  return { skillMatch, interestAlignment, personalityFit, growthPotential, total, whyMatched, isUnderdog };
}

// ─── Team Compatibility ───
const existingTeam = {
  collaboration: 75, leadership: 70, communication: 68, adaptability: 72,
};

function getTeamCompatibility(candidate: typeof mockCandidates[0]) {
  const traits = candidate.personality;
  const complements: string[] = [];
  if (traits.collaboration > existingTeam.collaboration) complements.push("Boosts team collaboration");
  if (traits.leadership > existingTeam.leadership) complements.push("Strengthens leadership");
  if (traits.communication > existingTeam.communication) complements.push("Enhances communication");
  if (traits.adaptability > existingTeam.adaptability) complements.push("Increases adaptability");

  const compatScore = Math.round(
    (Math.min(100, traits.collaboration * 0.3 + traits.communication * 0.3 + traits.adaptability * 0.2 + traits.leadership * 0.2) + 10),
  );

  return {
    score: Math.min(100, compatScore),
    complements: complements.length > 0 ? complements : ["Aligns with current team dynamic"],
    verdict: compatScore >= 75 ? "Strong complement" : compatScore >= 55 ? "Good fit" : "Needs consideration",
  };
}

// ─── Interaction Insights (mock) ───
const interactionInsights = [
  { text: "Candidates drop off when response time exceeds 24 hours", icon: Clock, severity: "warning" as const },
  { text: "Mentor-style communication increases engagement by 40%", icon: Heart, severity: "success" as const },
  { text: "Candidates with growth mindset respond 3x faster to opportunities", icon: Rocket, severity: "info" as const },
  { text: "Team-oriented candidates prefer collaborative interview formats", icon: Users, severity: "info" as const },
  { text: "83% of high-potential candidates value learning opportunities over salary", icon: GraduationCap, severity: "success" as const },
];

// ─── System Guidance (AI co-pilot, not chatbot) ───
function getSystemGuidance(style: string, candidates: typeof mockCandidates) {
  const underdogs = candidates.filter((c) => {
    const avgSkill = Object.values(c.skills).reduce((a, b) => a + b, 0) / Object.values(c.skills).length;
    return avgSkill < 65 && c.growthTrajectory !== "steady";
  });

  const insights = [
    {
      text: "Candidates aligned with collaborative environments show 34% higher retention rates. Consider team-fit as a primary filter.",
      priority: "high" as const,
    },
    {
      text: style === "boss"
        ? "Consider switching to Mentor Mode — candidates with a learning mindset respond 40% better to guidance-oriented interactions."
        : style === "mentor"
          ? "Your Mentor Mode is well-suited for the current candidate pool. 4 out of 5 candidates have a learning-oriented profile."
          : "Friendly Mode works well for initial outreach. Consider Mentor Mode for deeper engagement with high-potential candidates.",
      priority: "medium" as const,
    },
    {
      text: `${underdogs.length} candidate(s) show high growth trajectory despite developing skills. Expanding criteria to include mid-level candidates could reveal strong long-term hires.`,
      priority: "high" as const,
    },
    {
      text: "Candidates who receive personalized feedback within 48 hours are 2.5x more likely to accept an offer.",
      priority: "medium" as const,
    },
    {
      text: "Interest alignment correlates more strongly with job satisfaction than pure skill match. Weight interests at 30% minimum.",
      priority: "low" as const,
    },
  ];

  return insights;
}

// ─── Component ───
export default function RecruiterDashboard() {
  const { user } = useAuth();
  const { data: profile } = useProfile();

  const [commStyle, setCommStyle] = useState<"boss" | "mentor" | "friendly">("mentor");
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minSkillMatch: 0,
    personalityType: "",
    interestDomain: "",
    minGrowthPotential: 0,
  });

  // Opportunity builder state
  const [oppForm, setOppForm] = useState({
    title: "", skills: "", minRequirements: "", traits: "", workStyle: "team",
    environment: "balanced", learningLevel: "high", growthPath: "",
  });

  // Computed
  const requiredSkills = oppForm.skills ? oppForm.skills.split(",").map((s) => s.trim()).filter(Boolean) : ["Python", "Node.js", "SQL"];
  const preferredTraits = oppForm.traits ? oppForm.traits.split(",").map((s) => s.trim()).filter(Boolean) : ["Problem solving", "Logical thinking"];
  const workStyle = oppForm.workStyle;

  const candidatesWithScores = useMemo(() => {
    return mockCandidates.map((c) => ({
      ...c,
      fit: computeFitScore(c, requiredSkills, preferredTraits, workStyle),
      teamCompat: getTeamCompatibility(c),
    }));
  }, [requiredSkills.join(","), preferredTraits.join(","), workStyle]);

  const filteredCandidates = useMemo(() => {
    let result = [...candidatesWithScores];

    if (filters.minSkillMatch > 0) result = result.filter((c) => c.fit.skillMatch >= filters.minSkillMatch);
    if (filters.minGrowthPotential > 0) result = result.filter((c) => c.fit.growthPotential >= filters.minGrowthPotential);
    if (filters.personalityType) {
      result = result.filter((c) =>
        c.strengths.some((s) => s.toLowerCase().includes(filters.personalityType.toLowerCase())),
      );
    }
    if (filters.interestDomain) {
      result = result.filter((c) =>
        c.interests.some((i) => i.toLowerCase().includes(filters.interestDomain.toLowerCase())),
      );
    }

    // Sort: underdogs get a boost, then by total fit
    result.sort((a, b) => {
      const aScore = a.fit.total + (a.fit.isUnderdog ? 8 : 0);
      const bScore = b.fit.total + (b.fit.isUnderdog ? 8 : 0);
      return bScore - aScore;
    });

    return result;
  }, [candidatesWithScores, filters]);

  const systemGuidance = useMemo(() => getSystemGuidance(commStyle, mockCandidates), [commStyle]);

  const selectedCandidateData = selectedCandidate
    ? candidatesWithScores.find((c) => c.id === selectedCandidate)
    : null;

  const styleLabels = { boss: "Boss Mode", mentor: "Mentor Mode", friendly: "Friendly Mode" };
  const styleColors = { boss: "bg-destructive/10 text-destructive", mentor: "bg-primary/10 text-primary", friendly: "bg-success/10 text-success" };

  const envInsight: Record<string, string> = {
    "fast-paced": "This role attracts candidates who thrive under pressure and value rapid iteration.",
    relaxed: "This role appeals to candidates prioritizing work-life balance and deep thinking.",
    balanced: "This role attracts candidates interested in sustainable long-term growth.",
  };

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div variants={fadeUp} custom={0} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            {profile?.name || user?.name || "Recruiter"}'s Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Intelligent hiring • Alignment over qualification</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-1">Style:</span>
          {(["boss", "mentor", "friendly"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setCommStyle(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                commStyle === s ? styleColors[s] + " ring-1 ring-current" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {styleLabels[s]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Positioning */}
      <motion.div variants={fadeUp} custom={1} className="text-center">
        <p className="text-xs text-muted-foreground italic">
          Synapse prioritizes alignment, growth, and potential — not just qualifications.
        </p>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Best Aligned", value: filteredCandidates.length, icon: Users, color: "text-primary" },
          { label: "High Potential", value: filteredCandidates.filter((c) => c.fit.isUnderdog).length, icon: Rocket, color: "text-accent" },
          { label: "Avg Fit Score", value: `${Math.round(filteredCandidates.reduce((s, c) => s + c.fit.total, 0) / Math.max(filteredCandidates.length, 1))}%`, icon: Target, color: "text-success" },
          { label: "Active Style", value: styleLabels[commStyle], icon: MessageSquare, color: "text-warning" },
        ].map((stat, i) => (
          <motion.div key={stat.label} variants={fadeUp} custom={i + 2}
            className="p-4 rounded-xl border border-border bg-card hover:border-primary/20 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xl font-bold text-foreground">{stat.value}</span>
            </div>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Smart Filters */}
      <motion.div variants={fadeUp} custom={6}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3"
        >
          <Filter className="w-4 h-4" />
          Smart Filters
          {showFilters ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-card mb-4">
                <div>
                  <label htmlFor="filter-min-skill" className="text-xs text-muted-foreground mb-1 block">Min Skill Match</label>
                  <Input id="filter-min-skill" type="number" min={0} max={100} placeholder="0"
                    value={filters.minSkillMatch || ""} onChange={(e) => setFilters((f) => ({ ...f, minSkillMatch: Number(e.target.value) }))} />
                </div>
                <div>
                  <label htmlFor="filter-personality" className="text-xs text-muted-foreground mb-1 block">Personality Type</label>
                  <Input id="filter-personality" placeholder="e.g. Logical, Creative"
                    value={filters.personalityType} onChange={(e) => setFilters((f) => ({ ...f, personalityType: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="filter-interest" className="text-xs text-muted-foreground mb-1 block">Interest Domain</label>
                  <Input id="filter-interest" placeholder="e.g. AI, Web, Cloud"
                    value={filters.interestDomain} onChange={(e) => setFilters((f) => ({ ...f, interestDomain: e.target.value }))} />
                </div>
                <div>
                  <label htmlFor="filter-growth" className="text-xs text-muted-foreground mb-1 block">Min Growth Potential</label>
                  <Input id="filter-growth" type="number" min={0} max={100} placeholder="0"
                    value={filters.minGrowthPotential || ""} onChange={(e) => setFilters((f) => ({ ...f, minGrowthPotential: Number(e.target.value) }))} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Grid: Candidates + Side Panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Candidate Cards (2/3) */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div variants={fadeUp} custom={7}>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Best Aligned Candidates</h2>
            </div>
          </motion.div>

          {filteredCandidates.map((candidate, i) => (
            <motion.div key={candidate.id} variants={fadeUp} custom={8 + i}
              className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {candidate.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{candidate.name}</h3>
                      {candidate.fit.isUnderdog && (
                        <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-semibold flex items-center gap-1">
                          <Star className="w-3 h-3" /> High Potential
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{candidate.careerGoal} • {candidate.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{candidate.fit.total}%</div>
                  <p className="text-[10px] text-muted-foreground">Fit Score</p>
                </div>
              </div>

              {/* Fit Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {[
                  { label: "Skill Match", value: candidate.fit.skillMatch, weight: "30%" },
                  { label: "Interest", value: candidate.fit.interestAlignment, weight: "30%" },
                  { label: "Personality", value: candidate.fit.personalityFit, weight: "20%" },
                  { label: "Growth", value: candidate.fit.growthPotential, weight: "20%" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          item.value >= 75 ? "bg-success" : item.value >= 50 ? "bg-primary" : "bg-warning"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Why matched */}
              <div className="p-2.5 rounded-lg bg-secondary/40 border border-border mb-3">
                <p className="text-xs text-secondary-foreground">
                  <Lightbulb className="w-3 h-3 inline mr-1 text-warning" />
                  <span className="font-medium">Why matched:</span> {candidate.fit.whyMatched}
                </p>
              </div>

              {/* Strengths + Interests */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {candidate.strengths.slice(0, 3).map((s) => (
                  <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                ))}
                {candidate.interests.slice(0, 2).map((i) => (
                  <Badge key={i} variant="outline" className="text-[10px] border-primary/30 text-primary">{i}</Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-xs border-border"
                  onClick={() => setSelectedCandidate(selectedCandidate === candidate.id ? null : candidate.id)}>
                  <Eye className="w-3 h-3 mr-1" />
                  {selectedCandidate === candidate.id ? "Close" : "View Profile"}
                </Button>
                <Button size="sm" className="text-xs bg-gradient-primary text-primary-foreground"
                  onClick={() => toast.success(`Connection request sent to ${candidate.name}`)}>
                  <MessageSquare className="w-3 h-3 mr-1" /> Connect
                </Button>
              </div>

              {/* Expanded: Candidate Journey + Team Compat */}
              <AnimatePresence>
                {selectedCandidate === candidate.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-border grid sm:grid-cols-2 gap-4">
                      {/* Journey View */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" /> Candidate Journey
                        </h4>
                        <div className="space-y-2">
                          {candidate.journeyNotes.map((note, idx) => (
                            <div key={idx} className="flex gap-2 text-xs">
                              <span className="text-muted-foreground w-16 flex-shrink-0">{note.date}</span>
                              <div className="flex items-start gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                <span className="text-secondary-foreground">{note.event}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Roadmap Completion</span>
                            <span>{candidate.roadmapCompletion}%</span>
                          </div>
                          <Progress value={candidate.roadmapCompletion} className="h-1.5" />
                        </div>
                      </div>

                      {/* Team Compatibility */}
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-accent" /> Team Compatibility
                        </h4>
                        <div className="space-y-2 mb-3">
                          {(["collaboration", "leadership", "communication", "adaptability"] as const).map((trait) => (
                            <div key={trait}>
                              <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5 capitalize">
                                <span>{trait}</span>
                                <span className="flex gap-2">
                                  <span className="text-muted-foreground">Team: {existingTeam[trait]}</span>
                                  <span className="text-foreground">Candidate: {candidate.personality[trait]}</span>
                                </span>
                              </div>
                              <div className="relative w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                                <div className="absolute h-full rounded-full bg-muted-foreground/30" style={{ width: `${existingTeam[trait]}%` }} />
                                <div className="absolute h-full rounded-full bg-accent/80" style={{ width: `${candidate.personality[trait]}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="p-2 rounded-lg bg-accent/5 border border-accent/20">
                          <p className="text-[10px] font-medium text-accent mb-1">
                            {candidate.teamCompat.verdict} — {candidate.teamCompat.score}%
                          </p>
                          {candidate.teamCompat.complements.map((c, idx) => (
                            <p key={idx} className="text-[10px] text-muted-foreground">• {c}</p>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Deep Profile */}
                    <div className="mt-3 p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div><span className="text-muted-foreground">Learning:</span> <span className="text-foreground capitalize">{candidate.learningStyle}</span></div>
                        <div><span className="text-muted-foreground">Work Style:</span> <span className="text-foreground capitalize">{candidate.teamOrSolo}</span></div>
                        <div><span className="text-muted-foreground">Pressure:</span> <span className="text-foreground capitalize">{candidate.pressureTolerance}</span></div>
                        <div><span className="text-muted-foreground">Trajectory:</span> <span className="text-foreground capitalize">{candidate.growthTrajectory}</span></div>
                      </div>
                      {candidate.weaknesses.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          <span className="text-[10px] text-muted-foreground mr-1">Growth areas:</span>
                          {candidate.weaknesses.map((w) => (
                            <Badge key={w} variant="outline" className="text-[10px] border-warning/30 text-warning">{w}</Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* System Guidance (AI Co-Pilot) */}
          <motion.div variants={fadeUp} custom={13}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-accent" />
              <h2 className="text-sm font-semibold text-foreground">System Guidance</h2>
            </div>
            <div className="space-y-3">
              {systemGuidance.map((insight, i) => (
                <div key={i} className={`p-3 rounded-lg border text-xs leading-relaxed ${
                  insight.priority === "high"
                    ? "border-accent/20 bg-accent/5 text-accent-foreground"
                    : insight.priority === "medium"
                      ? "border-primary/20 bg-primary/5 text-foreground"
                      : "border-border bg-secondary/30 text-muted-foreground"
                }`}>
                  {insight.priority === "high" && <Sparkles className="w-3 h-3 inline mr-1 text-accent" />}
                  {insight.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Interaction Insights */}
          <motion.div variants={fadeUp} custom={14}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-warning" />
              <h2 className="text-sm font-semibold text-foreground">Interaction Insights</h2>
            </div>
            <div className="space-y-2.5">
              {interactionInsights.map((insight, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs">
                  <insight.icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${
                    insight.severity === "warning" ? "text-warning" : insight.severity === "success" ? "text-success" : "text-primary"
                  }`} />
                  <span className="text-muted-foreground leading-relaxed">{insight.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Hiring Insights */}
          <motion.div variants={fadeUp} custom={15}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success" />
              <h2 className="text-sm font-semibold text-foreground">Hiring Insights</h2>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: "Top Matched Skill", value: "Python", color: "text-primary" },
                { label: "High Demand Role", value: "Backend Developer", color: "text-success" },
                { label: "Preferred Style", value: "Mentor Mode", color: "text-accent" },
                { label: "Avg Response Time", value: "< 12 hours", color: "text-warning" },
                { label: "Retention Predictor", value: "Interest alignment", color: "text-primary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={`font-medium ${item.color}`}>{item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Connections */}
          <motion.div variants={fadeUp} custom={16}
            className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Recent Connections</h2>
            </div>
            <div className="space-y-2.5">
              {[
                { name: "Arjun Mehta", status: "Connected" },
                { name: "Priya Sharma", status: "Pending" },
                { name: "Sneha Patel", status: "Connected" },
              ].map((conn) => (
                <div key={conn.name} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {conn.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{conn.name}</p>
                      <p className={`text-[10px] ${conn.status === "Connected" ? "text-success" : "text-warning"}`}>{conn.status}</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[10px] h-7 px-2"
                    onClick={() => toast.info(`Chat with ${conn.name} — coming soon!`)}>
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Row: Opportunity Builder + Learning Programs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Opportunity Builder */}
        <motion.div variants={fadeUp} custom={17}
          className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Create Opportunity</h2>
          </div>
          <div className="space-y-3">
            <Input placeholder="Role title (e.g. Backend Developer)" value={oppForm.title}
              onChange={(e) => setOppForm((f) => ({ ...f, title: e.target.value }))} />
            <Input placeholder="Required skills (comma-separated)" value={oppForm.skills}
              onChange={(e) => setOppForm((f) => ({ ...f, skills: e.target.value }))} />
            <Input placeholder="Minimum requirements" value={oppForm.minRequirements}
              onChange={(e) => setOppForm((f) => ({ ...f, minRequirements: e.target.value }))} />
            <Input placeholder="Preferred personality traits (comma-separated)" value={oppForm.traits}
              onChange={(e) => setOppForm((f) => ({ ...f, traits: e.target.value }))} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="opportunity-work-style" className="text-[10px] text-muted-foreground mb-1 block">Work Style</label>
                <select id="opportunity-work-style" value={oppForm.workStyle}
                  onChange={(e) => setOppForm((f) => ({ ...f, workStyle: e.target.value }))}
                  className="w-full rounded-md border border-border bg-secondary p-2 text-xs text-foreground">
                  <option value="team">Team-based</option>
                  <option value="independent">Independent</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label htmlFor="opportunity-environment" className="text-[10px] text-muted-foreground mb-1 block">Environment</label>
                <select id="opportunity-environment" value={oppForm.environment}
                  onChange={(e) => setOppForm((f) => ({ ...f, environment: e.target.value }))}
                  className="w-full rounded-md border border-border bg-secondary p-2 text-xs text-foreground">
                  <option value="fast-paced">Fast-paced</option>
                  <option value="relaxed">Relaxed</option>
                  <option value="balanced">Balanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="opportunity-learning-level" className="text-[10px] text-muted-foreground mb-1 block">Learning Opportunity</label>
                <select id="opportunity-learning-level" value={oppForm.learningLevel}
                  onChange={(e) => setOppForm((f) => ({ ...f, learningLevel: e.target.value }))}
                  className="w-full rounded-md border border-border bg-secondary p-2 text-xs text-foreground">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label htmlFor="opportunity-growth-path" className="text-[10px] text-muted-foreground mb-1 block">Growth Path</label>
                <Input id="opportunity-growth-path" placeholder="e.g. Junior → Senior → Lead" value={oppForm.growthPath}
                  onChange={(e) => setOppForm((f) => ({ ...f, growthPath: e.target.value }))} className="text-xs" />
              </div>
            </div>

            {/* Env Insight */}
            <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-[10px] text-primary">
                <Lightbulb className="w-3 h-3 inline mr-1" />
                {envInsight[oppForm.environment] || envInsight.balanced}
              </p>
            </div>

            <Button className="w-full bg-gradient-primary text-primary-foreground text-xs"
              onClick={() => {
                if (!oppForm.title) { toast.error("Enter a role title"); return; }
                toast.success(`"${oppForm.title}" posted successfully!`);
                setOppForm({ title: "", skills: "", minRequirements: "", traits: "", workStyle: "team", environment: "balanced", learningLevel: "high", growthPath: "" });
              }}>
              <Briefcase className="w-3 h-3 mr-1" /> Post Opportunity
            </Button>
          </div>
        </motion.div>

        {/* Learning Programs */}
        <motion.div variants={fadeUp} custom={18}
          className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Offer Learning Programs</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Create Course", desc: "Share your expertise with a structured learning path", icon: BookOpen },
              { label: "Offer Internship", desc: "Provide hands-on experience for growing talent", icon: Briefcase },
              { label: "Start Training Program", desc: "Build a cohort-based training initiative", icon: Award },
            ].map((program) => (
              <Dialog key={program.label}>
                <DialogTrigger asChild>
                  <button className="w-full p-4 rounded-lg border border-border bg-secondary/30 hover:border-primary/30 transition-all text-left group">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                        <program.icon className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{program.label}</p>
                        <p className="text-[10px] text-muted-foreground">{program.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground ml-auto group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>{program.label}</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Input placeholder="Program title" />
                    <Textarea placeholder="Description" />
                    <Input placeholder="Duration (e.g. 4 weeks)" />
                    <Input placeholder="Skills covered (comma-separated)" />
                    <Button className="w-full bg-gradient-primary text-primary-foreground"
                      onClick={() => toast.success(`${program.label} created!`)}>
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
