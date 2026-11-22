import React from 'react';

export interface SkeletonLoader3DProps {
  variant?: 'light' | 'dark';
  label?: string;
  compact?: boolean;
}

export const useSmoothSkeleton = (_durationMs: number = 650): boolean => {
  return false;
};

/**
 * Fallback React Skeleton Component (Used when explicitly rendered inside JSX)
 */
export const SkeletonLoader3D: React.FC<SkeletonLoader3DProps> = ({
  variant = 'light',
  label = 'Loading Workspace...',
  compact = false
}) => {
  const isDark = variant === 'dark';

  if (compact) {
    return (
      <div
        className={`w-full rounded-3xl p-5 select-none space-y-4 relative overflow-hidden ${
          isDark
            ? 'bg-slate-950 border-2 border-cyan-500/35 shadow-[0_8px_0_#020617]'
            : 'bg-white border-2 border-slate-300 shadow-[0_8px_0_#cbd5e1]'
        }`}
      >
        <div className="flex items-center gap-3.5">
          <div className="skel3d-gpu w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-800 shrink-0 border-2 border-blue-400/40" />
          <div className="flex-1 space-y-2.5">
            <div className="skel3d-gpu h-4 w-[75%] rounded-lg bg-slate-300 dark:bg-slate-800" />
            <div className="skel3d-gpu h-3 w-[50%] rounded-lg bg-slate-200 dark:bg-slate-800/80" />
          </div>
        </div>
        <div className="skel3d-gpu h-24 w-full rounded-2xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800" />
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-[2.2rem] p-5 sm:p-7 select-none space-y-5 relative overflow-hidden ${
        isDark
          ? 'bg-slate-950 border-2 border-cyan-500/35 shadow-[0_12px_0_#020617]'
          : 'bg-white border-2 border-slate-300 shadow-[0_12px_0_#94a3b8]'
      }`}
    >
      <div className="p-5 rounded-3xl border-2 flex items-center gap-4 bg-slate-900 border-cyan-500/35">
        <div className="skel3d-gpu skel3d-gpu-dark w-16 h-16 rounded-full bg-slate-800 border-2 border-sky-400/50 shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="skel3d-gpu skel3d-gpu-dark h-5 w-[76%] rounded-xl bg-slate-800" />
          <div className="skel3d-gpu skel3d-gpu-dark h-3.5 w-[50%] rounded-xl bg-slate-800/90" />
        </div>
      </div>
      <div className="flex items-center justify-between text-[10px] font-mono font-black tracking-wider uppercase text-blue-600 dark:text-sky-400 pt-2">
        <span>{label}</span>
        <span>SYSTEM READY</span>
      </div>
    </div>
  );
};

// ============================================================================
// 1. SEAMLESS IN-PLACE "TUPONG SA BOX" SKELETON (ADMIN, INSTRUCTOR & STUDENT)
//    - Waits for actual DOM boxes to mount on refresh before starting fade timer
//    - Never overrides border-radius or box-shadow so there is ZERO snap/cut-off
//      ("hindi na tumatapot / napuputol") when the fade completes!
// 2. PC ICON PRE-LOADER:
//    - Shows ONLY when clicking Sign In / Log In / Register on the Landing Page
//      (and on first open of the Landing Page).
//    - NEVER shows when refreshing (F5) on Login, Register, or Landing pages!
// ============================================================================
type BoxColorTone = 'dark' | 'blue' | 'emerald' | 'light';

const BG_CACHE_KEY = 'labtrack_exact_page_bg_v6';
const LANDING_OPENED_SESSION_KEY = 'labtrack_landing_first_open_done_v2';

function isLandingPagePath(pathname: string): boolean {
  const p = (pathname || '/').toLowerCase();
  if (
    p.startsWith('/admin') ||
    p.startsWith('/instructor') ||
    p.startsWith('/student') ||
    p.startsWith('/login') ||
    p.startsWith('/register') ||
    p.startsWith('/forgot')
  ) {
    return false;
  }
  return true;
}

function isAuthPagePath(pathname: string): boolean {
  const p = (pathname || '').toLowerCase();
  return (
    p.startsWith('/login') ||
    p.startsWith('/register') ||
    p.startsWith('/forgot')
  );
}

function isDashboardPagePath(pathname: string): boolean {
  const p = (pathname || '').toLowerCase();
  return (
    p.startsWith('/admin') ||
    p.startsWith('/instructor') ||
    p.startsWith('/student')
  );
}

function isBrowserReloadNavigation(): boolean {
  try {
    const navEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (navEntries && navEntries.length > 0) {
      return navEntries[0].type === 'reload';
    }
  } catch {}
  return false;
}

function detectElementBoxToneFast(el: HTMLElement): BoxColorTone {
  const path = (window.location.pathname || '/').toLowerCase();
  let curr: HTMLElement | null = el;
  let depth = 0;

  while (curr && curr !== document.documentElement && depth < 12) {
    depth++;
    const cls = typeof curr.className === 'string' ? curr.className : '';
    if (cls) {
      if (/from-emerald|bg-emerald-(600|700|800|900|950)|border-emerald-500\/3/i.test(cls)) {
        return 'emerald';
      }
      if (/via-blue-900|from-blue-|bg-blue-(600|700|800|900|950)|bg-indigo-(600|700|800|900|950)/i.test(cls)) {
        return 'blue';
      }
      if (/bg-slate-(800|900|950)|from-slate-(900|950)|bg-\[#0/i.test(cls)) {
        return 'dark';
      }
      if (/bg-white|bg-slate-(50|100|200)|from-white/i.test(cls)) {
        return 'light';
      }
    }
    curr = curr.parentElement;
  }

  if (path.startsWith('/student')) {
    return 'dark';
  }
  return 'light';
}

function rememberCurrentPageBackground() {
  try {
    const path = (window.location.pathname || '/').toLowerCase();
    const bg =
      path.startsWith('/student') || isLandingPagePath(path)
        ? '#020617'
        : '#f8fafc';
    sessionStorage.setItem(BG_CACHE_KEY, bg);
    document.documentElement.style.backgroundColor = bg;
  } catch {}
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  [
    'labtrack-page-aligned-3d-skeleton',
    'labtrack-global-3d-skeleton-overlay',
    'labtrack-zero-lag-3d-transition-styles',
    'labtrack-unified-3d-engine-styles',
    'labtrack-3d-portal-gate',
    'labtrack-3d-laser-bar'
  ].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  try {
    const cachedBg = sessionStorage.getItem(BG_CACHE_KEY);
    if (cachedBg) {
      document.documentElement.style.backgroundColor = cachedBg;
    }
  } catch {}

  const STYLE_ID = 'labtrack-inplace-tupong-3d-skeleton-styles';
  const existingStyle = document.getElementById(STYLE_ID);
  if (existingStyle) existingStyle.remove();

  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ID;
  styleEl.textContent = `
    @keyframes skel3dTupongWave {
      0% { transform: translate3d(-115%, 0, 0) skewX(-20deg); }
      100% { transform: translate3d(225%, 0, 0) skewX(-20deg); }
    }

    /* ==========================================================================
       A. BUTTER-SMOOTH IN-PLACE "TUPONG SA BOX" SKELETON
       Zero layout/border-radius mutation -> Never snaps or cuts off at the end!
       ========================================================================== */
    [data-skel3d-leaf] {
      position: relative !important;
      overflow: hidden !important;
    }

    /* Keep real content underneath untouched in geometry; ::before covers it 100%
       and smoothly dissolves from opacity 1 -> 0 over 680ms! */
    [data-skel3d-leaf]::before {
      content: '';
      position: absolute;
      inset: -1px;
      z-index: 25;
      border-radius: inherit;
      opacity: 1;
      pointer-events: none;
      will-change: opacity;
      transition: opacity 680ms cubic-bezier(0.16, 1, 0.3, 1);
    }

    [data-skel3d-leaf="dark"]::before {
      background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(56, 189, 248, 0.28);
      box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.15);
    }
    [data-skel3d-leaf="blue"]::before {
      background: linear-gradient(180deg, #1e3a8a 0%, #172554 100%);
      border: 1px solid rgba(96, 165, 250, 0.35);
      box-shadow: inset 0 1px 0 rgba(191, 219, 254, 0.2);
    }
    [data-skel3d-leaf="emerald"]::before {
      background: linear-gradient(180deg, #065f46 0%, #064e3b 100%);
      border: 1px solid rgba(52, 211, 153, 0.35);
      box-shadow: inset 0 1px 0 rgba(167, 243, 208, 0.2);
    }
    [data-skel3d-leaf="light"]::before {
      background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
      border: 1px solid #cbd5e1;
      box-shadow: inset 0 1px 0 #ffffff;
    }

    [data-skel3d-leaf]::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 55%;
      height: 100%;
      z-index: 26;
      pointer-events: none;
      will-change: transform, opacity;
      animation: skel3dTupongWave 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
      opacity: 1;
      transition: opacity 680ms cubic-bezier(0.16, 1, 0.3, 1);
    }
    [data-skel3d-leaf="dark"]::after,
    [data-skel3d-leaf="blue"]::after {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(56, 189, 248, 0.22) 25%,
        rgba(186, 230, 253, 0.55) 50%,
        rgba(56, 189, 248, 0.22) 75%,
        transparent 100%
      );
    }
    [data-skel3d-leaf="emerald"]::after {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(52, 211, 153, 0.22) 25%,
        rgba(167, 243, 208, 0.55) 50%,
        rgba(52, 211, 153, 0.22) 75%,
        transparent 100%
      );
    }
    [data-skel3d-leaf="light"]::after {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(56, 189, 248, 0.18) 25%,
        rgba(255, 255, 255, 0.88) 50%,
        rgba(56, 189, 248, 0.18) 75%,
        transparent 100%
      );
    }

    /* Silky 680ms Dissolve: Skeleton pseudo-elements melt away into the real text underneath */
    body.labtrack-skel3d-fading [data-skel3d-leaf]::before,
    body.labtrack-skel3d-fading [data-skel3d-leaf]::after {
      opacity: 0 !important;
    }

    /* ==========================================================================
       B. TOP LASER BAR & LANDING PAGE NAVIGATION TRANSITION
       ========================================================================== */
    #labtrack-3d-laser-bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3.5px;
      width: 100%;
      z-index: 99999;
      pointer-events: none;
      transform-origin: left center;
      transform: scaleX(0);
      opacity: 0;
      background: linear-gradient(90deg, #38bdf8 0%, #6366f1 50%, #22d3ee 100%);
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.9), 0 0 28px rgba(99, 102, 241, 0.6);
      transition: transform 450ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease;
    }
    #labtrack-3d-laser-bar.laser-active {
      opacity: 1;
      transform: scaleX(1);
    }

    @keyframes landing3dPageGlide {
      0% {
        opacity: 0.25;
        transform: perspective(1400px) translate3d(0, 22px, -45px) rotateX(2.5deg) scale(0.986);
      }
      65% {
        opacity: 1;
        transform: perspective(1400px) translate3d(0, -2px, 6px) rotateX(-0.3deg) scale(1.001);
      }
      100% {
        opacity: 1;
        transform: perspective(1400px) translate3d(0, 0, 0) rotateX(0deg) scale(1);
      }
    }
    @keyframes landing3dCardPop {
      0% {
        opacity: 0;
        transform: perspective(1000px) translate3d(0, 26px, -28px) rotateX(3.5deg);
      }
      100% {
        opacity: 1;
        transform: perspective(1000px) translate3d(0, 0, 0) rotateX(0deg);
      }
    }

    body.labtrack-landing-3d-nav main,
    body.labtrack-landing-3d-nav #root > div > main,
    body.labtrack-landing-3d-nav #root > div > section {
      animation: landing3dPageGlide 620ms cubic-bezier(0.16, 1, 0.3, 1) both !important;
      will-change: transform, opacity;
    }
    body.labtrack-landing-3d-nav main section:nth-of-type(1) {
      animation: landing3dCardPop 540ms cubic-bezier(0.16, 1, 0.3, 1) 30ms both;
    }
    body.labtrack-landing-3d-nav main section:nth-of-type(2) {
      animation: landing3dCardPop 590ms cubic-bezier(0.16, 1, 0.3, 1) 95ms both;
    }
    body.labtrack-landing-3d-nav main section:nth-of-type(3) {
      animation: landing3dCardPop 640ms cubic-bezier(0.16, 1, 0.3, 1) 160ms both;
    }

    /* ==========================================================================
       C. COMPUTER ICON PRE-LOADER (ONLY ON LANDING FIRST OPEN & SIGN IN CLICK)
       ========================================================================== */
    @keyframes portal3dRingSpinA {
      0% { transform: rotateX(62deg) rotateY(12deg) rotateZ(0deg); }
      100% { transform: rotateX(62deg) rotateY(12deg) rotateZ(360deg); }
    }
    @keyframes portal3dRingSpinB {
      0% { transform: rotateX(-55deg) rotateY(24deg) rotateZ(360deg); }
      100% { transform: rotateX(-55deg) rotateY(24deg) rotateZ(0deg); }
    }
    @keyframes portal3dCorePulse {
      0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
      50% { transform: translate3d(0, -6px, 12px) scale(1.04); }
    }
    @keyframes portalProgressGlide {
      0% { width: 5%; }
      45% { width: 62%; }
      100% { width: 100%; }
    }

    #labtrack-3d-portal-gate {
      position: fixed;
      inset: 0;
      z-index: 99998;
      display: none;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at center, rgba(15, 23, 42, 0.94) 0%, rgba(2, 6, 23, 0.98) 100%);
      opacity: 0;
      pointer-events: none;
      will-change: opacity, transform;
      transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1), transform 620ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    #labtrack-3d-portal-gate.portal-visible {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
    #labtrack-3d-portal-gate.portal-zoom-out {
      opacity: 0;
      transform: scale(1.06);
      pointer-events: none;
    }
    .portal-3d-card {
      width: 380px;
      max-width: 90vw;
      padding: 32px 28px;
      border-radius: 30px;
      background: linear-gradient(180deg, #0f172a 0%, #020617 100%);
      border: 2px solid rgba(56, 189, 248, 0.45);
      box-shadow: 0 14px 0 #020617, 0 25px 60px rgba(14, 165, 233, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      animation: portal3dCorePulse 2.4s ease-in-out infinite;
    }
    .portal-3d-stage {
      position: relative;
      width: 104px;
      height: 104px;
      margin-bottom: 18px;
      perspective: 650px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .portal-ring-a {
      position: absolute;
      inset: 0;
      border-radius: 9999px;
      border: 3px solid transparent;
      border-top-color: #38bdf8;
      border-bottom-color: #818cf8;
      box-shadow: 0 0 18px rgba(56, 189, 248, 0.55);
      animation: portal3dRingSpinA 1.9s linear infinite;
    }
    .portal-ring-b {
      position: absolute;
      inset: 9px;
      border-radius: 9999px;
      border: 3px solid transparent;
      border-left-color: #22d3ee;
      border-right-color: #3b82f6;
      box-shadow: 0 0 14px rgba(34, 211, 238, 0.45);
      animation: portal3dRingSpinB 2.3s linear infinite;
    }
    .portal-core-pc-icon {
      width: 50px;
      height: 50px;
      border-radius: 15px;
      background: linear-gradient(135deg, #0284c7 0%, #1e3a8a 100%);
      border: 2px solid #bae6fd;
      box-shadow: 0 4px 0 #0369a1, 0 0 22px rgba(56, 189, 248, 0.85);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
    }
    .portal-progress-track {
      width: 100%;
      height: 5.5px;
      border-radius: 9999px;
      background: #0f172a;
      border: 1px solid rgba(56, 189, 248, 0.3);
      overflow: hidden;
      margin-top: 18px;
    }
    .portal-progress-fill {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #38bdf8 0%, #818cf8 50%, #22d3ee 100%);
      box-shadow: 0 0 10px rgba(56, 189, 248, 0.85);
      animation: portalProgressGlide 1400ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
  `;
  document.head.appendChild(styleEl);

  const laserBar = document.createElement('div');
  laserBar.id = 'labtrack-3d-laser-bar';
  document.body.appendChild(laserBar);

  const portalGate = document.createElement('div');
  portalGate.id = 'labtrack-3d-portal-gate';
  portalGate.innerHTML = `
    <div class="portal-3d-card">
      <div class="portal-3d-stage">
        <div class="portal-ring-a"></div>
        <div class="portal-ring-b"></div>
        <div class="portal-core-pc-icon" title="JRMSU LabTrack System">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" fill="rgba(56, 189, 248, 0.25)" stroke="#ffffff" stroke-width="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21" stroke="#bae6fd" stroke-width="2.2"></line>
            <line x1="12" y1="17" x2="12" y2="21" stroke="#bae6fd" stroke-width="2.2"></line>
            <path d="M6 8h4" stroke="#7dd3fc" stroke-width="1.8"></path>
            <path d="M6 11h8" stroke="#e0f2fe" stroke-width="1.8"></path>
          </svg>
        </div>
      </div>
      <div id="portal-gate-title" style="color:#f8fafc;font-weight:900;font-size:13px;letter-spacing:0.11em;text-transform:uppercase;font-family:monospace;">
        WELCOME TO JRMSU LABTRACK
      </div>
      <div id="portal-gate-sub" style="color:#38bdf8;font-weight:700;font-size:10px;letter-spacing:0.07em;margin-top:6px;font-family:monospace;">
        LOADING SMART LABORATORY MANAGEMENT SYSTEM...
      </div>
      <div class="portal-progress-track">
        <div id="portal-gate-bar" class="portal-progress-fill"></div>
      </div>
    </div>
  `;
  document.body.appendChild(portalGate);

  let laserTimer: number | undefined;
  function pulseLaserBar() {
    if (laserTimer) window.clearTimeout(laserTimer);
    laserBar.classList.remove('laser-active');
    void laserBar.offsetWidth;
    laserBar.classList.add('laser-active');
    laserTimer = window.setTimeout(() => {
      laserBar.classList.remove('laser-active');
    }, 480);
  }

  let landingAnimTimer: number | undefined;
  function triggerLanding3dNavGlide() {
    pulseLaserBar();
    if (landingAnimTimer) window.clearTimeout(landingAnimTimer);
    document.body.classList.remove('labtrack-landing-3d-nav');
    void document.body.offsetWidth;
    document.body.classList.add('labtrack-landing-3d-nav');
    landingAnimTimer = window.setTimeout(() => {
      document.body.classList.remove('labtrack-landing-3d-nav');
    }, 660);
  }

  let portalFadeTimer: number | undefined;
  let portalHideTimer: number | undefined;
  function triggerComputerPreloader(customTitle: string, customSub: string, holdMs = 1400) {
    pulseLaserBar();
    if (portalFadeTimer) window.clearTimeout(portalFadeTimer);
    if (portalHideTimer) window.clearTimeout(portalHideTimer);

    const titleEl = document.getElementById('portal-gate-title');
    const subEl = document.getElementById('portal-gate-sub');
    const barEl = document.getElementById('portal-gate-bar');

    if (titleEl && customTitle) titleEl.textContent = customTitle;
    if (subEl && customSub) subEl.textContent = customSub;
    if (barEl) {
      barEl.style.animation = 'none';
      void barEl.offsetWidth;
      barEl.style.animation = `portalProgressGlide ${holdMs}ms cubic-bezier(0.22, 1, 0.36, 1) forwards`;
    }

    portalGate.style.display = 'flex';
    portalGate.classList.remove('portal-zoom-out');
    void portalGate.offsetWidth;
    portalGate.classList.add('portal-visible');

    triggerLanding3dNavGlide();

    portalFadeTimer = window.setTimeout(() => {
      portalGate.classList.remove('portal-visible');
      portalGate.classList.add('portal-zoom-out');
    }, holdMs);

    portalHideTimer = window.setTimeout(() => {
      portalGate.style.display = 'none';
      portalGate.classList.remove('portal-zoom-out');
    }, holdMs + 600);
  }

  function getActivePageScope(): HTMLElement {
    const mainEl = document.querySelector('main') as HTMLElement | null;
    const asideEl = document.querySelector('aside') as HTMLElement | null;
    if (mainEl && asideEl) {
      return mainEl;
    }
    return (document.querySelector('#root') as HTMLElement) || document.body;
  }

  function tagLivePageBoxesAndLeavesFast(): number {
    if (!isDashboardPagePath(window.location.pathname)) return 0;

    const scope = getActivePageScope();
    if (!scope) return 0;

    rememberCurrentPageBackground();

    const leafCandidates = scope.querySelectorAll<HTMLElement>(
      'h1:not([data-skel3d-leaf]), h2:not([data-skel3d-leaf]), h3:not([data-skel3d-leaf]), h4:not([data-skel3d-leaf]), h5:not([data-skel3d-leaf]), h6:not([data-skel3d-leaf]), p:not([data-skel3d-leaf]), button:not([data-skel3d-leaf]), a:not([data-skel3d-leaf]), span:not([data-skel3d-leaf]), label:not([data-skel3d-leaf]), strong:not([data-skel3d-leaf]), b:not([data-skel3d-leaf]), td:not([data-skel3d-leaf]), th:not([data-skel3d-leaf]), div:not([data-skel3d-leaf])'
    );

    let taggedCount = 0;

    leafCandidates.forEach((el) => {
      if (el.closest('aside, nav')) return;
      if (el.parentElement?.closest('[data-skel3d-leaf]')) return;

      const tag = el.tagName.toLowerCase();
      const cls = typeof el.className === 'string' ? el.className : '';
      const childCount = el.children.length;

      const isHeadingOrPara = /^h[1-6]$|^p$|^td$|^th$|^label$|^strong$|^b$/.test(tag);
      const isButtonOrLink =
        tag === 'button' ||
        (tag === 'a' && /rounded|btn|px-|py-|inline-flex|flex/i.test(cls));

      const firstChildTag = childCount === 1 ? el.children[0].tagName.toLowerCase() : '';
      const isIconOrChartWrapper =
        childCount === 1 && (firstChildTag === 'svg' || firstChildTag === 'img' || firstChildTag === 'canvas');

      const isTextLeaf =
        childCount === 0 && (el.textContent || '').trim().length > 0;

      const isBadgePill =
        (tag === 'span' || tag === 'div') &&
        childCount <= 2 &&
        /rounded-full|rounded-lg|rounded-md|badge|uppercase|font-mono/i.test(cls) &&
        (el.textContent || '').trim().length > 0;

      if (
        isHeadingOrPara ||
        isButtonOrLink ||
        isIconOrChartWrapper ||
        isTextLeaf ||
        isBadgePill
      ) {
        el.setAttribute('data-skel3d-leaf', detectElementBoxToneFast(el));
        taggedCount++;
      }
    });

    return taggedCount;
  }

  function clearAllInPlaceSkeletonTags() {
    document.body.classList.remove('labtrack-skel3d-active', 'labtrack-skel3d-fading');
    document.querySelectorAll('[data-skel3d-leaf]').forEach((el) => el.removeAttribute('data-skel3d-leaf'));
  }

  let fadeTimer: number | undefined;
  let cleanupTimer: number | undefined;
  let domObserver: MutationObserver | null = null;
  let rafScheduled = false;

  /**
   * Butter-Smooth Dashboard Skeletonizer (Admin, Instructor, Student):
   * Waits until the dashboard DOM elements have mounted before starting the hold timer,
   * then smoothly fades out over 680ms with ZERO geometry/border-radius jump!
   */
  function triggerInPlaceTupongSkeleton(holdMs = 820) {
    if (!isDashboardPagePath(window.location.pathname)) return;

    if (fadeTimer) window.clearTimeout(fadeTimer);
    if (cleanupTimer) window.clearTimeout(cleanupTimer);
    if (domObserver) {
      domObserver.disconnect();
      domObserver = null;
    }

    document.body.classList.remove('labtrack-skel3d-fading');
    document.body.classList.add('labtrack-skel3d-active');

    let totalTagged = tagLivePageBoxesAndLeavesFast();
    let timerStarted = false;

    const scheduleSmoothDissolve = (delay: number) => {
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (cleanupTimer) window.clearTimeout(cleanupTimer);

      fadeTimer = window.setTimeout(() => {
        if (domObserver) {
          domObserver.disconnect();
          domObserver = null;
        }
        // Start 680ms silky opacity dissolve (1 -> 0)
        document.body.classList.add('labtrack-skel3d-fading');
        document.body.classList.remove('labtrack-skel3d-active');
      }, delay);

      cleanupTimer = window.setTimeout(() => {
        clearAllInPlaceSkeletonTags();
      }, delay + 720);
    };

    if (totalTagged > 12) {
      timerStarted = true;
      scheduleSmoothDissolve(holdMs);
    } else {
      // Fallback safety if page has very few elements
      scheduleSmoothDissolve(holdMs + 350);
    }

    domObserver = new MutationObserver(() => {
      if (!rafScheduled && document.body.classList.contains('labtrack-skel3d-active')) {
        rafScheduled = true;
        window.requestAnimationFrame(() => {
          rafScheduled = false;
          if (document.body.classList.contains('labtrack-skel3d-active')) {
            const newlyTagged = tagLivePageBoxesAndLeavesFast();
            totalTagged += newlyTagged;
            // Once the main dashboard cards mount on F5 refresh, start the full smooth hold timer!
            if (!timerStarted && totalTagged > 12) {
              timerStarted = true;
              scheduleSmoothDissolve(holdMs);
            }
          }
        });
      }
    });
    domObserver.observe(document.body, { childList: true, subtree: true });
  }

  // ==========================================================================
  // 1. INITIAL PAGE OPEN / BROWSER F5 REFRESH
  // ==========================================================================
  const runInitialPageAnimation = () => {
    const currentPath = window.location.pathname || '/';

    if (isLandingPagePath(currentPath)) {
      // Show PC Icon Pre-Loader ONLY on the very first open of the Landing Page (NOT on F5 refresh)
      const alreadyOpenedLanding = sessionStorage.getItem(LANDING_OPENED_SESSION_KEY) === '1';
      const isReload = isBrowserReloadNavigation();

      if (!alreadyOpenedLanding && !isReload) {
        try {
          sessionStorage.setItem(LANDING_OPENED_SESSION_KEY, '1');
        } catch {}
        triggerComputerPreloader(
          'WELCOME TO JRMSU LABTRACK',
          'LOADING SMART LABORATORY MANAGEMENT SYSTEM...',
          1450
        );
      } else {
        try {
          sessionStorage.setItem(LANDING_OPENED_SESSION_KEY, '1');
        } catch {}
        triggerLanding3dNavGlide();
      }
    } else if (isAuthPagePath(currentPath)) {
      // DO NOT show the PC Icon Loader when refreshing (F5) on Login / Register pages!
      // Just do a clean, subtle laser bar + smooth entrance glide.
      triggerLanding3dNavGlide();
    } else if (isDashboardPagePath(currentPath)) {
      // Admin, Instructor, and Student Pages: Butter-smooth "Tupong sa Box" Skeleton!
      window.requestAnimationFrame(() => {
        triggerInPlaceTupongSkeleton(850);
      });
    }
  };

  if (document.body) {
    runInitialPageAnimation();
  } else {
    window.addEventListener('DOMContentLoaded', runInitialPageAnimation);
  }

  // ==========================================================================
  // 2. CLICK HANDLER (SIGN IN / LOG IN FROM LANDING vs NAV vs DASHBOARD)
  // ==========================================================================
  let lastTrigger = 0;
  window.addEventListener(
    'click',
    (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const btn = target.closest('button, a, [role="tab"], [role="menuitem"]') as HTMLElement | null;
      if (!btn) return;
      if (btn.closest('form, [role="dialog"], table tbody')) return;

      const isNav = Boolean(btn.closest('aside, nav, header, [role="navigation"]'));
      const text = (btn.innerText || '').toLowerCase().trim();
      const href = (btn.getAttribute('href') || '').toLowerCase().trim();
      const title = (btn.getAttribute('title') || '').toLowerCase().trim();
      const label = `${text} ${href} ${title}`.trim();

      const now = Date.now();
      if (now - lastTrigger < 240) return;

      // A. Clicking Sign In / Log In / Register from the Landing Page -> Show PC Icon Loader!
      const isSignInOrAuthClick =
        label.includes('sign in') ||
        label.includes('signin') ||
        label.includes('log in') ||
        label.includes('login') ||
        label.includes('register') ||
        label.includes('sign up') ||
        label.includes('get started') ||
        label.includes('access portal') ||
        href.includes('/login') ||
        href.includes('/register');

      if (isSignInOrAuthClick && isLandingPagePath(window.location.pathname)) {
        lastTrigger = now;
        clearAllInPlaceSkeletonTags();
        const isRegisterClick = label.includes('register') || label.includes('sign up') || href.includes('/register');
        triggerComputerPreloader(
          isRegisterClick ? 'ACCOUNT REGISTRATION' : 'SIGNING IN TO JRMSU LABTRACK',
          isRegisterClick
            ? 'PREPARING LABORATORY REGISTRATION PORTAL...'
            : 'CONNECTING TO SECURE AUTHENTICATION PORTAL...',
          1250
        );
        return;
      }

      // B. Clicking Navigation Links on Landing Page -> Smooth Perspective Glide
      if (isLandingPagePath(window.location.pathname) && (isNav || href.startsWith('/'))) {
        lastTrigger = now;
        clearAllInPlaceSkeletonTags();
        triggerLanding3dNavGlide();
        return;
      }

      // C. Clicking Sidebar / Refresh inside Admin, Instructor, or Student Pages -> Smooth "Tupong sa Box" Skeleton!
      const isSyncOrRefresh = label.includes('sync') || label.includes('refresh');
      const isIgnored =
        label.includes('log out') ||
        label.includes('logout') ||
        label.includes('sign out') ||
        label.includes('collapse');

      if ((isNav || isSyncOrRefresh) && !isIgnored && isDashboardPagePath(window.location.pathname)) {
        lastTrigger = now;
        clearAllInPlaceSkeletonTags();
        window.requestAnimationFrame(() => {
          triggerInPlaceTupongSkeleton(740);
        });
      }
    },
    true
  );

  window.addEventListener('popstate', () => {
    const p = window.location.pathname || '/';
    clearAllInPlaceSkeletonTags();
    if (isLandingPagePath(p) || isAuthPagePath(p)) {
      triggerLanding3dNavGlide();
    } else if (isDashboardPagePath(p)) {
      window.requestAnimationFrame(() => {
        triggerInPlaceTupongSkeleton(740);
      });
    }
  });
}

export default SkeletonLoader3D;