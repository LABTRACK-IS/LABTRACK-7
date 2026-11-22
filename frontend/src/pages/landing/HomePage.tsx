import React, { useState, useEffect, memo } from 'react';
import { Link } from "react-router-dom";
import { 
  ArrowRight, ShieldCheck, Activity, Bot, 
  Wrench, Sparkles, Building2, FileText, 
  CheckCircle2, Users, Lock,
  CalendarRange, Maximize2, X, Crown, Code2,
  Database, Layout, FileSpreadsheet
} from "lucide-react";

const BASE_BAR_HEIGHTS = [65, 80, 45, 90, 75, 88, 92, 70, 85, 60, 95, 82, 78, 88, 94];

// ============================================================================
// ISOLATED GPU-ACCELERATED TELEMETRY WIDGET (Hindi nagre-render ang buong page)
// ============================================================================
const LiveTelemetryNodeWidget: React.FC = memo(() => {
  const [telemetryCount, setTelemetryCount] = useState<number>(150525);
  const [activeNodesCount, setActiveNodesCount] = useState<number>(123);
  const [cpuUsage, setCpuUsage] = useState<number>(24.8);
  const [activeTab, setActiveTab] = useState<'analytics' | 'network' | 'thermals'>('analytics');

  // Lightweight numeric update (Runs only inside the compact metric box)
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetryCount((prev) => prev + Math.floor(Math.random() * 12) + 4);
      setCpuUsage(() => Number((20 + Math.random() * 14).toFixed(1)));
      setActiveNodesCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.min(130, Math.max(118, prev + delta));
      });
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full max-w-lg aspect-auto sm:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-tr from-blue-700/60 via-blue-600/50 to-indigo-800/60 p-1.5 border border-white/20 gpu-layer">
      <div className="w-full h-full bg-slate-950/95 rounded-2xl p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden space-y-4">
        
        {/* Interactive Header Bar */}
        <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-3 gap-2 text-xs font-sans">
          <div className="flex items-center gap-2 text-white font-bold">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] sm:text-xs">LIVE TELEMETRY NODE</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-[10px]">
            <button 
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('network')}
              className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${activeTab === 'network' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Net
            </button>
            <button 
              type="button"
              onClick={() => setActiveTab('thermals')}
              className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${activeTab === 'thermals' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Temp
            </button>
          </div>

          <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded font-bold text-[10px]">
            - SYNC ACTIVE
          </span>
        </div>

        {/* 60FPS Pure GPU Bar Chart (Gamit ang transform: scaleY imbes na height reflow) */}
        <div className="my-2 space-y-2">
          <div className="flex justify-between text-[11px] font-sans text-slate-400">
            <span>Network Traffic Index</span>
            <span className="text-cyan-400 font-bold">{telemetryCount.toLocaleString()} events</span>
          </div>

          <div className="h-28 sm:h-32 flex items-end justify-between gap-1 sm:gap-1.5 pt-2 w-full overflow-hidden">
            {BASE_BAR_HEIGHTS.map((baseHeight, idx) => (
              <div
                key={idx}
                className={`w-full h-full rounded-t gpu-bar ${
                  activeTab === 'thermals'
                    ? 'bg-amber-500 hover:bg-red-400'
                    : activeTab === 'network'
                    ? 'bg-cyan-500 hover:bg-blue-400'
                    : 'bg-blue-500 hover:bg-cyan-400'
                }`}
                style={{
                  animationDelay: `${idx * -0.18}s`,
                  ['--base-scale' as string]: baseHeight / 100,
                }}
              />
            ))}
          </div>
        </div>

        {/* Overlay Badge Status */}
        <div className="p-3 bg-slate-900 rounded-xl text-slate-100 flex items-center justify-between border border-slate-800 shadow-lg font-sans text-xs">
          <div>
            <span className="text-[10px] font-bold text-blue-400 block uppercase">Workstation Status</span>
            <h4 className="text-xs font-black text-white">{activeNodesCount} / 130 Nodes Active</h4>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">CPU Load</span>
            <span className="text-xs font-bold text-emerald-400">{cpuUsage}% Avg</span>
          </div>
        </div>

      </div>
    </div>
  );
});

