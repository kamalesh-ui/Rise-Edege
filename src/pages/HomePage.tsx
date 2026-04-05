import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Brain, TrendingUp, BookOpen, MessageCircle, Compass, ArrowRight, Plus, X, Zap, Target, Rocket, ChevronDown } from 'lucide-react';
import { setUserProfile } from '../lib/session';

const SKILL_SUGGESTIONS = [
  'Python', 'JavaScript', 'Data Analysis', 'Machine Learning', 'Design',
  'Writing', 'Marketing', 'Communication', 'Leadership', 'Problem Solving',
  'React', 'SQL', 'Cloud Computing', 'Cybersecurity', 'Project Management',
  'Statistics', 'UX Research', 'Public Speaking', 'Excel', 'Photoshop'
];

const INTEREST_SUGGESTIONS = [
  'Technology', 'Healthcare', 'Finance', 'Education', 'Gaming',
  'Art & Design', 'Science', 'Business', 'Music', 'Environment',
  'AI & Robotics', 'Social Media', 'Sports', 'Fashion', 'Space',
  'Entrepreneurship', 'Psychology', 'Film & Video', 'Travel', 'Food'
];

const EDUCATION_OPTIONS = [
  'High School', 'Undergraduate', 'Graduate', 'PhD', 'Self-taught',
  'Bootcamp', 'Diploma', 'Vocational'
];

const features = [
  { icon: Brain, title: 'AI-Powered Analysis', desc: 'Smart career matching based on your unique skill profile and interests' },
  { icon: TrendingUp, title: 'Future Predictions', desc: 'See which careers will thrive in 2030+ with AI impact analysis' },
  { icon: BookOpen, title: 'Learning Roadmaps', desc: 'Step-by-step plans from beginner to advanced with milestones' },
  { icon: MessageCircle, title: 'AI Career Chat', desc: 'Ask anything about careers, salaries, and learning paths' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [education, setEducation] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const addSkill = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput('');
  };

  const addInterest = (s: string) => {
    const trimmed = s.trim();
    if (trimmed && !interests.includes(trimmed)) setInterests([...interests, trimmed]);
    setInterestInput('');
  };

  const handleSubmit = async () => {
    if (skills.length === 0 || interests.length === 0) return;
    setLoading(true);
    const profile = {
      skills: skills.join(', '),
      interests: interests.join(', '),
      education,
    };
    setUserProfile(profile);
    navigate('/recommendations', { state: profile });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              AI-Powered Career Intelligence
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Perfect Career
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Enter your skills and interests. Our AI analyzes 2030+ career trends,
              maps your strengths, and builds a personalized roadmap to your dream career.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowForm(true);
                  setTimeout(() => document.getElementById('skill-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
                }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0a0f] font-bold text-lg shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow"
              >
                <Compass className="w-5 h-5" />
                Generate My Career Path
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <button
                onClick={() => navigate('/chat')}
                className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all font-medium"
              >
                <MessageCircle className="w-5 h-5" />
                Ask AI Assistant
              </button>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-20"
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.03] transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:bg-emerald-500/20 transition-colors">
                  <f.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-center mt-10"
          >
            <ChevronDown className="w-6 h-6 text-emerald-400 animate-bounce" />
          </motion.div>
        )}
      </section>

      {/* Skill Input Form */}
      {showForm && (
        <motion.section
          id="skill-section"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative py-16"
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-white/[0.03] border border-white/[0.08] p-6 sm:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#0a0a0f]" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Tell Us About You</h2>
                  <p className="text-gray-500 text-sm">Add your skills and interests for personalized career matching</p>
                </div>
              </div>

              {/* Skills */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3">Your Skills *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill(skillInput))}
                    placeholder="Type a skill and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                  />
                  <button
                    onClick={() => addSkill(skillInput)}
                    className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {skills.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                        {s}
                        <button onClick={() => setSkills(skills.filter(x => x !== s))}><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {SKILL_SUGGESTIONS.filter(s => !skills.includes(s)).slice(0, 10).map(s => (
                    <button
                      key={s}
                      onClick={() => addSkill(s)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-500 text-xs hover:text-emerald-400 hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-300 mb-3">Your Interests *</label>
                <div className="flex gap-2 mb-3">
                  <input
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addInterest(interestInput))}
                    placeholder="Type an interest and press Enter..."
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  />
                  <button
                    onClick={() => addInterest(interestInput)}
                    className="px-4 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {interests.map(s => (
                      <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm">
                        {s}
                        <button onClick={() => setInterests(interests.filter(x => x !== s))}><X className="w-3.5 h-3.5" /></button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {INTEREST_SUGGESTIONS.filter(s => !interests.includes(s)).slice(0, 10).map(s => (
                    <button
                      key={s}
                      onClick={() => addInterest(s)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-gray-500 text-xs hover:text-cyan-400 hover:border-cyan-500/20 hover:bg-cyan-500/5 transition-all"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-300 mb-3">Education Level <span className="text-gray-600">(optional)</span></label>
                <div className="flex flex-wrap gap-2">
                  {EDUCATION_OPTIONS.map(e => (
                    <button
                      key={e}
                      onClick={() => setEducation(education === e ? '' : e)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        education === e
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white hover:border-white/10'
                      }`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleSubmit}
                disabled={skills.length === 0 || interests.length === 0 || loading}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-[#0a0a0f] font-bold text-lg shadow-2xl shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-emerald-500/40 transition-all"
              >
                {loading ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Analyzing Your Profile...
                  </>
                ) : (
                  <>
                    <Rocket className="w-5 h-5" />
                    Generate My Career Path
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>

              {skills.length === 0 && interests.length === 0 && (
                <p className="text-center text-gray-600 text-sm mt-4">Add at least one skill and one interest to continue</p>
              )}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
}
