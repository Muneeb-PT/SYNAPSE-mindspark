import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Check, MapPin, Target, Heart, Brain, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useUpdateProfile } from "@/hooks/use-profile";
import { useAddSkill } from "@/hooks/use-profile";
import { useAuth } from "@/lib/auth-context";

interface OnboardingStep {
  id: string;
  question: string;
  subtext: string;
  icon: React.ElementType;
  type: "text" | "textarea" | "select" | "multi-select" | "skills";
  field: string;
  options?: string[];
  placeholder?: string;
}

const steps: OnboardingStep[] = [
  {
    id: "headline",
    question: "How would you describe yourself in one line?",
    subtext: "This becomes your profile headline — make it memorable.",
    icon: Sparkles,
    type: "text",
    field: "headline",
    placeholder: "e.g. Aspiring Data Scientist & Creative Problem Solver",
  },
  {
    id: "bio",
    question: "Tell me a bit about yourself.",
    subtext: "What drives you? What are you passionate about?",
    icon: Heart,
    type: "textarea",
    field: "bio",
    placeholder: "I'm passionate about building products that make a difference...",
  },
  {
    id: "location",
    question: "Where are you based?",
    subtext: "This helps us find opportunities near you.",
    icon: MapPin,
    type: "text",
    field: "location",
    placeholder: "e.g. San Francisco, CA",
  },
  {
    id: "interests",
    question: "What fields interest you the most?",
    subtext: "Select all that apply — this shapes your career recommendations.",
    icon: Brain,
    type: "multi-select",
    field: "interests",
    options: [
      "Web Development", "Mobile Development", "AI/ML", "Data Science",
      "Cybersecurity", "Cloud Computing", "UI/UX Design", "Game Development",
      "DevOps", "Blockchain", "IoT", "Robotics",
      "Product Management", "Digital Marketing", "Content Creation", "Research",
    ],
  },
  {
    id: "strengths",
    question: "What are your top strengths?",
    subtext: "Be honest — self-awareness is a superpower.",
    icon: Target,
    type: "multi-select",
    field: "strengths",
    options: [
      "Problem Solving", "Creativity", "Quick Learner", "Team Collaboration",
      "Leadership", "Communication", "Analytical Thinking", "Adaptability",
      "Attention to Detail", "Time Management", "Critical Thinking", "Empathy",
    ],
  },
  {
    id: "weaknesses",
    question: "Where do you feel you could improve?",
    subtext: "Everyone has growth areas — identifying them is the first step.",
    icon: Target,
    type: "multi-select",
    field: "weaknesses",
    options: [
      "Public Speaking", "Time Management", "Perfectionism", "Networking",
      "Delegation", "Saying No", "Technical Writing", "Focus/Concentration",
      "Conflict Resolution", "Self-Promotion", "Patience", "Risk Taking",
    ],
  },
  {
    id: "dream_goals",
    question: "What are your dream career goals?",
    subtext: "Think big — where do you see yourself in 5 years?",
    icon: Briefcase,
    type: "multi-select",
    field: "dream_goals",
    options: [
      "Work at a FAANG company", "Build a tech startup", "Become a CTO",
      "Lead an engineering team", "Work remotely worldwide", "Create open-source impact",
      "Become a freelance consultant", "Transition to AI/ML", "Mentor young developers",
      "Get into product management", "Start a YouTube/blog", "Work in research",
    ],
  },
  {
    id: "skills",
    question: "What skills do you already have?",
    subtext: "Rate your confidence in each skill. You can add more later.",
    icon: Brain,
    type: "skills",
    field: "skills",
  },
];

