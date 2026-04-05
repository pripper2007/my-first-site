"use client";

import { useRef, useState, useEffect, useCallback } from "react";

/* ── Props ── */
interface ContentMapSectionProps {
  signals: number;
  talks: number;
  bookshelf: number;
  picks: number;
}

/* ── Color stop type used by the canvas animation ── */
interface ColorStop {
  pos: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

/* ── Line data generated during init ── */
interface LineData {
  angle: number;
  baseLength: number;
  t: number;
  phase: number;
  speed: number;
  widthMult: number;
}

/* ── Preset definition ── */
interface Preset {
  colors: ColorStop[];
  bg: string;
  glow: string;
  canvasGlow: { r: number; g: number; b: number };
  lightBg: boolean;
}

/* ── Presets ── */
const PRESETS: Record<string, Preset> = {
  default: {
    colors: [
      { pos: 0, r: 200, g: 162, b: 81, a: 0.7 },
      { pos: 0.25, r: 180, g: 145, b: 70, a: 0.5 },
      { pos: 0.5, r: 160, g: 130, b: 60, a: 0.35 },
      { pos: 0.75, r: 140, g: 115, b: 55, a: 0.2 },
      { pos: 1, r: 120, g: 100, b: 50, a: 0.1 },
    ],
    /* Light warm gradient that blends seamlessly with the site #ECECEC background */
    bg: `radial-gradient(circle at 50% 78%, rgba(200,162,81,0.08), transparent 24%),
         radial-gradient(circle at 50% 78%, rgba(200,162,81,0.06), transparent 40%),
         linear-gradient(180deg, #ececec 0%, #e6e2da 38%, #ddd8cc 100%)`,
    glow: `radial-gradient(circle at 50% 100%, rgba(200,162,81,0.1), transparent 28%),
           radial-gradient(circle at 50% 12%, rgba(255,255,255,0.04), transparent 42%)`,
    canvasGlow: { r: 200, g: 175, b: 120 },
    lightBg: true,
  },
  cosmic: {
    colors: [
      { pos: 0, r: 255, g: 255, b: 255, a: 0.88 },
      { pos: 0.25, r: 208, g: 200, b: 255, a: 0.72 },
      { pos: 0.5, r: 168, g: 160, b: 240, a: 0.55 },
      { pos: 0.75, r: 122, g: 114, b: 208, a: 0.38 },
      { pos: 1, r: 85, g: 72, b: 176, a: 0.22 },
    ],
    bg: `radial-gradient(circle at 50% 78%, rgba(255,255,255,0.18), transparent 24%),
         radial-gradient(circle at 50% 78%, rgba(174,166,255,0.22), transparent 40%),
         linear-gradient(180deg, #181f73 0%, #24268d 38%, #4d43ff 100%)`,
    glow: `radial-gradient(circle at 50% 100%, rgba(255,255,255,0.16), transparent 28%),
           radial-gradient(circle at 50% 12%, rgba(255,255,255,0.03), transparent 42%)`,
    canvasGlow: { r: 180, g: 170, b: 255 },
    lightBg: false,
  },
  ghost: {
    colors: [
      { pos: 0, r: 26, g: 26, b: 26, a: 0.5 },
      { pos: 0.25, r: 60, g: 60, b: 70, a: 0.32 },
      { pos: 0.5, r: 107, g: 107, b: 107, a: 0.2 },
      { pos: 0.75, r: 140, g: 140, b: 150, a: 0.12 },
      { pos: 1, r: 160, g: 160, b: 170, a: 0.06 },
    ],
    bg: `radial-gradient(circle at 50% 78%, rgba(200,200,220,0.12), transparent 24%),
         radial-gradient(circle at 50% 78%, rgba(180,180,200,0.08), transparent 40%),
         linear-gradient(180deg, #ececec 0%, #e4e2de 38%, #d8d6d0 100%)`,
    glow: `radial-gradient(circle at 50% 100%, rgba(255,255,255,0.3), transparent 28%),
           radial-gradient(circle at 50% 12%, rgba(200,200,220,0.06), transparent 42%)`,
    canvasGlow: { r: 180, g: 180, b: 200 },
    lightBg: true,
  },
  warm: {
    colors: [
      { pos: 0, r: 255, g: 255, b: 255, a: 0.92 },
      { pos: 0.25, r: 255, g: 200, b: 200, a: 0.75 },
      { pos: 0.5, r: 235, g: 100, b: 120, a: 0.55 },
      { pos: 0.75, r: 200, g: 70, b: 140, a: 0.35 },
      { pos: 1, r: 150, g: 50, b: 160, a: 0.18 },
    ],
    bg: `radial-gradient(circle at 50% 78%, rgba(255,120,120,0.18), transparent 24%),
         radial-gradient(circle at 50% 78%, rgba(200,80,140,0.16), transparent 40%),
         linear-gradient(180deg, #2d0a1a 0%, #4a1028 38%, #6a1840 100%)`,
    glow: `radial-gradient(circle at 50% 100%, rgba(255,180,180,0.14), transparent 28%),
           radial-gradient(circle at 50% 12%, rgba(255,255,255,0.03), transparent 42%)`,
    canvasGlow: { r: 255, g: 160, b: 180 },
    lightBg: false,
  },
  ice: {
    colors: [
      { pos: 0, r: 220, g: 250, b: 255, a: 0.9 },
      { pos: 0.25, r: 150, g: 220, b: 255, a: 0.7 },
      { pos: 0.5, r: 80, g: 180, b: 240, a: 0.48 },
      { pos: 0.75, r: 40, g: 130, b: 210, a: 0.28 },
      { pos: 1, r: 20, g: 80, b: 180, a: 0.12 },
    ],
    bg: `radial-gradient(circle at 50% 78%, rgba(100,200,255,0.18), transparent 24%),
         radial-gradient(circle at 50% 78%, rgba(60,140,220,0.16), transparent 40%),
         linear-gradient(180deg, #0a1a2d 0%, #0e2a4a 38%, #14406a 100%)`,
    glow: `radial-gradient(circle at 50% 100%, rgba(180,230,255,0.14), transparent 28%),
           radial-gradient(circle at 50% 12%, rgba(255,255,255,0.03), transparent 42%)`,
    canvasGlow: { r: 140, g: 210, b: 255 },
    lightBg: false,
  },
};

/* ── Stat descriptions ── */
const STAT_META: { key: keyof ContentMapSectionProps; title: string; copy: string }[] = [
  { key: "signals", title: "Signals", copy: "News, articles, and current ideas worth tracking." },
  { key: "talks", title: "Talks", copy: "Talks, interviews, and selected video appearances." },
  { key: "bookshelf", title: "Bookshelf", copy: "Books that informed the journey and stayed relevant." },
  { key: "picks", title: "Picks", copy: "A curated selection of standout recommendations." },
];

/* ── Helpers ── */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpColor(colors: ColorStop[], t: number) {
  const clamped = Math.max(0, Math.min(1, t));
  for (let i = 0; i < colors.length - 1; i++) {
    if (clamped >= colors[i].pos && clamped <= colors[i + 1].pos) {
      const local = (clamped - colors[i].pos) / (colors[i + 1].pos - colors[i].pos);
      return {
        r: Math.round(lerp(colors[i].r, colors[i + 1].r, local)),
        g: Math.round(lerp(colors[i].g, colors[i + 1].g, local)),
        b: Math.round(lerp(colors[i].b, colors[i + 1].b, local)),
        a: lerp(colors[i].a, colors[i + 1].a, local),
      };
    }
  }
  const last = colors[colors.length - 1];
  return { r: last.r, g: last.g, b: last.b, a: last.a };
}

/**
 * ContentMapSection — full-bleed animated section that visualizes
 * content counts with a canvas "burst" animation and theme presets.
 */
export default function ContentMapSection({ signals, talks, bookshelf, picks }: ContentMapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  const [paused, setPaused] = useState(false);
  const [presetPanelOpen, setPresetPanelOpen] = useState(false);
  const [activePreset, setActivePreset] = useState("default");
  const [isLightBg, setIsLightBg] = useState(PRESETS.default.lightBg);

  /* Mutable refs for the animation loop (avoids stale closures) */
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const configRef = useRef({
    numLines: 220,
    spreadAngle: Math.PI * 1.1,
    minLength: 80,
    maxLength: 600,
    lineWidth: 1.0,
    dotRadius: 2.4,
    waveSpeed: 0.55,
    waveAmplitude: 50,
    waveFrequencyX: 3.0,
    waveFrequencyY: 2.4,
    originY: 1.0,
    originX: 0.5,
    mouseStrength: 100,
    mouseRadius: 260,
    colors: [...PRESETS.default.colors],
    canvasGlow: { ...PRESETS.default.canvasGlow },
  });

  /* Apply a preset — updates canvas config + section styles */
  const applyPreset = useCallback((name: string) => {
    const preset = PRESETS[name];
    if (!preset) return;

    setActivePreset(name);
    setIsLightBg(preset.lightBg);

    /* Update mutable config for the animation loop */
    configRef.current.colors = JSON.parse(JSON.stringify(preset.colors));
    configRef.current.canvasGlow = { ...preset.canvasGlow };

    /* Apply background + glow overlay directly to the section element */
    const section = sectionRef.current;
    if (section) {
      section.style.background = preset.bg;
      section.style.setProperty("--glow-overlay", preset.glow);
    }
  }, []);

  /* ── Canvas animation effect ── */
  useEffect(() => {
    const canvasEl = canvasRef.current;
    const visualEl = visualRef.current;
    if (!canvasEl || !visualEl) return;

    const ctxMaybe = canvasEl.getContext("2d");
    if (!ctxMaybe) return;

    /* Local non-null references for use inside nested functions */
    const canvas = canvasEl;
    const visual = visualEl;
    const ctx = ctxMaybe;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let lines: LineData[] = [];
    let animId = 0;

    const mouse = { x: -9999, y: -9999, active: false };
    const smoothMouse = { x: -9999, y: -9999 };

    const CONFIG = configRef.current;

    /* Initialize lines from the origin point outward in a fan shape */
    function initLines() {
      lines = [];
      const { numLines, spreadAngle, minLength, maxLength } = CONFIG;
      const scale = Math.min(width, height) / 600;
      for (let i = 0; i < numLines; i++) {
        const t = i / (numLines - 1);
        const angle = Math.PI + (Math.PI - spreadAngle) / 2 + t * spreadAngle;
        const baseLength = lerp(minLength, maxLength, Math.random()) * scale;
        const lengthVariation = 0.55 + 0.45 * Math.pow(Math.sin(t * Math.PI), 0.5);
        lines.push({
          angle,
          baseLength: baseLength * lengthVariation,
          t,
          phase: Math.random() * Math.PI * 2,
          speed: 0.8 + Math.random() * 0.4,
          widthMult: 0.4 + Math.random() * 0.6,
        });
      }
      lines.sort((a, b) => a.angle - b.angle);
    }

    /* Resize canvas to match container, accounting for device pixel ratio */
    function resize() {
      const rect = visual.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initLines();
    }

    /* Main draw loop — runs every frame via requestAnimationFrame */
    function draw() {
      if (!pausedRef.current) time += 0.016;
      smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.08);
      smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.08);

      ctx.clearRect(0, 0, width, height);

      /* Radial glow behind the lines */
      const cg = CONFIG.canvasGlow;
      const g = ctx.createRadialGradient(
        width * 0.5, height, 0,
        width * 0.5, height, height * 0.92
      );
      g.addColorStop(0, "rgba(255,255,255,0.14)");
      g.addColorStop(0.3, `rgba(${cg.r},${cg.g},${cg.b},0.06)`);
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      const ox = width * CONFIG.originX;
      const oy = height * CONFIG.originY;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const { angle, baseLength, t, phase, speed, widthMult } = line;

        /* Two sine waves create organic displacement */
        const wave1 = Math.sin(
          t * CONFIG.waveFrequencyX * Math.PI * 2 +
          time * CONFIG.waveSpeed * speed + phase
        );
        const wave2 = Math.sin(
          t * CONFIG.waveFrequencyY * Math.PI * 3 +
          time * CONFIG.waveSpeed * 0.7 + phase * 1.3
        );
        const displacement = (wave1 * 0.6 + wave2 * 0.4) * CONFIG.waveAmplitude;

        let currentLength = Math.max(20, baseLength + displacement);
        const currentAngle = angle + Math.sin(time * CONFIG.waveSpeed * 0.5 + phase * 2) * 0.015;

        let ex = ox + Math.cos(currentAngle) * currentLength;
        let ey = oy + Math.sin(currentAngle) * currentLength;

        /* Mouse interaction — pushes line endpoints away from cursor */
        if (mouse.active && CONFIG.mouseStrength > 0) {
          const dx = ex - smoothMouse.x;
          const dy = ey - smoothMouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONFIG.mouseRadius && dist > 0.1) {
            const eased = Math.pow(1 - dist / CONFIG.mouseRadius, 3);
            ex += (dx / dist) * CONFIG.mouseStrength * eased;
            ey += (dy / dist) * CONFIG.mouseStrength * eased;
          }
          /* Angular influence — lines near cursor angle get a length boost */
          const mDx = smoothMouse.x - ox;
          const mDy = smoothMouse.y - oy;
          const mouseAngle = Math.atan2(mDy, mDx);
          let angleDiff = mouseAngle - currentAngle;
          while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
          while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
          const angularDist = Math.abs(angleDiff);
          if (angularDist < 0.8) {
            const angInfluence = 1 - angularDist / 0.8;
            const mouseDist = Math.sqrt(mDx * mDx + mDy * mDy);
            const radialInfluence = Math.max(0, 1 - mouseDist / (currentLength * 1.5));
            const boost = angInfluence * radialInfluence * CONFIG.mouseStrength * 0.4;
            currentLength += boost;
            ex = ox + Math.cos(currentAngle) * currentLength +
              (ex - (ox + Math.cos(currentAngle) * (currentLength - boost)));
            ey = oy + Math.sin(currentAngle) * currentLength +
              (ey - (oy + Math.sin(currentAngle) * (currentLength - boost)));
          }
        }

        /* Color based on distance from centre of the fan */
        const edgeDist = Math.abs(t - 0.5) * 2;
        const color = lerpColor(CONFIG.colors, edgeDist);
        const lineAlpha = color.a * (0.5 + 0.5 * (currentLength / (CONFIG.maxLength * 0.8)));

        /* Draw line from origin to endpoint */
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(${color.r},${color.g},${color.b},${lineAlpha * 0.65})`;
        ctx.lineWidth = CONFIG.lineWidth * widthMult;
        ctx.stroke();

        /* Draw dot at endpoint */
        const dr = CONFIG.dotRadius * (0.5 + 0.5 * widthMult);
        if (dr > 0) {
          ctx.beginPath();
          ctx.arc(ex, ey, dr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${color.r},${color.g},${color.b},${lineAlpha * 0.9})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(draw);
    }

    /* ── Event handlers ── */
    function onMouseMove(e: MouseEvent) {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
      mouse.active = true;
    }
    function onMouseLeave() {
      mouse.active = false;
    }
    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - r.left;
      mouse.y = e.touches[0].clientY - r.top;
      mouse.active = true;
    }
    function onTouchEnd() {
      mouse.active = false;
    }

    visual.addEventListener("mousemove", onMouseMove);
    visual.addEventListener("mouseleave", onMouseLeave);
    visual.addEventListener("touchmove", onTouchMove, { passive: false });
    visual.addEventListener("touchend", onTouchEnd);
    window.addEventListener("resize", resize);

    /* Start */
    resize();
    draw();

    /* Cleanup on unmount */
    return () => {
      cancelAnimationFrame(animId);
      visual.removeEventListener("mousemove", onMouseMove);
      visual.removeEventListener("mouseleave", onMouseLeave);
      visual.removeEventListener("touchmove", onTouchMove);
      visual.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("resize", resize);
    };
  }, []); // Runs once on mount

  /* Apply default preset background on mount */
  useEffect(() => {
    applyPreset("default");
  }, [applyPreset]);

  const stats = { signals, talks, bookshelf, picks };

  /* ── Light-bg conditional style helpers ── */
  const eyebrowColor = isLightBg ? "rgba(60,50,30,0.85)" : "rgba(255,255,255,0.72)";
  const subtitleColor = isLightBg ? "rgba(60,50,30,0.6)" : "rgba(255,255,255,0.62)";
  const statValueColor = isLightBg ? "rgba(40,30,10,0.95)" : "rgba(255,255,255,0.96)";
  const statTitleColor = isLightBg ? "rgba(60,50,30,0.85)" : "rgba(255,255,255,0.92)";
  const statCopyColor = isLightBg ? "rgba(60,50,30,0.6)" : "rgba(255,255,255,0.62)";
  const borderColor = isLightBg ? "rgba(60,50,30,0.18)" : "rgba(255,255,255,0.18)";
  const btnBorder = isLightBg ? "rgba(60,50,30,0.2)" : "rgba(255,255,255,0.2)";
  const btnBg = isLightBg ? "rgba(60,50,30,0.08)" : "rgba(255,255,255,0.08)";
  const btnColor = isLightBg ? "rgba(60,50,30,0.5)" : "rgba(255,255,255,0.6)";
  const panelBg = isLightBg ? "rgba(255,255,255,0.55)" : "rgba(30,25,15,0.55)";
  const panelBorder = isLightBg ? "rgba(60,50,30,0.12)" : "rgba(255,255,255,0.12)";
  const presetBtnBorder = isLightBg ? "rgba(60,50,30,0.15)" : "rgba(255,255,255,0.12)";
  const presetBtnBg = isLightBg ? "rgba(60,50,30,0.06)" : "rgba(255,255,255,0.06)";
  const presetBtnColor = isLightBg ? "rgba(60,50,30,0.55)" : "rgba(255,255,255,0.6)";
  const presetActiveBg = isLightBg ? "rgba(60,50,30,0.15)" : "rgba(255,255,255,0.18)";
  const presetActiveColor = isLightBg ? "rgba(40,30,10,0.95)" : "#fff";
  const presetActiveBorder = isLightBg ? "rgba(60,50,30,0.3)" : "rgba(255,255,255,0.3)";

  /* Default preset button uses gold accent */
  const defaultBtnBorder = isLightBg ? "rgba(160,120,40,0.4)" : "rgba(199,154,67,0.4)";
  const defaultBtnColor = isLightBg ? "#8a6a20" : "#c79a43";
  const defaultActiveBg = isLightBg ? "rgba(160,120,40,0.15)" : "rgba(199,154,67,0.2)";
  const defaultActiveColor = isLightBg ? "#6a5018" : "#c79a43";
  const defaultActiveBorder = isLightBg ? "rgba(160,120,40,0.5)" : "#c79a43";

  return (
    <section
      ref={sectionRef}
      className="w-full relative overflow-hidden flex flex-col"
      style={{
        minHeight: 780,
        color: isLightBg ? "rgba(60,50,30,0.85)" : "rgba(255,255,255,0.96)",
        transition: "background 0.6s ease",
      }}
    >
      {/* Glow overlay (::after equivalent) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "var(--glow-overlay, radial-gradient(circle at 50% 100%, rgba(255,230,160,0.12), transparent 28%), radial-gradient(circle at 50% 12%, rgba(255,255,255,0.03), transparent 42%))",
          transition: "background 0.6s ease",
        }}
      />

      {/* Inner content */}
      <div className="relative z-[1] flex flex-col flex-1 px-5 pt-14 md:px-16 md:pt-14">
        {/* Section header — same pattern as the rest of the site */}
        <div className="mb-16">
          {/* Gold label with line prefix */}
          <div className="flex items-center gap-3 mb-4">
            <span className="w-7 h-[1.5px]" style={{ background: "#C8A251" }} />
            <span
              className="text-[0.72rem] font-semibold tracking-[0.18em] uppercase"
              style={{ color: "#C8A251" }}
            >
              Overview
            </span>
          </div>
          <h2
            className="font-display font-bold tracking-[-0.03em] leading-[1.15]"
            style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)", color: isLightBg ? "var(--color-text)" : "rgba(255,255,255,0.96)" }}
          >
            Content Atlas
          </h2>
          <p
            className="text-[1.05rem] mt-4 max-w-[560px] leading-[1.7] font-light"
            style={{ color: subtitleColor }}
          >
            An overview with the real time number of books, videos, picks, and signals that shape this website.
          </p>
        </div>

        {/* Stats bar */}
        <div
          className="shrink-0"
          style={{
            borderTop: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            transition: "border-color 0.6s ease",
          }}
        >
          <div className="grid grid-cols-4">
            {STAT_META.map(({ key, title, copy }) => (
              <article key={key} className="py-7 px-5 max-md:py-5 max-md:px-3.5 max-sm:py-4 max-sm:px-2">
                <span
                  className="block mb-2 font-medium leading-[0.95] tracking-[-0.04em]"
                  style={{
                    fontSize: "clamp(22px, 2.5vw, 42px)",
                    color: statValueColor,
                  }}
                >
                  {stats[key]}
                </span>
                <span
                  className="block text-[15px] leading-tight font-medium mb-1.5 max-md:text-[13px] max-sm:text-[11px]"
                  style={{ color: statTitleColor }}
                >
                  {title}
                </span>
                <span
                  className="block max-w-[200px] text-[13px] leading-snug max-md:text-xs max-sm:hidden"
                  style={{ color: statCopyColor }}
                >
                  {copy}
                </span>
              </article>
            ))}
          </div>
        </div>

        {/* Canvas animation area — mt-10 adds breathing room below stats */}
        <div
          ref={visualRef}
          className="relative flex-1 flex items-end justify-center content-map-visual mt-10"
          style={{ minHeight: 520, marginBottom: -1 }}
        >
          {/* Controls — pause + theme */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            {/* Pause / Play */}
            <button
              onClick={() => setPaused((p) => !p)}
              title="Pause / Play"
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                border: `1px solid ${btnBorder}`,
                background: btnBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: btnColor,
                transition: "all 0.2s ease",
              }}
            >
              {paused ? (
                /* Play icon */
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="6,4 20,12 6,20" />
                </svg>
              ) : (
                /* Pause icon */
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setPresetPanelOpen((o) => !o)}
              title="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                border: `1px solid ${btnBorder}`,
                background: btnBg,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                color: btnColor,
                transition: "all 0.2s ease",
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </button>
          </div>

          {/* Preset panel */}
          {presetPanelOpen && (
            <div
              className="absolute top-14 right-4 flex gap-1.5 z-10 p-2 rounded-[10px]"
              style={{
                background: panelBg,
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: `1px solid ${panelBorder}`,
              }}
            >
              {Object.keys(PRESETS).map((name) => {
                const isActive = activePreset === name;
                const isDefault = name === "default";

                /* Determine button styles */
                let border = isActive ? presetActiveBorder : presetBtnBorder;
                let bg = isActive ? presetActiveBg : presetBtnBg;
                let color = isActive ? presetActiveColor : presetBtnColor;

                if (isDefault) {
                  border = isActive ? defaultActiveBorder : defaultBtnBorder;
                  bg = isActive ? defaultActiveBg : presetBtnBg;
                  color = isActive ? defaultActiveColor : defaultBtnColor;
                }

                return (
                  <button
                    key={name}
                    onClick={() => applyPreset(name)}
                    className="px-3 py-[5px] text-[11px] rounded-md cursor-pointer whitespace-nowrap font-body"
                    style={{
                      border: `1px solid ${border}`,
                      background: bg,
                      color,
                      transition: "all 0.15s",
                    }}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </button>
                );
              })}
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="absolute bottom-0 left-0 w-full h-full"
          />
        </div>
      </div>

      {/* Responsive overrides via a <style> tag scoped by data attribute */}
      <style>{`
        @media (max-width: 1080px) {
          .content-map-visual { min-height: 400px !important; }
        }
        @media (max-width: 640px) {
          .content-map-visual { min-height: 300px !important; }
        }
      `}</style>
    </section>
  );
}