export const HomePage: React.FC = () => {
  // Interactive Team & Gantt Spotlight States
  const [selectedTeamIdx, setSelectedTeamIdx] = useState<number>(0);
  const [isChartZoomed, setIsChartZoomed] = useState<boolean>(false);

  // Unique Bento Cards Data para sa Home Page Gantt & Team Section
  const homeTeamBento = [
    {
      step: "01",
      name: "Mary Aprilieta Aligato",
      role: "Project Manager",
      timeline: "Months 1 – 6",
      task: "Project Charter, Timeline Governance & Final Defense QA",
      desc: "Organizes project tasks and deadlines, monitors member contributions, and ensures all activities meet the institutional plan.",
      icon: Crown,
      accentBorder: "hover:border-pink-500/60",
      activeBorder: "border-pink-500",
      badge: "bg-pink-500/15 text-pink-300 border-pink-500/30",
      barColor: "from-pink-500 to-rose-400"
    },
    {
      step: "02",
      name: "Cora Cayetano",
      role: "Business / System Analyst",
      timeline: "Months 1 – 3",
      task: "System Requirements, Workflow Analysis & Functional Specs",
      desc: "Identifies the core laboratory problems, gathers user requirements, and bridges operational needs with system design.",
      icon: FileSpreadsheet,
      accentBorder: "hover:border-sky-500/60",
      activeBorder: "border-sky-500",
      badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      barColor: "from-sky-500 to-blue-400"
    },
    {
      step: "03",
      name: "Dhan Lester Igdao",
      role: "UI/UX Designer",
      timeline: "Months 2 – 5",
      task: "3D Glassmorphic Layout, Wireframes & Interactive Prototypes",
      desc: "Plans the visual appearance, creates responsive interface prototypes, and ensures clear navigation across all portals.",
      icon: Layout,
      accentBorder: "hover:border-amber-500/60",
      activeBorder: "border-amber-500",
      badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      barColor: "from-amber-500 to-orange-400"
    },
    {
      step: "04",
      name: "John Sven Morales",
      role: "Programmer / Developer",
      timeline: "Months 3 – 6",
      task: "Full-Stack React, C# .NET 8 Core API & Python FastAPI AI",
      desc: "Turns approved designs into working features, writes system code, connects live database telemetry, and debugs the platform.",
      icon: Code2,
      accentBorder: "hover:border-emerald-500/60",
      activeBorder: "border-emerald-500",
      badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      barColor: "from-emerald-500 to-teal-400"
    },
    {
      step: "05",
      name: "Aviegel Fernandez",
      role: "Database Designer",
      timeline: "Months 2 – 5",
      task: "PostgreSQL Relational Architecture, Tables & Data Integrity",
      desc: "Plans how system data is organized, designs relational tables and keys, and maintains consistent database records.",
      icon: Database,
      accentBorder: "hover:border-purple-500/60",
      activeBorder: "border-purple-500",
      badge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
      barColor: "from-purple-500 to-indigo-400"
    }
  ];

  const activeMember = homeTeamBento[selectedTeamIdx] || homeTeamBento[0];

  return (
    <div className="w-full min-h-screen font-sans select-none text-slate-100 overflow-hidden relative flex flex-col justify-center">
      
      {/* PURE 60FPS GPU COMPOSITOR STYLES (ZERO CPU REFLOW / ZERO LAG) */}
      <style>{`
        .gpu-layer {
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .static-hero-glow {
          text-shadow: 0 0 18px rgba(255, 255, 255, 0.75), 0 0 32px rgba(255, 255, 255, 0.35);
        }

        @keyframes gpu-bar-wave {
          0%, 100% {
            transform: scaleY(calc(var(--base-scale, 0.7) * 0.82));
          }
          50% {
            transform: scaleY(calc(var(--base-scale, 0.7) * 1.04));
          }
        }

        .gpu-bar {
          transform-origin: bottom;
          will-change: transform;
          animation: gpu-bar-wave 2.4s ease-in-out infinite;
        }

        .bento-3d-card {
          transform: translateZ(0);
          backface-visibility: hidden;
          transition: transform 0.25s cubic-bezier(0.22, 1, 0.36, 1), border-color 0.25s ease;
          will-change: transform;
        }

        .bento-3d-card:hover {
          transform: translate3d(0, -5px, 0);
        }
      `}</style>

      {/* 1. HERO SECTION */}
      <section className="relative w-full py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* KALIWANG BAHAGI */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              
              {/* BADGE */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-900 text-xs font-black tracking-widest uppercase shadow-lg">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>LabTrack System Portal</span>
              </div>

              {/* TITLE */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.05] flex flex-col gap-2">
                <span className="text-black static-hero-glow">
                  Smart Laboratory
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400 drop-shadow-md">
                  Management &amp; <br /> Telemetry
                </span>
              </h1>

              {/* SUBTITLE */}
              <p className="text-base sm:text-xl text-white leading-relaxed max-w-xl font-extrabold drop-shadow-md">
                The ultimate facility management solution for JRMSU. Experience real-time workstation tracking, automated hardware diagnostics, and a seamless digital environment for students and faculty.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
                <Link
                  to="/login/admin"
                  className="bento-3d-card px-6 sm:px-8 py-3.5 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-xs sm:text-sm shadow-lg flex items-center gap-2.5 active:scale-95"
                >
                  <span>ACCESS PORTAL</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/laboratories"
                  className="bento-3d-card px-6 sm:px-8 py-3.5 sm:py-4 bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 shadow-xl rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 active:scale-95"
                >
                  <span>EXPLORE FACILITIES</span>
                </Link>
              </div>

            </div>

            {/* KANANG BAHAGI: ISOLATED 60FPS LIVE TELEMETRY WIDGET */}
            <div className="lg:col-span-6 relative flex justify-center w-full">
              <LiveTelemetryNodeWidget />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE SYSTEM MODULES / OUR SERVICES */}
      <section className="py-16 sm:py-24 bg-slate-950/80 border-t border-white/10 gpu-layer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="space-y-3">
              <span className="text-xs font-black text-blue-400 uppercase tracking-widest block font-sans">
                System Modules
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-lg leading-tight">
                Comprehensive Laboratory <br className="hidden sm:inline" />
                Solutions
              </h2>
            </div>

            <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
              <p className="text-sm font-bold text-slate-300 leading-relaxed drop-shadow-md">
                Empowering JRMSU with state-of-the-art facility management, secure access, and real-time diagnostics for an optimized learning environment.
              </p>
              <Link
                to="/laboratories"
                className="bento-3d-card px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-white/20 text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-lg"
              >
                <span>VIEW ALL FACILITIES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1 */}
            <div className="bento-3d-card relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=600"
                alt="Cyber Security"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                <ShieldCheck className="w-8 h-8 text-blue-400 mb-2" />
                <h3 className="text-lg font-black">Asset Security</h3>
                <p className="text-xs font-bold text-slate-300 line-clamp-2">Advanced encryption and role-based access control for all laboratory nodes.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bento-3d-card relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71°C?auto=format&fit=crop&q=80&w=600"
                alt="Digital Telemetry"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                <Activity className="w-8 h-8 text-cyan-400 mb-2" />
                <h3 className="text-lg font-black">Digital Telemetry</h3>
                <p className="text-xs font-bold text-slate-300 line-clamp-2">Real-time monitoring of workstation status, CPU load, and network traffic.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bento-3d-card relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=600"
                alt="AI Diagnostics"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                <Bot className="w-8 h-8 text-amber-400 mb-2" />
                <h3 className="text-lg font-black">AI Diagnostics</h3>
                <p className="text-xs font-bold text-slate-300 line-clamp-2">Intelligent system health alerts and automated troubleshooting assistance.</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bento-3d-card relative rounded-3xl overflow-hidden h-80 group border border-white/10 shadow-xl bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600"
                alt="Hardware Maintenance"
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white space-y-2">
                <Wrench className="w-8 h-8 text-emerald-400 mb-2" />
                <h3 className="text-lg font-black">Hardware Maintenance</h3>
                <p className="text-xs font-bold text-slate-300 line-clamp-2">Streamlined ticketing and rapid technician dispatch workflows.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. PROJECT GANTT CHART & TEAM MATRIX BENTO SHOWCASE (SMOOTH & ALIGNED) */}
      <section className="py-16 sm:py-24 bg-slate-950/90 border-t border-white/10 gpu-layer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-10">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-cyan-300 text-xs font-mono font-bold uppercase tracking-widest">
                <CalendarRange className="w-3.5 h-3.5 text-blue-400" />
                <span>System Creators &amp; Engineering Timeline</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                Project Gantt Chart &amp; <span className="text-blue-400">Team Matrix</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-2xl leading-relaxed">
                Engineered through a synchronized 5-role software lifecycle—combining project governance, system analysis, 3D UI/UX design, full-stack development, and relational database architecture.
              </p>
            </div>

            <Link
              to="/about"
              className="bento-3d-card px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-black font-mono flex items-center gap-2 w-fit shrink-0"
            >
              <span>FULL SYSTEM BLUEPRINT</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* TOP SPLIT SPOTLIGHT: GANTT CHART WINDOW (5 COLS) + ACTIVE MEMBER SPOTLIGHT & 2 TOP CARDS (7 COLS) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* KALIWA: SAKTONG-SAKTO NA GANTT CHART IMAGE VIEWER (5 COLS) */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl bg-slate-900 border border-white/15 p-4 sm:p-5 shadow-xl">
              <div className="space-y-3">
                {/* Window Header */}
                <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-slate-200 font-bold ml-1.5">LabTrack_Gantt_Chart</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChartZoomed(true)}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 font-bold cursor-pointer transition-colors"
                  >
                    <Maximize2 className="w-3 h-3" /> Expand
                  </button>
                </div>

                {/* Image Frame (Saktong Laki at Malinaw) */}
                <div
                  onClick={() => setIsChartZoomed(true)}
                  title="Click to zoom chart"
                  className="group relative rounded-2xl bg-slate-950 border border-slate-800 p-2.5 flex items-center justify-center overflow-hidden cursor-pointer"
                >
                  <img
                    src="/assets/images/sven.jpg"
                    alt="LabTrack Project Gantt Chart"
                    loading="lazy"
                    decoding="async"
                    className="w-full max-h-[240px] sm:max-h-[265px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>
              </div>

              {/* Bottom Status Bar inside Image Card */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" /> 5 Core Specialists
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                  100% Milestones Verified
                </span>
              </div>
            </div>

            {/* KANAN: ACTIVE ROLE SPOTLIGHT BANNER + UNANG 2 BENTO CARDS (7 COLS) */}
            <div className="lg:col-span-7 flex flex-col justify-between gap-5">
              
              {/* Interactive Active Member Spotlight Box */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-950 to-blue-950 border border-blue-500/40 shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black px-2.5 py-1 rounded-lg bg-blue-600 text-white">
                      ACTIVE PHASE {activeMember.step}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${activeMember.badge}`}>
                      {activeMember.role}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {activeMember.timeline}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{activeMember.name}</h3>
                  <p className="text-xs font-bold text-cyan-300 mt-0.5">{activeMember.task}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeMember.desc}
                </p>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className={`h-full w-full bg-gradient-to-r ${activeMember.barColor}`} />
                </div>
              </div>

              {/* Unang 2 Team Bento Cards (PM & System Analyst) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {homeTeamBento.slice(0, 2).map((member, idx) => {
                  const IconComp = member.icon;
                  const isSel = selectedTeamIdx === idx;
                  return (
                    <div
                      key={member.step}
                      onClick={() => setSelectedTeamIdx(idx)}
                      className={`bento-3d-card p-5 rounded-3xl bg-slate-900 border cursor-pointer flex flex-col justify-between space-y-3 ${
                        isSel ? member.activeBorder : `border-white/10 ${member.accentBorder}`
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${member.badge}`}>
                            {member.role}
                          </span>
                        </div>
                        <div>
                          <h4 className="text-base font-black text-white">{member.name}</h4>
                          <p className="text-[11px] font-bold text-slate-300 mt-0.5 line-clamp-1">{member.task}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">{member.timeline}</span>
                        <span className="text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 100%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* BOTTOM ALIGNED 3-COLUMN BENTO ROW: UI/UX DESIGNER, PROGRAMMER/DEVELOPER, DATABASE DESIGNER */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {homeTeamBento.slice(2, 5).map((member, offsetIdx) => {
              const actualIdx = offsetIdx + 2;
              const IconComp = member.icon;
              const isSel = selectedTeamIdx === actualIdx;
              return (
                <div
                  key={member.step}
                  onClick={() => setSelectedTeamIdx(actualIdx)}
                  className={`bento-3d-card p-6 rounded-3xl bg-slate-900 border cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSel ? member.activeBorder : `border-white/10 ${member.accentBorder}`
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 text-cyan-400">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${member.badge}`}>
                        {member.role}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-black text-white">{member.name}</h4>
                      <p className="text-xs font-bold text-cyan-300 mt-0.5">{member.task}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {member.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full w-full bg-gradient-to-r ${member.barColor}`} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">{member.timeline}</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ENTERPRISE FACILITY OPERATIONS & GOVERNANCE SECTION */}
      <section className="py-16 sm:py-24 bg-slate-900/90 border-t border-white/10 gpu-layer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
          
          {/* Institutional Metrics Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-white/10 shadow-xl font-mono">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Workstation Fleet</span>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">130+ <span className="text-xs text-slate-400 font-sans font-semibold">Nodes</span></p>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans block">Across 4 Computer Labs</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">System Uptime</span>
              <p className="text-2xl sm:text-3xl font-black text-emerald-400">99.9%</p>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans block">Active Node Diagnostics</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Security Compliance</span>
              <p className="text-2xl sm:text-3xl font-black text-blue-400">100%</p>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans block">Role Authorization</span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Dispatch Efficiency</span>
              <p className="text-2xl sm:text-3xl font-black text-amber-400">&lt; 15m</p>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-sans block">Technician Alert Time</span>
            </div>
          </div>

          {/* Business SaaS Operational Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Business Feature 1 */}
            <div className="bento-3d-card p-8 rounded-3xl bg-slate-950 border border-white/10 hover:border-blue-500/50 space-y-4 shadow-xl">
              <div className="p-3 bg-blue-600/10 text-blue-400 border border-blue-500/20 rounded-2xl w-fit">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Campus Facility Governance</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Centralized management designed for JRMSU administration. Seamlessly monitor room capacity, schedule clearances, and asset allocations in real time.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-400">
                <CheckCircle2 className="w-4 h-4 text-blue-500" />
                <span>Multi-Room Infrastructure</span>
              </div>
            </div>

            {/* Business Feature 2 */}
            <div className="bento-3d-card p-8 rounded-3xl bg-slate-950 border border-white/10 hover:border-cyan-500/50 space-y-4 shadow-xl">
              <div className="p-3 bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 rounded-2xl w-fit">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Institutional Access Control</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Role-based access permissions tailored for Students, Faculty Instructors, and System Administrators ensuring data privacy and lab integrity.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-cyan-400">
                <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                <span>Encrypted Auth Token Injection</span>
              </div>
            </div>

            {/* Business Feature 3 */}
            <div className="bento-3d-card p-8 rounded-3xl bg-slate-950 border border-white/10 hover:border-emerald-500/50 space-y-4 shadow-xl">
              <div className="p-3 bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 rounded-2xl w-fit">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Audit &amp; Compliance Reports</h3>
              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                Exportable historical telemetry logs, maintenance histories, and usage analytics for institutional reporting and IT resource auditing.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Automated Log Archival</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* CLICK-TO-ZOOM MODAL PARA SA GANTT CHART */}
      {isChartZoomed && (
        <div
          onClick={() => setIsChartZoomed(false)}
          className="fixed inset-0 z-[9999] bg-slate-950/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl w-full bg-slate-900 border border-white/20 rounded-3xl p-3 sm:p-4 shadow-2xl">
            <button
              type="button"
              onClick={() => setIsChartZoomed(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-950 hover:bg-rose-600 text-white border border-white/20 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src="/assets/images/sven.jpg"
              alt="LabTrack Gantt Chart Full View"
              className="w-full max-h-[80vh] object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default HomePage;




