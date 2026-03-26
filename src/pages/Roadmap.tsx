import { useState } from "react";
import { motion } from "framer-motion";
import { mockRoadmap } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Flag, Map, ChevronDown, ChevronUp } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(mockRoadmap);
  const [expanded, setExpanded] = useState<string | null>(roadmap[0]?.id);

  const toggleTask = (monthId: string, taskId: string) => {
    setRoadmap((prev) =>
      prev.map((m) =>
        m.id === monthId
          ? { ...m, tasks: m.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)) }
          : m
      )
    );
  };

  const totalTasks = roadmap.flatMap((m) => m.tasks).length;
  const completedTasks = roadmap.flatMap((m) => m.tasks).filter((t) => t.completed).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

  return (
    <motion.div initial="hidden" animate="visible" className="max-w-3xl mx-auto space-y-6">
      <motion.div variants={fadeUp} custom={0}>
        <div className="flex items-center gap-2 mb-1">
          <Map className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Career Roadmap</h1>
        </div>
        <p className="text-muted-foreground text-sm">AI-generated learning path tailored to your goals</p>
      </motion.div>

      {/* Overall progress */}
      <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-foreground">Overall Progress</p>
            <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</p>
          </div>
          <span className="text-3xl font-bold text-gradient">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-3" />
      </motion.div>

      {/* Timeline */}
      <div className="space-y-4">
        {roadmap.map((month, i) => {
          const monthCompleted = month.tasks.filter((t) => t.completed).length;
          const monthProgress = Math.round((monthCompleted / month.tasks.length) * 100);
          const isExpanded = expanded === month.id;

          return (
            <motion.div
              key={month.id}
              variants={fadeUp}
              custom={i + 2}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(isExpanded ? null : month.id)}
                className="w-full p-5 flex items-center gap-4 hover:bg-secondary/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold ${
                  monthProgress === 100
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}>
                  M{month.month}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-foreground">{month.title}</h3>
                  <p className="text-xs text-muted-foreground">{monthCompleted}/{month.tasks.length} tasks · {monthProgress}%</p>
                </div>
                <Progress value={monthProgress} className="w-24 h-1.5" />
                {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>

              {isExpanded && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  className="border-t border-border"
                >
                  <div className="p-5 space-y-3">
                    {month.tasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => toggleTask(month.id, task.id)}
                        className="flex items-center gap-3 w-full text-left group"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground group-hover:text-primary flex-shrink-0 transition-colors" />
                        )}
                        <span className={`text-sm ${task.completed ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {task.text}
                        </span>
                      </button>
                    ))}
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      <Flag className="w-4 h-4 text-warning" />
                      <span className="text-xs text-muted-foreground">
                        Milestone: <span className="text-foreground font-medium">{month.milestone}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
