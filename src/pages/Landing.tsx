import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Users, Map, Shield, ArrowRight, Zap, Target, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@/assets/logo.png";

const features = [
  { icon: Brain, title: "AI Mentor Engine", description: "A real-time mentor that understands your personality, ambitions, and psychology — not just your resume." },
  { icon: Target, title: "Smart Matching", description: "Connects seekers with recruiters based on best-fit, not just top-skill. Fairness-driven algorithm." },
  { icon: Map, title: "Career Roadmaps", description: "Auto-generated learning paths with milestones, progress tracking, and adaptive recommendations." },
  { icon: Users, title: "Deep Profiles", description: "Go beyond resumes. Capture interests, emotional tendencies, work preferences, and dream goals." },
  { icon: Zap, title: "Micro Interactions", description: "Smart polls, adaptive surveys, and contextual nudges that continuously refine your profile." },
  { icon: Shield, title: "Privacy First", description: "Explicit consent, granular data controls, and transparent usage. Your data, your rules." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6 },
  }),
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Synapse" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-lg font-bold text-foreground">Synapse</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground text-xs sm:text-sm">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 text-xs sm:text-sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-accent/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-card/50 text-xs font-medium text-muted-foreground mb-6 sm:mb-8">
              <Heart className="w-3 h-3 text-primary" />
              AI-First Career Intelligence
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-4 sm:mb-6">
              Your career deserves{" "}
              <span className="text-gradient">intelligence</span>
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>not just a resume
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
              Synapse understands your personality, ambitions, and psychology to mentor you like a guide,
              support you like a friend, and analyze like intelligence itself.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-primary text-primary-foreground hover:opacity-90 text-sm sm:text-base px-8 h-11 sm:h-12">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-sm sm:text-base h-11 sm:h-12 border-border hover:bg-secondary">
                  I'm a Recruiter
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-12 sm:mb-16">
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Beyond LinkedIn. Beyond resumes.
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
              A platform that truly understands who you are — and where you should go.
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i + 2}
                className="group p-5 sm:p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 sm:p-12 rounded-2xl border border-border bg-gradient-card glow-border"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to discover your path?</h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Join thousands of seekers and recruiters building meaningful connections powered by AI.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 px-8 h-11 sm:h-12">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-border py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Synapse" className="w-4 h-4 rounded object-cover" />
            <span>Synapse</span>
          </div>
          <p className="text-xs sm:text-sm">© 2026 Synapse. Built with intelligence and empathy.</p>
        </div>
      </footer>
    </div>
  );
}
