import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Sparkles, ArrowLeft, Star, Zap } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getUserProfile } from '../lib/session';
import type { Career } from '../lib/types';

export default function RecommendationsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const profile = location.state || getUserProfile();

  useEffect(() => {
    if (!profile) {
      navigate('/');
      return;
    }
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok) {
        setCareers(data);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return 'from-emerald-400 to-cyan-400';
    if (pct >= 60) return 'from-cyan-400 to-blue-400';
    if (pct >= 40) return 'from-blue-400 to-violet-400';
    return 'from-violet-400 to-pink-400';
  };

  const getDemandBadge = (level: string) => {
    const colors: Record<string, string> = {
      High: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      Low: 'bg-red-500/10 text-red-400 border-red-500/20',
    };
    return colors[level] || colors.Medium;
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            AI is analyzing your profile...
          </motion.div>
          <h2 className="text-2xl font-bold text-white">Finding Your Perfect Careers</h2>
        </div>
        <LoadingSpinner text="Matching your skills and interests with career paths..." />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Profile
          </button>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black mb-2">Your Career Matches</h1>
              <p className="text-gray-400">Based on your skills in <span className="text-emerald-400">{profile?.skills}</span></p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <Star className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-gray-400">{careers.length} matches found</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 mb-6">{error}</div>
        )}

        <div className="grid gap-4">
          {careers.map((career, i) => (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={`/career/${career.id}`}
                className="block group p-5 sm:p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors truncate">
                        {career.name}
                      </h3>
                      <span className={`shrink-0 px-2.5 py-0.5 rounded-md text-xs font-medium border ${getDemandBadge(career.demand_level)}`}>
                        {career.demand_level} Demand
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{career.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        {career.growth_trend}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-cyan-400" />
                        {career.short_reason}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className={`text-2xl font-black bg-gradient-to-r ${getMatchColor(career.match_percentage || 0)} bg-clip-text text-transparent`}>
                        {career.match_percentage}%
                      </div>
                      <div className="text-xs text-gray-600">Match</div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
