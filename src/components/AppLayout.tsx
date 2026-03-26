import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  User,
  MessageSquare,
  Map,
  Brain,
  LogOut,
  Sparkles,
  Briefcase,
} from "lucide-react";

const sidebarLinks = {
  seeker: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/mentor", label: "AI Mentor", icon: Brain },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/roadmap", label: "Roadmap", icon: Map },
    { to: "/chat", label: "Messages", icon: MessageSquare },
  ],
  recruiter: [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/opportunities", label: "Opportunities", icon: Briefcase },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/chat", label: "Messages", icon: MessageSquare },
  ],
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const links = sidebarLinks[user?.role || "seeker"];

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">Synapse</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 w-0.5 h-6 bg-primary rounded-r"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="flex items-center gap-2 px-3 py-2 w-full text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-secondary"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