const presetSkills = [
  "JavaScript", "Python", "React", "TypeScript", "Node.js", "Java", "C++",
  "SQL", "Git", "HTML/CSS", "Docker", "AWS", "Figma", "Data Analysis",
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [skillEntries, setSkillEntries] = useState<{ name: string; level: number }[]>([]);
  const [customSkill, setCustomSkill] = useState("");
  const updateProfile = useUpdateProfile();
  const addSkill = useAddSkill();
  const navigate = useNavigate();
  const { user } = useAuth();

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const currentAnswer = answers[step.field];
  const canProceed = step.type === "skills"
    ? skillEntries.length > 0
    : step.type === "multi-select"
      ? Array.isArray(currentAnswer) && currentAnswer.length > 0
      : typeof currentAnswer === "string" && currentAnswer.trim().length > 0;

  const handleTextChange = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step.field]: value }));
  };

  const handleMultiSelect = (option: string) => {
    setAnswers((prev) => {
      const current = (prev[step.field] as string[]) || [];
      return {
        ...prev,
        [step.field]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const addSkillEntry = (name: string) => {
    if (!name.trim() || skillEntries.find((s) => s.name === name.trim())) return;
    setSkillEntries((prev) => [...prev, { name: name.trim(), level: 50 }]);
    setCustomSkill("");
  };

  const updateSkillLevel = (name: string, level: number) => {
    setSkillEntries((prev) =>
      prev.map((s) => (s.name === name ? { ...s, level } : s))
    );
  };

  const removeSkillEntry = (name: string) => {
    setSkillEntries((prev) => prev.filter((s) => s.name !== name));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save everything
      const profileData: Record<string, unknown> = {};
      for (const s of steps) {
        if (s.type === "skills") continue;
        const val = answers[s.field];
        if (val) profileData[s.field] = val;
      }
      profileData.status = "actively_looking";

      await updateProfile.mutateAsync(profileData);

      // Save skills
      for (const skill of skillEntries) {
        await addSkill.mutateAsync(skill);
      }

      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-4">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {currentStep + 1} / {steps.length}
          </span>
          <Progress value={progress} className="h-1.5 flex-1" />
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pt-16 pb-8">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Icon + Question */}
              <div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">{step.question}</h1>
                <p className="text-sm text-muted-foreground mt-1">{step.subtext}</p>
              </div>

              {/* Input area */}
              {step.type === "text" && (
                <Input
                  placeholder={step.placeholder}
                  value={(currentAnswer as string) || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="bg-secondary border-border text-base h-12"
                  autoFocus
                  onKeyDown={(e) => e.key === "Enter" && canProceed && handleNext()}
                />
              )}

              {step.type === "textarea" && (
                <Textarea
                  placeholder={step.placeholder}
                  value={(currentAnswer as string) || ""}
                  onChange={(e) => handleTextChange(e.target.value)}
                  className="bg-secondary border-border text-base min-h-[120px]"
                  autoFocus
                />
              )}

              {step.type === "multi-select" && step.options && (
                <div className="flex flex-wrap gap-2">
                  {step.options.map((option) => {
                    const selected = Array.isArray(currentAnswer) && currentAnswer.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleMultiSelect(option)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                          selected
                            ? "bg-primary/15 border-primary text-primary"
                            : "bg-secondary border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {selected && <Check className="w-3 h-3 inline mr-1.5" />}
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}

              {step.type === "skills" && (
                <div className="space-y-4">
                  {/* Preset skill pills */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-2">
                      {presetSkills
                        .filter((s) => !skillEntries.find((e) => e.name === s))
                        .map((skill) => (
                          <button
                            key={skill}
                            onClick={() => addSkillEntry(skill)}
                            className="px-3 py-1.5 rounded-full text-xs font-medium bg-secondary border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground transition-all"
                          >
                            + {skill}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Custom skill input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a custom skill..."
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      className="bg-secondary border-border"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addSkillEntry(customSkill);
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addSkillEntry(customSkill)}
                      disabled={!customSkill.trim()}
                      className="border-border"
                    >
                      Add
                    </Button>
                  </div>

                  {/* Skill sliders */}
                  {skillEntries.length > 0 && (
                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                      {skillEntries.map((skill) => (
                        <div key={skill.name} className="p-3 rounded-lg bg-secondary/50 border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-foreground">{skill.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">{skill.level}%</span>
                              <button
                                onClick={() => removeSkillEntry(skill.name)}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={skill.level}
                            onChange={(e) => updateSkillLevel(skill.name, Number(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                            <span>Beginner</span>
                            <span>Intermediate</span>
                            <span>Expert</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="text-muted-foreground"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={!canProceed || updateProfile.isPending}
                  className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8"
                >
                  {currentStep === steps.length - 1
                    ? updateProfile.isPending
                      ? "Saving..."
                      : "Complete Setup"
                    : "Continue"}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
