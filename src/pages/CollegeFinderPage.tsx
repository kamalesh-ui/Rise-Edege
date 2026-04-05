import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, MapPin, BookOpen, Award, ChevronRight,
  Navigation, PenLine, Star, Shield, Target, Sparkles,
  Building2, TrendingUp, CheckCircle2, ArrowLeft, RotateCcw,
  Locate, MapPinned, Trophy, Flame, Gem
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ───
interface College {
  name: string;
  city: string;
  type: 'Government' | 'Aided';
  cutoffMin: number;
  cutoffMax: number;
  courses: string[];
}

interface ScoredCollege extends College {
  score: number;
  eligibility: 'Safe' | 'Target' | 'Dream';
  reason: string;
  matchedCourse: string | null;
  sameCity: boolean;
}

type Step = 'greeting' | 'marks' | 'interest' | 'location' | 'locationManual' | 'results';

// ─── College Dataset (50 TN Colleges) ───
const COLLEGES: College[] = [
  { name: "Presidency College", city: "Chennai", type: "Government", cutoffMin: 85, cutoffMax: 92, courses: ["BCom", "BSc Computer Science", "BA Economics"] },
  { name: "Loyola College", city: "Chennai", type: "Aided", cutoffMin: 90, cutoffMax: 95, courses: ["BCom", "BSc Computer Science", "BA Visual Communication"] },
  { name: "Madras Christian College", city: "Chennai", type: "Aided", cutoffMin: 88, cutoffMax: 92, courses: ["BSc Computer Science", "BCom", "BA Economics"] },
  { name: "Queen Mary's College", city: "Chennai", type: "Government", cutoffMin: 82, cutoffMax: 88, courses: ["BA English", "BSc Physics", "BCom"] },
  { name: "DG Vaishnav College", city: "Chennai", type: "Aided", cutoffMin: 80, cutoffMax: 85, courses: ["BCom", "BSc Computer Science", "BBA"] },
  { name: "Stella Maris College", city: "Chennai", type: "Aided", cutoffMin: 86, cutoffMax: 91, courses: ["BA English", "BSc Computer Science", "BCom"] },
  { name: "Ethiraj College for Women", city: "Chennai", type: "Aided", cutoffMin: 84, cutoffMax: 89, courses: ["BCom", "BSc Computer Science", "BA Economics"] },
  { name: "MOP Vaishnav College", city: "Chennai", type: "Aided", cutoffMin: 83, cutoffMax: 88, courses: ["BSc Computer Science", "BCom", "BBA"] },
  { name: "Pachaiyappa's College", city: "Chennai", type: "Government", cutoffMin: 78, cutoffMax: 84, courses: ["BCom", "BA History", "BSc Maths"] },
  { name: "Government Arts College Nandanam", city: "Chennai", type: "Government", cutoffMin: 76, cutoffMax: 82, courses: ["BSc Computer Science", "BCom", "BA English"] },

  { name: "PSG College of Arts and Science", city: "Coimbatore", type: "Aided", cutoffMin: 88, cutoffMax: 93, courses: ["BSc Computer Science", "BCom", "BBA"] },
  { name: "Government Arts College", city: "Coimbatore", type: "Government", cutoffMin: 75, cutoffMax: 82, courses: ["BSc Computer Science", "BSc Maths", "BCom"] },
  { name: "Bharathiar University", city: "Coimbatore", type: "Government", cutoffMin: 72, cutoffMax: 78, courses: ["BSc Physics", "BCom", "BA English"] },
  { name: "Sri Krishna Arts and Science College", city: "Coimbatore", type: "Aided", cutoffMin: 78, cutoffMax: 83, courses: ["BSc Computer Science", "BCom", "BBA"] },
  { name: "PSGR Krishnammal College", city: "Coimbatore", type: "Aided", cutoffMin: 82, cutoffMax: 87, courses: ["BCom", "BSc Computer Science", "BA English"] },
  { name: "CMS College of Science and Commerce", city: "Coimbatore", type: "Aided", cutoffMin: 76, cutoffMax: 81, courses: ["BCom", "BSc Computer Science", "BBA"] },

  { name: "Madurai Kamaraj University", city: "Madurai", type: "Government", cutoffMin: 70, cutoffMax: 75, courses: ["BSc Computer Science", "BCom", "BA History"] },
  { name: "The American College", city: "Madurai", type: "Aided", cutoffMin: 85, cutoffMax: 89, courses: ["BSc Physics", "BA English", "BCom"] },
  { name: "Fatima College", city: "Madurai", type: "Aided", cutoffMin: 80, cutoffMax: 84, courses: ["BCom", "BSc Computer Science", "BA Economics"] },
  { name: "Thiagarajar College", city: "Madurai", type: "Aided", cutoffMin: 82, cutoffMax: 86, courses: ["BSc Computer Science", "BSc Physics", "BCom"] },
  { name: "Lady Doak College", city: "Madurai", type: "Aided", cutoffMin: 83, cutoffMax: 87, courses: ["BA English", "BSc Computer Science", "BCom"] },

  { name: "Periyar University", city: "Salem", type: "Government", cutoffMin: 72, cutoffMax: 78, courses: ["BSc Physics", "BCom", "BA English"] },
  { name: "Government Arts College", city: "Salem", type: "Government", cutoffMin: 75, cutoffMax: 80, courses: ["BSc Computer Science", "BSc Maths", "BCom"] },
  { name: "Sri Sarada College for Women", city: "Salem", type: "Aided", cutoffMin: 78, cutoffMax: 82, courses: ["BA English", "BCom", "BSc Maths"] },
  { name: "AVS College of Arts and Science", city: "Salem", type: "Aided", cutoffMin: 74, cutoffMax: 79, courses: ["BSc Computer Science", "BCom", "BBA"] },

  { name: "Bharathidasan University", city: "Trichy", type: "Government", cutoffMin: 75, cutoffMax: 80, courses: ["BSc Computer Science", "BCom", "BA History"] },
  { name: "National College", city: "Trichy", type: "Aided", cutoffMin: 82, cutoffMax: 87, courses: ["BCom", "BSc Computer Science", "BA English"] },
  { name: "Holy Cross College", city: "Trichy", type: "Aided", cutoffMin: 88, cutoffMax: 90, courses: ["BSc Computer Science", "BA English", "BCom"] },
  { name: "St. Joseph's College", city: "Trichy", type: "Aided", cutoffMin: 84, cutoffMax: 88, courses: ["BSc Physics", "BCom", "BA Economics"] },
  { name: "Jamal Mohamed College", city: "Trichy", type: "Aided", cutoffMin: 77, cutoffMax: 82, courses: ["BCom", "BSc Computer Science", "BBA"] },

  { name: "Manonmaniam Sundaranar University", city: "Tirunelveli", type: "Government", cutoffMin: 70, cutoffMax: 74, courses: ["BSc Computer Science", "BCom", "BA Tamil"] },
  { name: "St. Xavier's College", city: "Tirunelveli", type: "Aided", cutoffMin: 85, cutoffMax: 88, courses: ["BSc Physics", "BCom", "BA English"] },
  { name: "Sadakathullah Appa College", city: "Tirunelveli", type: "Government", cutoffMin: 72, cutoffMax: 76, courses: ["BSc Computer Science", "BCom", "BSc Maths"] },
  { name: "Sarah Tucker College", city: "Tirunelveli", type: "Aided", cutoffMin: 79, cutoffMax: 83, courses: ["BA English", "BCom", "BSc Computer Science"] },

  { name: "Government Arts College", city: "Erode", type: "Government", cutoffMin: 73, cutoffMax: 77, courses: ["BSc Computer Science", "BCom", "BSc Maths"] },
  { name: "Vellalar College of Arts and Science", city: "Erode", type: "Aided", cutoffMin: 80, cutoffMax: 83, courses: ["BSc Computer Science", "BCom", "BBA"] },
  { name: "Chikkanna Government Arts College", city: "Erode", type: "Government", cutoffMin: 71, cutoffMax: 76, courses: ["BCom", "BA English", "BSc Maths"] },
  { name: "Kongu Arts and Science College", city: "Erode", type: "Aided", cutoffMin: 77, cutoffMax: 81, courses: ["BSc Computer Science", "BCom", "BBA"] },

  { name: "Government Arts College", city: "Dindigul", type: "Government", cutoffMin: 70, cutoffMax: 75, courses: ["BSc Computer Science", "BCom", "BSc Maths"] },
  { name: "Arulmigu Palaniandavar College", city: "Dindigul", type: "Aided", cutoffMin: 78, cutoffMax: 81, courses: ["BSc Physics", "BCom", "BA Tamil"] },
  { name: "GTN Arts College", city: "Dindigul", type: "Aided", cutoffMin: 74, cutoffMax: 79, courses: ["BSc Computer Science", "BCom", "BA English"] },

  { name: "Rajah Serfoji College", city: "Thanjavur", type: "Aided", cutoffMin: 75, cutoffMax: 80, courses: ["BCom", "BA English", "BSc Maths"] },
  { name: "Bharathidasan University College", city: "Thanjavur", type: "Government", cutoffMin: 72, cutoffMax: 77, courses: ["BSc Computer Science", "BCom", "BA History"] },
  { name: "Periyar Maniammai University", city: "Thanjavur", type: "Aided", cutoffMin: 70, cutoffMax: 76, courses: ["BSc Computer Science", "BCom", "BBA"] },
  { name: "ACST College", city: "Thanjavur", type: "Aided", cutoffMin: 73, cutoffMax: 78, courses: ["BCom", "BA English", "BSc Physics"] },

  { name: "Voorhees College", city: "Vellore", type: "Aided", cutoffMin: 80, cutoffMax: 85, courses: ["BSc Physics", "BCom", "BA English"] },
  { name: "Thiruvalluvar University", city: "Vellore", type: "Government", cutoffMin: 72, cutoffMax: 76, courses: ["BSc Computer Science", "BCom", "BA Tamil"] },
  { name: "DKM College for Women", city: "Vellore", type: "Aided", cutoffMin: 77, cutoffMax: 82, courses: ["BSc Computer Science", "BCom", "BA English"] },
  { name: "Islamiah College", city: "Vellore", type: "Aided", cutoffMin: 74, cutoffMax: 79, courses: ["BCom", "BSc Maths", "BA English"] },
  { name: "Sacred Heart College", city: "Vellore", type: "Aided", cutoffMin: 81, cutoffMax: 86, courses: ["BSc Computer Science", "BCom", "BSc Physics"] }
];

