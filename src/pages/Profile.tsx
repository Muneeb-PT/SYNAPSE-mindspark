import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { mockSeekerProfile, statusLabels } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import {
  User, Target, Heart, Briefcase, Lightbulb, Shield, Settings, Edit2,
  GraduationCap, Award, Globe, MapPin, Calendar, ExternalLink, Languages,
  Clock, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
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

function SectionCard({ children, custom, className = "" }: { children: React.ReactNode; custom: number; className?: string }) {
  return (
    <motion.div variants={fadeUp} custom={custom} className={`rounded-xl border border-border bg-card p-4 sm:p-6 ${className}`}>
      {children}
    </motion.div>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const profile = mockSeekerProfile;
  const statusInfo = statusLabels[profile.status];
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    behaviorTracking: false,
    screenAnalysis: false,
  });

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header card */}
      <SectionCard custom={0}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-xl sm:text-2xl font-bold text-primary-foreground flex-shrink-0">
              {user?.name?.[0]}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-foreground">{user?.name}</h1>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{profile.headline}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{profile.availability}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.personalityTags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs">{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="border-border self-start flex-shrink-0">
            <Edit2 className="w-3 h-3 mr-1" /> Edit
          </Button>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{profile.bio}</p>

        {/* Social Links */}
        <div className="flex flex-wrap gap-2 mt-3">
          {profile.socialLinks.linkedin && (
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors">
              <Globe className="w-3 h-3" /> LinkedIn
            </a>
          )}
          {profile.socialLinks.github && (
            <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors">
              <Globe className="w-3 h-3" /> GitHub
            </a>
          )}
          {profile.socialLinks.portfolio && (
            <a href={profile.socialLinks.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors">
              <ExternalLink className="w-3 h-3" /> Portfolio
            </a>
          )}
          {profile.socialLinks.twitter && (
            <a href={profile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-xs text-secondary-foreground hover:text-primary transition-colors">
              <Globe className="w-3 h-3" /> Twitter
            </a>
          )}
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-medium text-foreground">{profile.completionPercent}%</span>
          </div>
          <Progress value={profile.completionPercent} className="h-2" />
        </div>
      </SectionCard>

      {/* Languages */}
      <SectionCard custom={1}>
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Languages</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.languages.map((lang) => (
            <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
          ))}
        </div>
      </SectionCard>

      {/* Education */}
      <SectionCard custom={2}>
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Education</h2>
        </div>
        <div className="space-y-4">
          {profile.education.map((edu) => (
            <div key={edu.id} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-foreground">{edu.degree} in {edu.field}</h3>
                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{edu.startYear} – {edu.current ? "Present" : edu.endYear}</span>
                  {edu.grade && <Badge variant="secondary" className="text-[10px] px-1.5">{edu.grade}</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Experience */}
      <SectionCard custom={3}>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Experience</h2>
        </div>
        <div className="space-y-4">
          {profile.experience.map((exp) => (
            <div key={exp.id} className="flex gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground">{exp.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-secondary text-[10px] text-secondary-foreground capitalize">{exp.type}</span>
                </div>
                <p className="text-xs text-muted-foreground">{exp.company}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{exp.startDate} – {exp.current ? "Present" : exp.endDate}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {exp.skills.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-primary/10 text-[10px] text-primary font-medium">{s}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Certifications */}
      <SectionCard custom={4}>
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-warning" />
          <h2 className="font-semibold text-foreground">Certifications</h2>
        </div>
        <div className="space-y-3">
          {profile.certifications.map((cert) => (
            <div key={cert.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border">
              <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground">{cert.name}</h3>
                <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
              </div>
              {cert.credentialUrl && (
                <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
        {/* Interests & Hobbies */}
        <SectionCard custom={5}>
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
        </SectionCard>

        {/* Strengths & Weaknesses */}
        <SectionCard custom={6}>
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
        </SectionCard>

        {/* Skills */}
        <SectionCard custom={7}>
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
        </SectionCard>

        {/* Work Preferences */}
        <SectionCard custom={8}>
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
        </SectionCard>
      </div>

      {/* Privacy */}
      <SectionCard custom={9}>
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
              <div className="mr-3">
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
      </SectionCard>
    </motion.div>
  );
}
