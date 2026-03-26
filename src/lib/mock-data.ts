export interface User {
  id: string;
  name: string;
  email: string;
  role: "seeker" | "recruiter";
  avatar?: string;
}

export interface SeekerProfile {
  userId: string;
  headline: string;
  interests: string[];
  hobbies: string[];
  strengths: string[];
  weaknesses: string[];
  emotionalTendencies: string[];
  dreamGoals: string[];
  workPreferences: {
    teamOrSolo: "team" | "solo" | "both";
    pressureTolerance: "low" | "medium" | "high";
    leadership: "leader" | "follower" | "adaptive";
    learningStyle: "visual" | "auditory" | "kinesthetic" | "reading";
  };
  personalityTags: string[];
  skillLevel: Record<string, number>;
  completionPercent: number;
}

export interface RecruiterProfile {
  userId: string;
  company: string;
  industry: string;
  communicationStyle: "boss" | "mentor" | "friendly";
  hiringPreferences: string[];
  skillRequirements: string[];
}

export interface RoadmapItem {
  id: string;
  month: number;
  title: string;
  tasks: { id: string; text: string; completed: boolean }[];
  milestone: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: Date;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "job" | "internship" | "course" | "training";
  description: string;
  skills: string[];
  matchScore?: number;
}

export const mockUser: User = {
  id: "1",
  name: "Alex Chen",
  email: "alex@example.com",
  role: "seeker",
};

export const mockSeekerProfile: SeekerProfile = {
  userId: "1",
  headline: "Aspiring Full-Stack Developer & Creative Thinker",
  interests: ["Web Development", "AI/ML", "UI/UX Design", "Psychology"],
  hobbies: ["Gaming", "Photography", "Writing", "Chess"],
  strengths: ["Problem Solving", "Creativity", "Quick Learner", "Team Collaboration"],
  weaknesses: ["Public Speaking", "Time Management", "Perfectionism"],
  emotionalTendencies: ["Empathetic", "Curious", "Resilient", "Introverted"],
  dreamGoals: [
    "Build a tech startup",
    "Work at a FAANG company",
    "Mentor young developers",
    "Create open-source impact",
  ],
  workPreferences: {
    teamOrSolo: "both",
    pressureTolerance: "medium",
    leadership: "adaptive",
    learningStyle: "visual",
  },
  personalityTags: ["🧠 Analytical", "🎨 Creative", "🤝 Collaborative", "🚀 Ambitious"],
  skillLevel: {
    React: 72,
    TypeScript: 65,
    Python: 55,
    "UI Design": 80,
    "Data Structures": 60,
    "System Design": 35,
  },
  completionPercent: 78,
};

export const mockRoadmap: RoadmapItem[] = [
  {
    id: "1",
    month: 1,
    title: "Foundation Building",
    tasks: [
      { id: "t1", text: "Complete TypeScript fundamentals course", completed: true },
      { id: "t2", text: "Build 3 React mini-projects", completed: true },
      { id: "t3", text: "Learn Git & GitHub workflows", completed: false },
      { id: "t4", text: "Study data structures basics", completed: false },
    ],
    milestone: "Build & deploy first full-stack app",
  },
  {
    id: "2",
    month: 2,
    title: "Intermediate Growth",
    tasks: [
      { id: "t5", text: "Learn Node.js & Express", completed: false },
      { id: "t6", text: "Database design with PostgreSQL", completed: false },
      { id: "t7", text: "Build REST API project", completed: false },
      { id: "t8", text: "Contribute to open source", completed: false },
    ],
    milestone: "Complete full-stack portfolio project",
  },
  {
    id: "3",
    month: 3,
    title: "Advanced Specialization",
    tasks: [
      { id: "t9", text: "System design fundamentals", completed: false },
      { id: "t10", text: "Advanced React patterns", completed: false },
      { id: "t11", text: "Mock interview practice (5 sessions)", completed: false },
      { id: "t12", text: "Build capstone project", completed: false },
    ],
    milestone: "Ready for junior developer interviews",
  },
];

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Junior Frontend Developer",
    company: "TechFlow Inc.",
    type: "job",
    description: "Join our team building next-gen web applications",
    skills: ["React", "TypeScript", "Tailwind CSS"],
    matchScore: 92,
  },
  {
    id: "2",
    title: "UI/UX Design Internship",
    company: "DesignLab Studio",
    type: "internship",
    description: "3-month immersive design program with mentorship",
    skills: ["Figma", "UI Design", "User Research"],
    matchScore: 87,
  },
  {
    id: "3",
    title: "Full-Stack Bootcamp",
    company: "CodeCraft Academy",
    type: "course",
    description: "Intensive 12-week program covering modern web stack",
    skills: ["React", "Node.js", "PostgreSQL"],
    matchScore: 78,
  },
];

export const aiMentorQuestions = [
  "Do you enjoy logical problem solving or creative design more?",
  "When working on a project, do you prefer planning everything first or diving in?",
  "How do you handle setbacks — reflect quietly or talk it through?",
  "Would you rather lead a team or be the expert contributor?",
  "What excites you more — building something new or optimizing existing systems?",
  "Do you learn better from tutorials, books, or hands-on experimentation?",
  "How important is work-life balance vs career acceleration to you?",
];

export const aiResponses: Record<string, string> = {
  default: "That's a great insight! Based on what you've shared, I can see you have a strong analytical mindset combined with creative thinking. Let me refine my understanding of your career path.",
  greeting: "Welcome back, Alex! 👋 I've been analyzing your recent activity and I have some new insights to share. Your progress in React has been impressive — you're in the top 20% of learners at your stage. Let's explore what's next for you.",
  career: "Based on your personality profile — analytical yet creative, with strong collaboration skills — I'd recommend exploring **Product Engineering** roles. These combine technical depth with design thinking, which aligns perfectly with your strengths.",
  skill_gap: "I've identified a few key skill gaps:\n\n📊 **System Design** (35%) — This is critical for senior roles. I recommend starting with 'Designing Data-Intensive Applications'.\n\n🗣️ **Communication** — Your introverted tendency means structured practice will help. Try presenting one technical concept per week.\n\n⏰ **Time Management** — Consider the Pomodoro technique with your visual learning style.",
  roadmap: "I've generated a personalized 3-month roadmap based on your goals. It focuses on:\n\n**Month 1:** Strengthening TypeScript & React foundations\n**Month 2:** Backend development & database design\n**Month 3:** System design & interview preparation\n\nEach phase builds on the previous one, matching your visual learning preference with hands-on projects.",
};
