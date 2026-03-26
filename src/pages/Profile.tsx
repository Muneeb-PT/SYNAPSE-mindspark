import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { mockSeekerProfile } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Target,
  Heart,
  Briefcase,
  Lightbulb,
  Shield,
  Settings,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5 },
  }),
};

function TagList({ tags, color = "primary" }: { tags: string[]; color?: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            color === "primary" ? "bg-primary/10 text-primary" :
            color === "accent" ? "bg-accent/10 text-accent" :
            "bg-secondary text-secondary-foreground"
          }`}
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const profile = mockSeekerProfile;
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    behaviorTracking: false,
    screenAnalysis: false,
  });

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6">
      {/* Header card */}
      <motion.div variants={fadeUp} custom={0} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
              {user?.name?.[0]}
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">{user?.name}</h1>
              <p className="text-sm text-muted-foreground">{profile.headline}</p>
              <div className="flex gap-2 mt-2">
                {profile.personalityTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border">
            <Edit2 className="w-3 h-3 mr-1" /> Edit
          </Button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Profile Completion</span>
              <span className="font-medium text-foreground">{profile.completionPercent}%</span>
            </div>
            <Progress value={profile.completionPercent} className="h-2" />
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interests & Hobbies */}
        <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Interests</h2>
          </div>
          <TagList tags={profile.interests} />
          <div className="flex items-center gap-2 mb-3 mt-6">
            <Heart className="w-5 h-5 text-accent" />
            <h2 className="font-semibold text-foreground">Hobbies</h2>
          </div>
          <TagList tags={profile.hobbies} color="accent" />
        </motion.div>

        {/* Strengths & Weaknesses */}
        <motion.div variants={fadeUp} custom={2} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-success" />
            <h2 className="font-semibold text-foreground">Strengths</h2>
          </div>
          <TagList tags={profile.strengths} color="secondary" />
          <div className="flex items-center gap-2 mb-3 mt-6">
            <User className="w-5 h-5 text-warning" />
            <h2 className="font-semibold text-foreground">Growth Areas</h2>
          </div>
          <TagList tags={profile.weaknesses} color="secondary" />
        </motion.div>

        {/* Skills */}
        <motion.div variants={fadeUp} custom={3} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Skills</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(profile.skillLevel).map(([skill, level]) => (
              <div key={skill}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground">{skill}</span>
                  <span className="text-muted-foreground">{level}%</span>
                </div>
                <Progress value={level} className="h-1.5" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Work Preferences */}
        <motion.div variants={fadeUp} custom={4} className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Work Preferences</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: "Team vs Solo", value: profile.workPreferences.teamOrSolo },
              { label: "Pressure Tolerance", value: profile.workPreferences.pressureTolerance },
              { label: "Leadership Style", value: profile.workPreferences.leadership },
              { label: "Learning Style", value: profile.workPreferences.learningStyle },
            ].map((pref) => (
              <div key={pref.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm text-muted-foreground">{pref.label}</span>
                <span className="text-sm font-medium text-foreground capitalize">{pref.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">Dream Goals</h3>
            </div>
            <ul className="space-y-1.5">
              {profile.dreamGoals.map((goal) => (
                <li key={goal} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* Privacy */}
      <motion.div variants={fadeUp} custom={5} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Privacy & Data Controls</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          You're always in control. Toggle what data Synapse can use to improve your experience.
        </p>
        <div className="space-y-4">
          {[
            { key: "dataCollection" as const, label: "General Data Collection", desc: "Allow Synapse to use your profile data for AI recommendations" },
            { key: "behaviorTracking" as const, label: "Behavior Tracking", desc: "Track interaction patterns to improve suggestions (optional)" },
            { key: "screenAnalysis" as const, label: "Screen Analysis", desc: "Analyze usage patterns for personalization (coming soon)" },
          ].map((setting) => (
            <div key={setting.key} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
              <div>
                <p className="text-sm font-medium text-foreground">{setting.label}</p>
                <p className="text-xs text-muted-foreground">{setting.desc}</p>
              </div>
              <Switch
                checked={privacySettings[setting.key]}
                onCheckedChange={(v) => setPrivacySettings((s) => ({ ...s, [setting.key]: v }))}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
