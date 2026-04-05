import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Briefcase, GraduationCap, Wrench, Heart, TrendingUp, Shield, Zap, Brain, Map, BookOpen, Play, Pause, Volume2, VolumeX, Maximize, AlertTriangle, CheckCircle2, ArrowUpRight, RotateCcw } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Career } from '../lib/types';

export default function CareerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'future' | 'roadmap' | 'resources'>('overview');

  useEffect(() => {
    fetchCareer();
  }, [id]);

  const fetchCareer = async () => {
    try {
      const res = await fetch(`/api/careers?id=${id}`);
      const data = await res.json();
      setCareer(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0a0a0f] pt-24"><LoadingSpinner text="Loading career details..." /></div>;
  if (!career) return <div className="min-h-screen bg-[#0a0a0f] pt-24 text-center text-gray-400">Career not found</div>;

  const tabs = [
    { key: 'overview', label: 'Overview', icon: Briefcase },
    { key: 'future', label: 'Future 2030+', icon: TrendingUp },
    { key: 'roadmap', label: 'Roadmap', icon: Map },
    { key: 'resources', label: 'Resources', icon: BookOpen },
  ] as const;

  const riskLevel = career.ai_replace_risk;
  const riskColor = riskLevel === 'Low' ? 'text-emerald-400' : riskLevel === 'Medium' ? 'text-amber-400' : 'text-red-400';
  const riskBg = riskLevel === 'Low' ? 'bg-emerald-500/10 border-emerald-500/20' : riskLevel === 'Medium' ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              {career.category}
            </span>
            <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
              {career.demand_level} Demand
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{career.name}</h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">{career.description}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-8 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-500 hover:text-white border border-transparent'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-semibold">What You'll Actually Do</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{career.real_life_work}</p>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-3">
                  <GraduationCap className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-semibold">Education Path</h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">{career.education_path}</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold">Skills Required</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {career.skills_required.split(',').map((s, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-lg bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm">
                    {s.trim()}
                  </span>
                ))}
              </div>
            </div>

            {career.avg_salary_range && (
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-400" />
                  <h3 className="font-semibold">Salary Range</h3>
                </div>
                <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  {career.avg_salary_range}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Future Tab */}
        {activeTab === 'future' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 mb-1">Demand Level</div>
                <div className="text-xl font-bold text-white">{career.demand_level}</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <div className="text-sm text-gray-500 mb-1">Growth Trend</div>
                <div className="text-xl font-bold text-white">{career.growth_trend}</div>
              </div>
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
                <Shield className={`w-8 h-8 ${riskColor} mx-auto mb-2`} />
                <div className="text-sm text-gray-500 mb-1">AI Replace Risk</div>
                <div className={`text-xl font-bold ${riskColor}`}>{career.ai_replace_risk}</div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-4">
                <Brain className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold">AI Impact Analysis</h3>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4">{career.ai_impact}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className={`p-4 rounded-xl border ${riskBg}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${riskColor}`} />
                    <span className="text-sm font-medium text-white">AI Transform Level</span>
                  </div>
                  <p className={`text-sm ${riskColor}`}>{career.ai_transform_level}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-medium text-white">AI Demand Effect</span>
                  </div>
                  <p className="text-sm text-emerald-400">{career.ai_demand_effect}</p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold">2030+ Prediction Summary</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">{career.future_summary}</p>
            </div>
          </motion.div>
        )}

        {/* Roadmap Tab */}
        {activeTab === 'roadmap' && <RoadmapSection careerId={career.id} />}

        {/* Resources Tab */}
        {activeTab === 'resources' && <ResourcesSection careerId={career.id} />}

        {/* Video Section */}
        <CareerVideoPlayer career={career} />
      </div>
    </div>
  );
}

