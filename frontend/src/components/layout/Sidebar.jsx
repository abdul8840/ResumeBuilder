import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, FileText, BarChart3, User, Settings,
  Sparkles, Plus, ChevronRight, Star, Zap,
  FolderOpen, Download, Share2,
} from "lucide-react";
import { useSelector } from "react-redux";
import { selectUser } from "../../features/auth/authSlice.js";
import { selectResumes } from "../../features/resume/resumeSlice.js";
import Badge from "../common/Badge.jsx";
import ProgressBar from "../common/ProgressBar.jsx";

const navItems = [
  {
    section: "Main",
    items: [
      { path: "/dashboard", label: "Dashboard", icon: Home },
      { path: "/resumes", label: "My Resumes", icon: FileText, badge: null },
      { path: "/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    section: "Tools",
    items: [
      { path: "/resumes/new", label: "New Resume", icon: Plus, highlight: true },
      { path: "/profile", label: "Profile", icon: User },
      { path: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const user = useSelector(selectUser);
  const resumes = useSelector(selectResumes);

  const isActive = (path) => location.pathname === path;
  const resumeCount = resumes?.length || 0;
  const freeLimit = 3;
  const usagePercent = Math.min((resumeCount / freeLimit) * 100, 100);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 z-40 h-full w-72 bg-white border-r border-slate-100 shadow-strong flex flex-col lg:relative lg:translate-x-0 lg:shadow-none"
      >
        {/* Logo area (visible on mobile sidebar only) */}
        <div className="lg:hidden flex items-center gap-2.5 px-5 py-4 border-b border-slate-100">
          <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-base">R</span>
          </div>
          <span className="font-bold text-slate-800 text-lg font-display">ResumeAI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(({ section, items }) => (
            <div key={section} className="mb-6">
              <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {section}
              </p>
              <div className="space-y-0.5">
                {items.map(({ path, label, icon: Icon, highlight, badge }) => {
                  const active = isActive(path);
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => window.innerWidth < 1024 && onClose()}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                        transition-all group relative
                        ${active
                          ? "bg-indigo-50 text-indigo-700"
                          : highlight
                          ? "text-indigo-600 hover:bg-indigo-50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-500 rounded-full"
                        />
                      )}

                      <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${
                        active ? "text-indigo-600" : highlight ? "text-indigo-500" : "text-slate-400 group-hover:text-slate-600"
                      }`} />
                      <span className="flex-1">{label}</span>

                      {/* Badge */}
                      {label === "My Resumes" && resumeCount > 0 && (
                        <Badge variant="default" size="xs">{resumeCount}</Badge>
                      )}
                      {highlight && (
                        <Badge variant="gradient" size="xs">New</Badge>
                      )}
                      {active && (
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-100 space-y-3">
          {/* Usage indicator (free plan) */}
          {user?.subscription?.plan === "free" && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-slate-700">Resume Usage</span>
                </div>
                <span className="text-xs text-slate-500">{resumeCount}/{freeLimit}</span>
              </div>
              <ProgressBar
                value={resumeCount}
                max={freeLimit}
                size="sm"
                color={usagePercent >= 100 ? "danger" : usagePercent >= 66 ? "warning" : "primary"}
                showPercentage={false}
                animated={false}
              />
              {usagePercent >= 66 && (
                <p className="text-xs text-slate-500 mt-2">
                  {usagePercent >= 100 ? "Limit reached!" : "Almost at limit."}
                </p>
              )}
            </div>
          )}

          {/* Upgrade CTA */}
          {user?.subscription?.plan === "free" && (
            <Link to="/upgrade">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 gradient-bg rounded-2xl cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-semibold text-white">Upgrade to Pro</span>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Unlimited resumes, AI features & more
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  {["Unlimited AI", "PDF Export", "Analytics"].map((feat) => (
                    <Badge key={feat} variant="dark" size="xs" className="bg-white/20 text-white text-[10px]">
                      {feat}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </Link>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;