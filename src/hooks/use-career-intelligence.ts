import { useMemo } from "react";

export interface SkillGap {
  skill: string;
  current: number;
  required: number;
  gap: number;
  priority: "critical" | "important" | "nice-to-have";
}

export interface RealityCheck {
  goalLabel: string;
  difficultyScore: number; // 0-100
  timeEstimate: string;
  readiness: number; // 0-100
  missingSkills: string[];
}

export interface ConfidenceMetric {
  skill: string;
  level: number;
  label: "Beginner" | "Developing" | "Competent" | "Proficient" | "Expert";
  color: string;
}

// Career goal -> required skills mapping
const goalRequirements: Record<string, { skills: Record<string, number>; difficulty: number; timeEstimate: string }> = {
  "Work at a FAANG company": {
    skills: { "Data Structures": 85, "System Design": 80, "JavaScript": 75, "React": 70, "Python": 70, "SQL": 65 },
    difficulty: 85,
    timeEstimate: "12-18 months",
  },
  "Build a tech startup": {
    skills: { "React": 75, "Node.js": 70, "Product Management": 60, "UI/UX Design": 55, "Cloud Computing": 60 },
    difficulty: 90,
    timeEstimate: "18-24 months",
  },
  "Become a CTO": {
    skills: { "System Design": 90, "Leadership": 85, "Cloud Computing": 80, "DevOps": 70, "Data Structures": 75 },
    difficulty: 95,
    timeEstimate: "5-8 years",
  },
  "Lead an engineering team": {
    skills: { "Leadership": 80, "Communication": 75, "System Design": 70, "Project Management": 65 },
    difficulty: 70,
    timeEstimate: "3-5 years",
  },
  "Work remotely worldwide": {
    skills: { "React": 70, "TypeScript": 65, "Communication": 70, "Git": 60 },
    difficulty: 45,
    timeEstimate: "6-12 months",
  },
  "Create open-source impact": {
    skills: { "Git": 80, "JavaScript": 70, "Technical Writing": 60, "React": 65 },
    difficulty: 50,
    timeEstimate: "6-12 months",
  },
  "Become a freelance consultant": {
    skills: { "Communication": 75, "React": 70, "Business Development": 60, "UI/UX Design": 55 },
    difficulty: 60,
    timeEstimate: "6-12 months",
  },
  "Transition to AI/ML": {
    skills: { "Python": 80, "Data Analysis": 75, "Mathematics": 70, "Machine Learning": 65, "SQL": 60 },
    difficulty: 80,
    timeEstimate: "12-18 months",
  },
  "Mentor young developers": {
    skills: { "Communication": 80, "Leadership": 70, "Teaching": 65, "React": 60 },
    difficulty: 35,
    timeEstimate: "3-6 months",
  },
  "Get into product management": {
    skills: { "Product Management": 75, "Communication": 80, "Data Analysis": 60, "UI/UX Design": 55 },
    difficulty: 65,
    timeEstimate: "6-12 months",
  },
};

function getConfidenceLabel(level: number): { label: ConfidenceMetric["label"]; color: string } {
  if (level >= 85) return { label: "Expert", color: "text-success" };
  if (level >= 70) return { label: "Proficient", color: "text-primary" };
  if (level >= 50) return { label: "Competent", color: "text-accent" };
  if (level >= 30) return { label: "Developing", color: "text-warning" };
  return { label: "Beginner", color: "text-muted-foreground" };
}

export function useCareerIntelligence(
  skills: { name: string; level: number }[],
  dreamGoals: string[] | null | undefined,
  strengths: string[] | null | undefined,
) {
  return useMemo(() => {
    const skillMap: Record<string, number> = {};
    for (const s of skills) skillMap[s.name] = s.level;

    // Confidence metrics
    const confidenceMetrics: ConfidenceMetric[] = skills.map((s) => {
      const { label, color } = getConfidenceLabel(s.level);
      return { skill: s.name, level: s.level, label, color };
    });

    // Reality checks
    const realityChecks: RealityCheck[] = (dreamGoals || [])
      .filter((g) => goalRequirements[g])
      .map((goal) => {
        const req = goalRequirements[goal];
        const missing: string[] = [];
        let totalReadiness = 0;
        let count = 0;

        for (const [skill, required] of Object.entries(req.skills)) {
          const current = skillMap[skill] || 0;
          if (current < required) missing.push(skill);
          totalReadiness += Math.min(100, (current / required) * 100);
          count++;
        }

        return {
          goalLabel: goal,
          difficultyScore: req.difficulty,
          timeEstimate: req.timeEstimate,
          readiness: count > 0 ? Math.round(totalReadiness / count) : 0,
          missingSkills: missing,
        };
      });

    // Skill gaps (aggregate from all goals)
    const gapMap: Record<string, { required: number; sources: string[] }> = {};
    for (const goal of dreamGoals || []) {
      const req = goalRequirements[goal];
      if (!req) continue;
      for (const [skill, level] of Object.entries(req.skills)) {
        if (!gapMap[skill] || gapMap[skill].required < level) {
          gapMap[skill] = { required: level, sources: [goal] };
        } else {
          gapMap[skill].sources.push(goal);
        }
      }
    }

    const skillGaps: SkillGap[] = Object.entries(gapMap)
      .map(([skill, { required }]) => {
        const current = skillMap[skill] || 0;
        const gap = Math.max(0, required - current);
        return {
          skill,
          current,
          required,
          gap,
          priority: gap > 50 ? "critical" as const : gap > 25 ? "important" as const : "nice-to-have" as const,
        };
      })
      .filter((g) => g.gap > 0)
      .sort((a, b) => b.gap - a.gap);

    return { confidenceMetrics, realityChecks, skillGaps };
  }, [skills, dreamGoals, strengths]);
}