const INTERESTS = [
  { label: 'BSc Computer Science', icon: '💻', keywords: ['BSc Computer Science'] },
  { label: 'BCom (Commerce)', icon: '📊', keywords: ['BCom', 'BBA'] },
  { label: 'BA Arts / English / History', icon: '📖', keywords: ['BA English', 'BA History', 'BA Economics', 'BA Tamil', 'BA Visual Communication'] },
  { label: 'BSc Science (Physics / Chemistry / Maths)', icon: '🔬', keywords: ['BSc Physics', 'BSc Maths', 'BSc Chemistry'] },
  { label: 'Engineering Related', icon: '⚙️', keywords: ['BSc Computer Science', 'BSc Physics', 'BSc Maths'] },
  { label: 'Data Science / AI / IT', icon: '🤖', keywords: ['BSc Computer Science', 'BBA'] },
  { label: 'Others', icon: '🎯', keywords: [] },
];

const CITIES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Trichy',
  'Erode', 'Tirunelveli', 'Thanjavur', 'Vellore', 'Dindigul'
];

// ─── Helper: interest → course matching ───
function getMatchingCourses(interest: string): string[] {
  const found = INTERESTS.find(i => i.label === interest);
  return found ? found.keywords : [];
}

// ─── Scoring + matching ───
function scoreColleges(
  percentage: number,
  interest: string,
  city: string
): ScoredCollege[] {
  const matchingCourses = getMatchingCourses(interest);

  const scored: ScoredCollege[] = COLLEGES.map(college => {
    let score = 0;
    let eligibility: 'Safe' | 'Target' | 'Dream';
    const reasons: string[] = [];

    // Eligibility
    if (percentage > college.cutoffMax) {
      eligibility = 'Safe';
      score += (percentage - college.cutoffMin);
      reasons.push('Your marks comfortably exceed the cutoff');
    } else if (percentage >= college.cutoffMin) {
      eligibility = 'Target';
      score += (percentage - college.cutoffMin);
      reasons.push('Your marks are within the competitive range');
    } else {
      eligibility = 'Dream';
      score += Math.max(0, percentage - college.cutoffMin + 10);
      reasons.push('An aspirational choice — aim high!');
    }

    // Interest match
    const matchedCourse = college.courses.find(c =>
      matchingCourses.some(mc => c.toLowerCase().includes(mc.toLowerCase()) || mc.toLowerCase().includes(c.toLowerCase()))
    ) || null;

    if (matchedCourse) {
      score += 10;
      reasons.push(`Offers your preferred course: ${matchedCourse}`);
    }

    // City match
    const sameCity = college.city.toLowerCase() === city.toLowerCase();
    if (sameCity) {
      score += 10;
      reasons.push(`Located in your city: ${college.city}`);
    }

    // Quality bonus
    if (college.type === 'Government') score += 3;

    return {
      ...college,
      score,
      eligibility,
      matchedCourse,
      sameCity,
      reason: reasons.join(' • '),
    };
  });

  // Filter: only eligible or close
  const eligible = scored.filter(c => c.eligibility === 'Safe' || c.eligibility === 'Target');
  const dreams = scored.filter(c => c.eligibility === 'Dream').sort((a, b) => b.score - a.score).slice(0, 5);

  const combined = [...eligible, ...dreams];

  // Sort: Government first, then by score
  combined.sort((a, b) => {
    if (a.type === 'Government' && b.type !== 'Government') return -1;
    if (a.type !== 'Government' && b.type === 'Government') return 1;
    return b.score - a.score;
  });

  return combined;
}

