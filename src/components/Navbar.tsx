import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, MessageCircle, Menu, X, Home, Sparkles, GraduationCap } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/college-finder', label: 'College Finder', icon: GraduationCap },
    { to: '/chat', label: 'AI Assistant', icon: MessageCircle },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
              <Compass className="w-5 h-5 text-[#0a0a0f]" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              <span className="text-white">Rise</span>
              <span className="text-emerald-400">Edge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(l.to)
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
            <Link
              to="/"
              className="ml-3 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0a0f] hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(l.to)
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