function RoadmapSection({ careerId }: { careerId: number }) {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/roadmaps?career_id=${careerId}`)
      .then(r => r.json())
      .then(d => { setStages(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [careerId]);

  if (loading) return <LoadingSpinner text="Loading roadmap..." />;

  const stageColors = ['emerald', 'cyan', 'violet'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      {stages.map((stage, i) => {
        const color = stageColors[i % 3];
        return (
          <div key={stage.id} className="relative">
            {i < stages.length - 1 && (
              <div className={`absolute left-6 top-16 bottom-0 w-px bg-${color}-500/20`} />
            )}
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center text-${color}-400 font-bold text-lg`}>
                  {stage.stage_order}
                </div>
                <div>
                  <h3 className="font-bold text-white">{stage.stage_name}</h3>
                  <p className="text-xs text-gray-500">{stage.duration_weeks} weeks</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">{stage.description}</p>
              
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {stage.key_skills.split(',').map((s: string, j: number) => (
                    <span key={j} className={`px-2.5 py-1 rounded-md bg-${color}-500/10 text-${color}-400 text-xs`}>
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Weekly Plan</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{stage.weekly_plan}</p>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Milestones</h4>
                <div className="space-y-1.5">
                  {stage.milestones.split('|').map((m: string, j: number) => (
                    <div key={j} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 text-${color}-400/50`} />
                      <span className="text-sm text-gray-400">{m.trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}

function ResourcesSection({ careerId }: { careerId: number }) {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch(`/api/resources?career_id=${careerId}`)
      .then(r => r.json())
      .then(d => { setResources(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [careerId]);

  if (loading) return <LoadingSpinner text="Loading resources..." />;

  const filtered = filter === 'all' ? resources : resources.filter(r => {
    if (filter === 'free') return r.is_free;
    if (filter === 'paid') return !r.is_free;
    return r.skill_level.toLowerCase() === filter;
  });

  const typeIcons: Record<string, string> = {
    'Course': '📚',
    'Video': '🎬',
    'Article': '📄',
    'Tutorial': '💻',
    'Book': '📖',
    'Tool': '🛠️',
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {['all', 'free', 'paid', 'beginner', 'intermediate', 'advanced'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all capitalize ${
              filter === f
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {filtered.map(r => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{typeIcons[r.resource_type] || '📚'}</span>
                <h4 className="font-medium text-white text-sm group-hover:text-emerald-400 transition-colors">{r.title}</h4>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-600 group-hover:text-emerald-400 shrink-0 transition-colors" />
            </div>
            <p className="text-xs text-gray-500 mb-2 line-clamp-2">{r.description}</p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-xs bg-white/[0.05] text-gray-500">{r.platform}</span>
              <span className={`px-2 py-0.5 rounded text-xs ${r.is_free ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                {r.is_free ? 'Free' : 'Paid'}
              </span>
              <span className="px-2 py-0.5 rounded text-xs bg-white/[0.05] text-gray-500 capitalize">{r.skill_level}</span>
            </div>
          </a>
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">No resources match this filter.</div>
      )}
    </motion.div>
  );
}

// ─── Functional Career Video Player with Synced Narration ───

interface VideoSegment {
  text: string;
  startPercent: number;
  endPercent: number;
}

function CareerVideoPlayer({ career }: { career: Career }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState('');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const videoUrl = `/videos/career-${career.id}.mp4`;

  // Build subtitle segments from the video script
  useEffect(() => {
    if (career.video_script) {
      const sentences = career.video_script.match(/[^.!?]+[.!?]+/g) || [career.video_script];
      const segDuration = 100 / Math.max(sentences.length, 1);
      const segs = sentences.map((s, i) => ({
        text: s.trim(),
        startPercent: Math.round(i * segDuration),
        endPercent: Math.round((i + 1) * segDuration),
      }));
      setSegments(segs);
    }
  }, [career.video_script]);

  // Track current subtitle based on video progress
  useEffect(() => {
    const seg = segments.find(
      s => progress >= s.startPercent && progress < s.endPercent
    );
    setCurrentSegment(seg?.text || '');
  }, [progress, segments]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
      setHasStarted(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration);
    setVideoLoaded(true);
  }, []);

  const handleSeek = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    video.currentTime = pct * video.duration;
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setProgress(100);
  }, []);

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play();
    setIsPlaying(true);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  }, []);

  const showControlsTemporarily = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  const formatTime = (t: number) => {
    const mins = Math.floor(t / 60);
    const secs = Math.floor(t % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-violet-500/5 to-pink-500/5 border border-violet-500/10"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
          <Play className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="font-semibold">AI Career Video — {career.name}</h3>
          <p className="text-xs text-gray-500">Professional career explanation • {duration ? formatTime(duration) : '~60s'}</p>
        </div>
      </div>

      {/* Video Container */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden bg-black group cursor-pointer"
        onMouseMove={showControlsTemporarily}
        onMouseEnter={() => setShowControls(true)}
        onClick={(e) => {
          // Only toggle play if clicking the video area, not controls
          if ((e.target as HTMLElement).closest('[data-controls]')) return;
          togglePlay();
        }}
      >
        {/* Aspect ratio wrapper */}
        <div className="relative aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            playsInline
            preload="metadata"
          />

          {/* Play overlay (before first play) */}
          {!hasStarted && videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                className="w-20 h-20 rounded-full bg-violet-500/90 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-violet-500/40 border border-violet-400/30"
              >
                <Play className="w-9 h-9 text-white ml-1" />
              </motion.button>
            </div>
          )}

          {/* Loading state */}
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
              <div className="text-center">
                <div className="w-10 h-10 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {/* Ended overlay */}
          {progress >= 100 && hasStarted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); restart(); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500/90 backdrop-blur-sm text-white font-semibold shadow-2xl shadow-violet-500/40 border border-violet-400/30"
              >
                <RotateCcw className="w-5 h-5" />
                Watch Again
              </motion.button>
            </div>
          )}

          {/* Synced Subtitles */}
          {hasStarted && isPlaying && currentSegment && (
            <motion.div
              key={currentSegment}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-16 left-4 right-4 z-20 pointer-events-none"
            >
              <div className="mx-auto max-w-2xl">
                <p className="text-center text-white text-sm sm:text-base font-medium px-4 py-2.5 rounded-lg bg-black/70 backdrop-blur-sm leading-relaxed">
                  {currentSegment}
                </p>
              </div>
            </motion.div>
          )}

          {/* Controls bar */}
          <div
            data-controls
            className={`absolute bottom-0 left-0 right-0 z-30 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-8 pb-3 px-4">
              {/* Progress bar */}
              <div
                className="w-full h-1.5 rounded-full bg-white/20 mb-3 cursor-pointer group/progress relative"
                onClick={(e) => { e.stopPropagation(); handleSeek(e); }}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-400 to-pink-400 relative transition-all"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg opacity-0 group-hover/progress:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Control buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                    className="text-white hover:text-violet-400 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); restart(); }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-white/60 text-xs font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 text-[10px] font-medium">
                    <Play className="w-2.5 h-2.5" /> AI Career Video
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video content info */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: 'Career Overview', color: 'violet' },
          { label: 'Key Skills', color: 'cyan' },
          { label: '2030+ Outlook', color: 'emerald' },
          { label: 'Motivation', color: 'pink' },
        ].map((item, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-center ${
              progress >= (i * 25) && progress < ((i + 1) * 25)
                ? `bg-${item.color}-500/10 border border-${item.color}-500/20`
                : 'bg-white/[0.02] border border-white/[0.04]'
            }`}
          >
            <p className={`text-[10px] font-medium ${
              progress >= (i * 25) && progress < ((i + 1) * 25)
                ? `text-${item.color}-400`
                : 'text-gray-600'
            }`}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Script toggle */}
      {career.video_script && (
        <details className="mt-4">
          <summary className="text-sm text-gray-500 cursor-pointer hover:text-white transition-colors">
            View narration script
          </summary>
          <p className="mt-2 text-sm text-gray-400 leading-relaxed p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            {career.video_script}
          </p>
        </details>
      )}
    </motion.div>
  );
}