// ─── Main Component ───
export default function CollegeFinderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('greeting');
  const [marks, setMarks] = useState('');
  const [maxMarks, setMaxMarks] = useState('600');
  const [interest, setInterest] = useState('');
  const [city, setCity] = useState('');
  const [manualCity, setManualCity] = useState('');
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [results, setResults] = useState<ScoredCollege[]>([]);
  const [percentage, setPercentage] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'Government' | 'Aided'>('all');
  const [filterEligibility, setFilterEligibility] = useState<'all' | 'Safe' | 'Target' | 'Dream'>('all');

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 150);
  }, [step, results]);

  // GPS reverse geocode
  const handleGPS = useCallback(async () => {
    setGpsLoading(true);
    setGpsError('');
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
      });
      const { latitude, longitude } = pos.coords;
      // Reverse geocode using free API
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`
      );
      const data = await res.json();
      const detectedCity = data?.address?.city || data?.address?.town || data?.address?.state_district || data?.address?.county || '';
      // Try to match to our known cities
      const matched = CITIES.find(c => detectedCity.toLowerCase().includes(c.toLowerCase()));
      if (matched) {
        setCity(matched);
        proceedToResults(matched);
      } else {
        setGpsError(`Detected: ${detectedCity || 'Unknown'}. Please select your nearest city manually.`);
        setStep('locationManual');
      }
    } catch {
      setGpsError('Could not detect location. Please select your city manually.');
      setStep('locationManual');
    } finally {
      setGpsLoading(false);
    }
  }, [marks, maxMarks, interest]);

  const proceedToResults = useCallback((selectedCity: string) => {
    const pct = Math.round((parseInt(marks) / parseInt(maxMarks)) * 100);
    setPercentage(pct);
    const scored = scoreColleges(pct, interest, selectedCity);
    setResults(scored);
    setStep('results');
  }, [marks, maxMarks, interest]);

  const handleMarksSubmit = () => {
    const m = parseInt(marks);
    const mx = parseInt(maxMarks);
    if (isNaN(m) || m < 0 || m > mx) return;
    setStep('interest');
  };

  const handleInterestSelect = (label: string) => {
    setInterest(label);
    setStep('location');
  };

  const handleCitySelect = (c: string) => {
    setCity(c);
    setManualCity(c);
    proceedToResults(c);
  };

  const reset = () => {
    setStep('greeting');
    setMarks('');
    setMaxMarks('600');
    setInterest('');
    setCity('');
    setManualCity('');
    setResults([]);
    setGpsError('');
    setFilterType('all');
    setFilterEligibility('all');
  };

  const filteredResults = results.filter(c => {
    if (filterType !== 'all' && c.type !== filterType) return false;
    if (filterEligibility !== 'all' && c.eligibility !== filterEligibility) return false;
    return true;
  });

  const safeCount = results.filter(c => c.eligibility === 'Safe').length;
  const targetCount = results.filter(c => c.eligibility === 'Target').length;
  const dreamCount = results.filter(c => c.eligibility === 'Dream').length;

  const eligBadge = (e: string) => {
    if (e === 'Safe') return { bg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400', icon: Shield, label: 'Safe' };
    if (e === 'Target') return { bg: 'bg-amber-500/10 border-amber-500/20 text-amber-400', icon: Target, label: 'Target' };
    return { bg: 'bg-rose-500/10 border-rose-500/20 text-rose-400', icon: Flame, label: 'Dream' };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* Back + Reset header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          {step !== 'greeting' && (
            <button onClick={reset} className="flex items-center gap-2 text-gray-500 hover:text-rose-400 text-sm transition-colors">
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          )}
        </div>

        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <GraduationCap className="w-6 h-6 text-[#0a0a0f]" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">College Finder</h1>
            <p className="text-gray-500 text-sm">AI-powered admission counselor for Tamil Nadu</p>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center gap-1 mb-2">
            {['greeting', 'marks', 'interest', 'location', 'results'].map((s, i) => {
              const stepOrder = ['greeting', 'marks', 'interest', 'location', 'results'];
              const currentIdx = stepOrder.indexOf(step === 'locationManual' ? 'location' : step);
              const isCompleted = i < currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={s} className="flex-1 flex items-center gap-1">
                  <div className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                    isCurrent ? 'bg-amber-400/40' : 'bg-white/[0.06]'
                  }`} />
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-600 px-1">
            <span>Welcome</span><span>Marks</span><span>Interest</span><span>Location</span><span>Results</span>
          </div>
        </div>

        {/* ─── STEP: GREETING ─── */}
        <AnimatePresence mode="wait">
          {step === 'greeting' && (
            <StepWrapper key="greeting">
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', bounce: 0.4 }}
                  className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/30"
                >
                  <GraduationCap className="w-10 h-10 text-[#0a0a0f]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                  Welcome to Smart College Finder 🎓
                </h2>
                <p className="text-gray-400 max-w-lg mx-auto leading-relaxed mb-8">
                  Let's find the best colleges for you based on your marks, interest, and location.
                  I'll guide you step by step — just like a personal admission counselor.
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-8">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Award className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-[11px] text-gray-500">50 Colleges</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <MapPin className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                    <p className="text-[11px] text-gray-500">10 Cities</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <Sparkles className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                    <p className="text-[11px] text-gray-500">AI Matched</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep('marks')}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold text-lg shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-shadow"
                >
                  Let's Begin
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP: MARKS ─── */}
          {step === 'marks' && (
            <StepWrapper key="marks">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Step 1: Enter Your Marks</h3>
                    <p className="text-gray-500 text-sm">Tell me your exam score so I can find the right colleges</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Total marks obtained</label>
                    <input
                      type="number"
                      value={marks}
                      onChange={e => setMarks(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleMarksSubmit()}
                      placeholder="e.g. 480"
                      min={0}
                      max={parseInt(maxMarks)}
                      className="w-full px-4 py-3.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-lg placeholder:text-gray-600 focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Out of (maximum marks)</label>
                    <div className="flex gap-2">
                      {['500', '600'].map(m => (
                        <button
                          key={m}
                          onClick={() => setMaxMarks(m)}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-semibold border transition-all ${
                            maxMarks === m
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                              : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white hover:border-white/10'
                          }`}
                        >
                          Out of {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {marks && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10"
                    >
                      <p className="text-sm text-gray-400">
                        Your percentage: <span className="text-amber-400 font-bold text-lg">
                          {Math.round((parseInt(marks || '0') / parseInt(maxMarks)) * 100)}%
                        </span>
                      </p>
                    </motion.div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleMarksSubmit}
                    disabled={!marks || parseInt(marks) < 0 || parseInt(marks) > parseInt(maxMarks)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                  >
                    Continue
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP: INTEREST ─── */}
          {step === 'interest' && (
            <StepWrapper key="interest">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Step 2: What is Your Interest?</h3>
                    <p className="text-gray-500 text-sm">Select the field you're most passionate about</p>
                  </div>
                </div>

                <div className="grid gap-2">
                  {INTERESTS.map(i => (
                    <motion.button
                      key={i.label}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => handleInterestSelect(i.label)}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-cyan-500/20 hover:bg-cyan-500/[0.03] transition-all text-left group"
                    >
                      <span className="text-2xl">{i.icon}</span>
                      <span className="flex-1 font-medium text-gray-300 group-hover:text-white transition-colors">{i.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP: LOCATION ─── */}
          {step === 'location' && (
            <StepWrapper key="location">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Step 3: Select Your Location</h3>
                    <p className="text-gray-500 text-sm">We'll prioritize colleges near you</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGPS}
                    disabled={gpsLoading}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-violet-500/5 border border-violet-500/20 hover:bg-violet-500/10 transition-all"
                  >
                    {gpsLoading ? (
                      <Locate className="w-8 h-8 text-violet-400 animate-pulse" />
                    ) : (
                      <Navigation className="w-8 h-8 text-violet-400" />
                    )}
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">Use GPS 📍</p>
                      <p className="text-xs text-gray-500 mt-1">Auto-detect your city</p>
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('locationManual')}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-violet-500/20 hover:bg-violet-500/[0.03] transition-all"
                  >
                    <PenLine className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="font-semibold text-white text-sm">Enter City Manually ✍️</p>
                      <p className="text-xs text-gray-500 mt-1">Choose from list</p>
                    </div>
                  </motion.button>
                </div>

                {gpsError && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-amber-400 bg-amber-500/5 border border-amber-500/10 rounded-lg p-3 mt-3"
                  >
                    {gpsError}
                  </motion.p>
                )}
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP: LOCATION MANUAL ─── */}
          {step === 'locationManual' && (
            <StepWrapper key="locationManual">
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                    <MapPinned className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Select Your City</h3>
                    <p className="text-gray-500 text-sm">Choose the city nearest to you</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CITIES.map(c => (
                    <motion.button
                      key={c}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleCitySelect(c)}
                      className={`p-3.5 rounded-xl text-sm font-medium border transition-all ${
                        manualCity === c
                          ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                          : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:text-white hover:border-violet-500/20 hover:bg-violet-500/5'
                      }`}
                    >
                      <MapPin className="w-4 h-4 mx-auto mb-1 opacity-50" />
                      {c}
                    </motion.button>
                  ))}
                </div>
              </div>
            </StepWrapper>
          )}

          {/* ─── STEP: RESULTS ─── */}
          {step === 'results' && (
            <StepWrapper key="results">
              {/* Summary card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 border border-amber-500/10 mb-6"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold">Your Profile Summary</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">Marks</p>
                    <p className="text-lg font-bold text-amber-400">{percentage}%</p>
                    <p className="text-[10px] text-gray-600">{marks}/{maxMarks}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">Interest</p>
                    <p className="text-sm font-semibold text-cyan-400 mt-1 leading-tight">{interest.split(' ')[0]}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">City</p>
                    <p className="text-sm font-semibold text-violet-400 mt-1">{city}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                    <p className="text-[10px] text-gray-600 uppercase tracking-wider">Matches</p>
                    <p className="text-lg font-bold text-emerald-400">{results.length}</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats pills */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <Shield className="w-3 h-3" /> {safeCount} Safe
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                  <Target className="w-3 h-3" /> {targetCount} Target
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                  <Flame className="w-3 h-3" /> {dreamCount} Dream
                </span>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  {(['all', 'Government', 'Aided'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterType(f)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        filterType === f
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All Types' : f}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                  {(['all', 'Safe', 'Target', 'Dream'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilterEligibility(f)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        filterEligibility === f
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
              </div>

              {/* College cards */}
              <div className="space-y-3">
                {filteredResults.map((college, i) => {
                  const badge = eligBadge(college.eligibility);
                  const BadgeIcon = badge.icon;
                  return (
                    <motion.div
                      key={`${college.name}-${college.city}-${i}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.04, 0.6) }}
                      className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-amber-500/15 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <h4 className="font-bold text-white group-hover:text-amber-400 transition-colors">
                              {college.name}
                            </h4>
                            {i < 3 && college.eligibility !== 'Dream' && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                                <Trophy className="w-3 h-3 text-amber-400" />
                                <span className="text-[10px] text-amber-400 font-bold">TOP PICK</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {college.city}
                              {college.sameCity && <span className="text-violet-400 ml-0.5">(Your city)</span>}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              college.type === 'Government'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            }`}>
                              {college.type}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badge.bg}`}>
                            <BadgeIcon className="w-3 h-3" />
                            {badge.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <Gem className="w-3 h-3 text-amber-400" />
                            <span className="text-sm font-bold text-amber-400">{college.score}</span>
                            <span className="text-[10px] text-gray-600">pts</span>
                          </div>
                        </div>
                      </div>

                      {/* Courses */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {college.courses.map(c => (
                          <span
                            key={c}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border ${
                              college.matchedCourse === c
                                ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                                : 'bg-white/[0.03] border-white/[0.04] text-gray-500'
                            }`}
                          >
                            {college.matchedCourse === c && '✓ '}{c}
                          </span>
                        ))}
                      </div>

                      {/* Cutoff bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-[10px] text-gray-600 mb-1">
                          <span>Cutoff Range</span>
                          <span>{college.cutoffMin}% — {college.cutoffMax}%</span>
                        </div>
                        <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-amber-500/30 to-amber-500/60"
                            style={{ width: `${college.cutoffMax}%` }}
                          />
                          <div
                            className="absolute top-0 h-full w-0.5 bg-white/60"
                            style={{ left: `${Math.min(percentage, 100)}%` }}
                            title={`Your marks: ${percentage}%`}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] mt-1">
                          <span className="text-gray-600">0%</span>
                          <span className="text-amber-400 font-medium">You: {percentage}%</span>
                          <span className="text-gray-600">100%</span>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-400 leading-relaxed">{college.reason}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredResults.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500">No colleges match the current filters.</p>
                  <button onClick={() => { setFilterType('all'); setFilterEligibility('all'); }} className="mt-3 text-amber-400 text-sm hover:underline">
                    Clear filters
                  </button>
                </div>
              )}

              {/* Counselor tip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 border border-emerald-500/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-sm">🧑‍🏫 Counselor's Tip</h4>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {percentage >= 85
                    ? `Excellent score! You have strong chances at top-tier colleges. Focus on "Safe" picks for guaranteed admission, but don't hesitate to apply to "Target" colleges too — your marks are competitive.`
                    : percentage >= 70
                    ? `Good score! Apply to a mix of "Safe" and "Target" colleges. Government colleges offer great value — prioritize those. Consider your city preference for convenience during studies.`
                    : `Your score opens doors to many good colleges. Focus on "Safe" picks and consider government colleges for affordability. Your interest area matters more than prestige — choose a course you'll enjoy!`
                  }
                </p>
              </motion.div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/15 transition-all font-medium"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Different Inputs
                </button>
                <button
                  onClick={() => navigate('/chat')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-[#0a0a0f] font-bold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-all"
                >
                  <Building2 className="w-4 h-4" />
                  Ask AI Assistant
                </button>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

// ─── Step animation wrapper ───
function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
