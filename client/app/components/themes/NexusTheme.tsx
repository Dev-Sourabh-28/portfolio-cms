"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────
   HELPER UTILITIES
───────────────────────────────────────────── */
const getFontFamily = (f?: string) => ({ "font-serif": "Georgia,serif", "font-mono": "monospace", "cursive": "cursive", "fantasy": "fantasy" }[f || ""] || "inherit");
const getFontStyle = (s?: string) => s === "italic" ? "italic" : "normal";
const getFontSize = (s?: string, fallback = "16px") => ({ "text-sm": ".875rem", "text-base": "1rem", "text-lg": "1.125rem", "text-xl": "1.25rem", "text-2xl": "1.5rem", "text-3xl": "1.875rem", "text-4xl": "2.25rem", "text-5xl": "3rem", "text-6xl": "3.75rem", "text-7xl": "4.5rem" }[s || ""] || fallback);
const getImageSize = (s?: string) => ({ small: "110px", medium: "150px", large: "190px", xlarge: "230px" }[s || ""] || "160px");
const getProjectImageSize = (s?: string) => ({ small: "160px", medium: "210px", large: "260px", xlarge: "310px" }[s || ""] || "210px");
const getShapeBorderRadius = (s?: string) => ({ circular: "50%", square: "0", rounded: "18px", hexagon: "0", pentagon: "0", octagon: "0" }[s || ""] || "50%");
const getShapeClip = (s?: string) => ({ hexagon: "polygon(25% 6.7%,75% 6.7%,100% 50%,75% 93.3%,25% 93.3%,0 50%)", pentagon: "polygon(50% 0%,95% 35%,77% 100%,23% 100%,5% 35%)", octagon: "polygon(30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0 70%,0 30%)" }[s || ""] || "none");

/* ─────────────────────────────────────────────
   FLOATING PARTICLES
───────────────────────────────────────────── */
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const N = 60;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.5 + .4,
      a: Math.random()
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.a = .3 + .4 * Math.abs(Math.sin(Date.now() * .001 + p.r));
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.a})`; ctx.fill();
      });
      for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
        const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(139,92,246,${.12 * (1 - d / 120)})`; ctx.lineWidth = .5; ctx.stroke();
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ─────────────────────────────────────────────
   CURSOR SPOTLIGHT + TRAIL
───────────────────────────────────────────── */
function CursorFX() {
  const spotRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<{ el: HTMLDivElement; x: number; y: number }[]>([]);
  const trailDotsRef = useRef<{ el: HTMLDivElement; x: number; y: number }[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    const N = 10;
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden";
    document.body.appendChild(container);

    const spot = document.createElement("div");
    spot.style.cssText = `position:fixed;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.13) 0%,transparent 70%);transform:translate(-50%,-50%);pointer-events:none;transition:opacity .3s;z-index:9998`;
    document.body.appendChild(spot);
    spotRef.current = spot;

    const dots = Array.from({ length: N }, (_, i) => {
      const d = document.createElement("div");
      const s = 10 - i * .8;
      d.style.cssText = `position:fixed;width:${s}px;height:${s}px;border-radius:50%;background:rgba(139,92,246,${.9 - i * .08});transform:translate(-50%,-50%);pointer-events:none;transition:none`;
      container.appendChild(d);
      return { el: d, x: 0, y: 0 };
    });
    trailDotsRef.current = dots;

    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      spot.style.left = e.clientX + "px"; spot.style.top = e.clientY + "px";
    };
    window.addEventListener("mousemove", onMove);

    let raf;
    const animate = () => {
      const { x, y } = mouseRef.current;
      dots[0].x += (x - dots[0].x) * .35;
      dots[0].y += (y - dots[0].y) * .35;
      for (let i = 1; i < N; i++) {
        dots[i].x += (dots[i - 1].x - dots[i].x) * .4;
        dots[i].y += (dots[i - 1].y - dots[i].y) * .4;
      }
      dots.forEach(d => { d.el.style.left = d.x + "px"; d.el.style.top = d.y + "px"; });
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      document.body.removeChild(spot);
      document.body.removeChild(container);
    };
  }, []);
  return null;
}

/* ─────────────────────────────────────────────
   MAGNETIC BUTTON
───────────────────────────────────────────── */
function MagneticButton({ children, className, style, onClick, href, target }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = (e.clientX - cx) * .35, dy = (e.clientY - cy) * .35;
    el.style.transform = `translate(${dx}px,${dy}px)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  }, []);
  const Tag = href ? "a" : "button";
  return (
    <Tag ref={ref} href={href} target={target} onClick={onClick} className={className} style={{ ...style, transition: "transform .15s ease" }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   3D TILT CARD
───────────────────────────────────────────── */
function TiltCard({ children, className, style }) {
  const ref = useRef(null);
  const handleMouseMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(900px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(8px)`;
    const shine = el.querySelector(".card-shine");
    if (shine) shine.style.background = `radial-gradient(circle at ${(x + .5) * 100}% ${(y + .5) * 100}%, rgba(255,255,255,.12) 0%, transparent 65%)`;
  }, []);
  const handleMouseLeave = useCallback(() => {
    const el = ref.current; if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0px)";
    const shine = el.querySelector(".card-shine");
    if (shine) shine.style.background = "none";
  }, []);
  return (
    <div ref={ref} className={className} style={{ ...style, transition: "transform .12s ease", transformStyle: "preserve-3d", willChange: "transform" }}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <div className="card-shine" style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", zIndex: 10, transition: "background .15s" }} />
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────────────── */
function Reveal({ children, delay = 0, direction = "up", className, style }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: .12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(-40px)", right: "translateX(40px)" };
  return (
    <div ref={ref} className={className} style={{
      ...style, opacity: visible ? 1 : 0,
      transform: visible ? "translate(0)" : transforms[direction] || transforms.up,
      transition: `opacity .7s ${delay}s cubic-bezier(.22,.68,0,1.2), transform .7s ${delay}s cubic-bezier(.22,.68,0,1.2)`
    }}>
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────
   SHIMMER TEXT
───────────────────────────────────────────── */
function ShimmerText({ children, tag: Tag = "span", style, className }) {
  return (
    <Tag className={className} style={{
      ...style,
      background: "linear-gradient(90deg,#fff 0%,#a78bfa 30%,#67e8f9 50%,#a78bfa 70%,#fff 100%)",
      backgroundSize: "200% auto", WebkitBackgroundClip: "text", backgroundClip: "text",
      WebkitTextFillColor: "transparent", color: "transparent",
      animation: "shimmer 3.5s linear infinite"
    }}>
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   ROTATING GRADIENT BORDER
───────────────────────────────────────────── */
function RotatingBorder({ children, style, className }) {
  return (
    <div className={className} style={{ position: "relative", ...style }}>
      <div style={{
        position: "absolute", inset: -2, borderRadius: "inherit", padding: 2,
        background: "conic-gradient(from var(--rot,0deg),#7c3aed,#06b6d4,#10b981,#f59e0b,#7c3aed)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0)",
        WebkitMaskComposite: "xor", maskComposite: "exclude",
        animation: "spin 4s linear infinite", zIndex: 0
      }} />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED SKILL PILL
───────────────────────────────────────────── */
function SkillPill({ tech, i }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Reveal delay={i * .04} direction="up">
      <span onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-block", padding: "6px 16px", borderRadius: 999,
          border: `1px solid ${hovered ? "rgba(167,139,250,.6)" : "rgba(255,255,255,.1)"}`,
          background: hovered ? "rgba(124,58,237,.18)" : "rgba(255,255,255,.04)",
          color: hovered ? "#a78bfa" : "rgba(255,255,255,.55)",
          fontSize: 13, cursor: "default",
          transition: "all .25s cubic-bezier(.22,.68,0,1.2)",
          transform: hovered ? "translateY(-3px) scale(1.06)" : "none",
          boxShadow: hovered ? "0 4px 20px rgba(124,58,237,.3)" : "none"
        }}>
        {tech}
      </span>
    </Reveal>
  );
}

/* ─────────────────────────────────────────────
   PARALLAX SECTION WRAPPER
───────────────────────────────────────────── */
function ParallaxSection({ children, speed = .3, style, className }) {
  const ref = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = ref.current; if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const offset = (window.innerHeight / 2 - rect.top - rect.height / 2) * speed;
      el.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);
  return <div ref={ref} className={className} style={style}>{children}</div>;
}

/* ─────────────────────────────────────────────
   STICKY PROJECT CARD
───────────────────────────────────────────── */
function StickyProject({ project, index, total, profileImageStyle, projectImageStyle, openImageModal }) {
  const [hovered, setHovered] = useState(false);
  const stickyTop = 80 + index * 24;

  const imgs = project.imageUrls?.length ? project.imageUrls : project.imageUrl ? [project.imageUrl] : [];
  const extra = imgs.length - 1;

  return (
    <TiltCard
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: "sticky", top: stickyTop,
        background: "rgba(13,21,40,.85)",
        backdropFilter: "blur(24px)",
        border: `1px solid ${hovered ? "rgba(139,92,246,.5)" : "rgba(255,255,255,.08)"}`,
        borderRadius: 24, overflow: "hidden",
        boxShadow: hovered ? "0 32px 80px rgba(124,58,237,.25), inset 0 0 0 1px rgba(139,92,246,.2)" : "0 8px 40px rgba(0,0,0,.4)",
        transition: "border-color .3s, box-shadow .3s",
        marginBottom: 24, zIndex: 10 + index
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        {imgs.length > 0 && (
          <div style={{ position: "relative", overflow: "hidden" }}>
            <button type="button" onClick={() => openImageModal(imgs, 0)} style={{ display: "block", width: "100%", border: "none", padding: 0, background: "none", cursor: "pointer" }}>
              <img src={imgs[0]} alt={project.title}
                style={{ width: "100%", height: getProjectImageSize(projectImageStyle?.size), objectFit: "cover", borderRadius: `${getShapeBorderRadius(projectImageStyle?.shape)} ${getShapeBorderRadius(projectImageStyle?.shape)} 0 0`, clipPath: getShapeClip(projectImageStyle?.shape), display: "block", transform: hovered ? "scale(1.04)" : "scale(1)", transition: "transform .5s ease" }} />
            </button>
            {extra > 0 && (
              <button type="button" onClick={() => openImageModal(imgs, 0)}
                style={{ position: "absolute", right: 12, bottom: 12, background: "rgba(0,0,0,.75)", color: "#fff", border: "none", borderRadius: 999, padding: "4px 12px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                +{extra}
              </button>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom,transparent 50%,rgba(13,21,40,.9) 100%)", pointerEvents: "none" }} />
          </div>
        )}
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-.3px" }}>{project.title}</h3>
            <span style={{ fontSize: 12, color: "rgba(167,139,250,.7)", padding: "2px 10px", borderRadius: 999, border: "1px solid rgba(167,139,250,.25)", background: "rgba(124,58,237,.08)", whiteSpace: "nowrap" }}>
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
          </div>
          <p style={{ marginTop: 10, fontSize: 14, color: "rgba(255,255,255,.5)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{project.description}</p>
          {project.techStack?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
              {project.techStack.map(t => (
                <span key={t} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.25)", color: "#a78bfa" }}>{t}</span>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            {project.githubUrl && (
              <MagneticButton href={project.githubUrl} target="_blank"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.12)", color: "rgba(255,255,255,.6)", fontSize: 12, background: "transparent", textDecoration: "none", cursor: "pointer" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.085 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" /></svg>
                GitHub
              </MagneticButton>
            )}
            {project.liveUrl && (
              <MagneticButton href={project.liveUrl} target="_blank"
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 18px", borderRadius: 999, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", fontSize: 12, fontWeight: 600, border: "none", textDecoration: "none", cursor: "pointer", boxShadow: "0 4px 20px rgba(124,58,237,.35)" }}>
                Live ↗
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/* ─────────────────────────────────────────────
   IMAGE GALLERY MODAL
───────────────────────────────────────────── */
function ImageModal({ images, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const k = (e) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") onPrev(); if (e.key === "ArrowRight") onNext(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.92)", backdropFilter: "blur(20px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button onClick={(e) => { e.stopPropagation(); onPrev(); }}
        style={{ position: "fixed", left: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 999, width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
      <img src={images[index]} alt="" onClick={e => e.stopPropagation()}
        style={{ maxWidth: "88vw", maxHeight: "86vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 40px 120px rgba(0,0,0,.8)" }} />
      <button onClick={(e) => { e.stopPropagation(); onNext(); }}
        style={{ position: "fixed", right: 24, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 999, width: 48, height: 48, color: "#fff", fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
      <button onClick={onClose} style={{ position: "fixed", top: 24, right: 24, background: "rgba(255,255,255,.08)", border: "1px solid rgba(255,255,255,.15)", borderRadius: 999, width: 40, height: 40, color: "#fff", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
      {images.length > 1 && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {images.map((_, i) => <div key={i} style={{ width: i === index ? 24 : 8, height: 8, borderRadius: 999, background: i === index ? "#a78bfa" : "rgba(255,255,255,.3)", transition: "all .25s" }} />)}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   RENDER CUSTOM FIELDS
───────────────────────────────────────────── */
function renderCustomField(field) {
  if (!field.isVisible) return null;
  const content = typeof field.content === "string" ? field.content : "";
  const s = field.style || {};
  const base = { fontFamily: getFontFamily(s.fontFamily), fontSize: s.fontSize || "1rem", fontWeight: s.fontWeight?.replace("font-", "") || 400, fontStyle: getFontStyle(s.fontStyle), color: s.color || "rgba(255,255,255,.7)" };
  const shared = { fontFamily: base.fontFamily, fontStyle: base.fontStyle, color: base.color, lineHeight: 1.7, marginTop: 12 };
  if (field.type === "heading") return <h2 key={field.id} style={{ ...shared, fontSize: "1.25rem", fontWeight: 700, marginBottom: 8 }} dangerouslySetInnerHTML={{ __html: content }} />;
  if (field.type === "paragraph") return <p key={field.id} style={shared} dangerouslySetInnerHTML={{ __html: content }} />;
  if (field.type === "orderedList") return <ol key={field.id} style={{ ...shared, paddingLeft: 20 }} dangerouslySetInnerHTML={{ __html: content }} />;
  if (field.type === "unorderedList") return <ul key={field.id} style={{ ...shared, paddingLeft: 20 }} dangerouslySetInnerHTML={{ __html: content }} />;
  return null;
}

/* ─────────────────────────────────────────────
   GLOBAL STYLES (injected once)
───────────────────────────────────────────── */
function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
      .nexus-root{font-family:'DM Sans',sans-serif;background:#050b18;color:#fff;min-height:100vh;overflow-x:hidden;cursor:none}
      .nexus-root *{box-sizing:border-box;margin:0;padding:0;cursor:none!important}
      @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
      @keyframes spin{to{--rot:360deg}}
      @property --rot{syntax:'<angle>';initial-value:0deg;inherits:false}
      @keyframes float{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-18px) rotate(2deg)}}
      @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      @keyframes aurora{0%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.08)}66%{transform:translate(-40px,30px) scale(.95)}100%{transform:translate(0,0) scale(1)}}
      @keyframes gradRotate{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
      @keyframes pulse-ring{0%{transform:scale(.95);box-shadow:0 0 0 0 rgba(124,58,237,.5)}70%{transform:scale(1);box-shadow:0 0 0 14px rgba(124,58,237,0)}100%{transform:scale(.95);box-shadow:0 0 0 0 rgba(124,58,237,0)}}
      @keyframes borderGlow{0%,100%{box-shadow:0 0 20px rgba(124,58,237,.3),inset 0 0 20px rgba(124,58,237,.05)}50%{box-shadow:0 0 40px rgba(6,182,212,.4),inset 0 0 30px rgba(6,182,212,.08)}}
      @keyframes meshMove{0%{background-position:0% 0%}100%{background-position:100% 100%}}
      @keyframes slideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
      @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      .hero-title{animation:slideUp .9s cubic-bezier(.22,.68,0,1.2) both}
      .hero-sub{animation:slideUp .9s .15s cubic-bezier(.22,.68,0,1.2) both}
      .hero-bio{animation:slideUp .9s .25s cubic-bezier(.22,.68,0,1.2) both}
      .hero-cta{animation:slideUp .9s .35s cubic-bezier(.22,.68,0,1.2) both}
      .hero-stats{animation:slideUp .9s .45s cubic-bezier(.22,.68,0,1.2) both}
      .profile-float{animation:float 6s ease-in-out infinite}
      @media(max-width:768px){.nexus-hero{flex-direction:column!important;gap:40px!important;padding-top:100px!important}.nexus-grid{grid-template-columns:1fr!important}.nexus-nav{padding:0 20px!important}.nexus-section{padding:0 20px 80px!important;padding-top:100px!important}.nexus-hero-gap{gap:40px!important}.nexus-stats-gap{gap:24px!important}.nexus-profile-img{width:160px!important;height:160px!important}}
    `}</style>
  );
}

/* ─────────────────────────────────────────────
   MAIN THEME EXPORT
───────────────────────────────────────────── */
export default function NexusTheme({ portfolio, isPreview = false }) {
  const [showResumeMenu, setShowResumeMenu] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalIndex, setModalIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const openImageModal = (imgs, idx = 0) => { setModalImages(imgs); setModalIndex(idx); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroParallax = scrollY * .35;

  return (
    <div className="nexus-root" style={{ position: isPreview ? 'relative' : undefined, minHeight: isPreview ? 'auto' : undefined }}>
      {!isPreview && <GlobalStyles />}
      {!isPreview && <CursorFX />}
      {!isPreview && <Particles />}

      {/* ── AURORA BG ── */}
      {!isPreview && <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle,rgba(124,58,237,.22) 0%,transparent 70%)", top: "-20%", left: "-15%", animation: "aurora 12s ease-in-out infinite", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,.18) 0%,transparent 70%)", top: "30%", right: "-10%", animation: "aurora 15s 4s ease-in-out infinite", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,.14) 0%,transparent 70%)", bottom: "-10%", left: "30%", animation: "aurora 18s 8s ease-in-out infinite", filter: "blur(60px)" }} />
        {/* mesh gradient */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(at 20% 20%,rgba(124,58,237,.08) 0,transparent 50%),radial-gradient(at 80% 80%,rgba(6,182,212,.06) 0,transparent 50%),radial-gradient(at 50% 50%,rgba(16,185,129,.04) 0,transparent 70%)", backgroundSize: "200% 200%", animation: "meshMove 20s linear infinite" }} />
        {/* subtle grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at 50% 50%,#000 40%,transparent 80%)" }} />
      </div>}

      {/* ── NAV ── */}
      {!isPreview && <nav className="nexus-nav" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "0 40px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: scrollY > 20 ? "blur(20px)" : "none", background: scrollY > 20 ? "rgba(5,11,24,.7)" : "transparent", borderBottom: scrollY > 20 ? "1px solid rgba(255,255,255,.07)" : "1px solid transparent", transition: "all .4s" }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, background: "linear-gradient(90deg,#fff,#a78bfa)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          {portfolio.title?.split(" ")[0] || "Portfolio"}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Work", "About"].map(l => (
            <MagneticButton key={l} style={{ padding: "7px 16px", borderRadius: 999, border: "1px solid rgba(255,255,255,.1)", background: "rgba(255,255,255,.04)", color: "rgba(255,255,255,.65)", fontSize: 13, textDecoration: "none" }}>
              {l}
            </MagneticButton>
          ))}
        </div>
      </nav>}

      {/* ── HERO ── */}
      <section className="nexus-section" style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "0 40px", paddingTop: 130, paddingBottom: 80, zIndex: 1 }}>
        <div className="nexus-hero nexus-hero-gap" style={{ display: "flex", alignItems: "center", gap: 80 }}>

          {/* LEFT */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="hero-title" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 14px", borderRadius: 999, border: "1px solid rgba(124,58,237,.4)", background: "rgba(124,58,237,.1)", marginBottom: 28 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", animation: "pulse-ring 2s infinite" }} />
              <span style={{ fontSize: 12, color: "#a78bfa", letterSpacing: ".06em", textTransform: "uppercase" }}>Available for work</span>
            </div>

            <ShimmerText tag="h1" className="hero-title"
              style={{ fontFamily: "'Syne',sans-serif", fontSize: getFontSize(portfolio.titleStyle?.fontSize, "clamp(2.8rem,6vw,4.5rem)"), fontWeight: portfolio.titleStyle?.fontWeight?.replace("font-", "") || 800, fontStyle: getFontStyle(portfolio.titleStyle?.fontStyle), lineHeight: 1.08, letterSpacing: "-1px", display: "block" }}>
              {portfolio.title}
            </ShimmerText>

            {portfolio.subtitle && (
              <p className="hero-sub" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: getFontSize(portfolio.subtitleStyle?.fontSize, "1.3rem"), fontWeight: 300, fontStyle: getFontStyle(portfolio.subtitleStyle?.fontStyle), color: portfolio.subtitleStyle?.color || "rgba(255,255,255,.55)", marginTop: 12, letterSpacing: ".01em" }}>
                {portfolio.subtitle}
              </p>
            )}

            <p className="hero-bio" style={{ fontFamily: getFontFamily(portfolio.bioStyle?.fontFamily) || "'DM Sans',sans-serif", fontSize: getFontSize(portfolio.bioStyle?.fontSize, "1rem"), fontWeight: portfolio.bioStyle?.fontWeight?.replace("font-", "") || 400, fontStyle: getFontStyle(portfolio.bioStyle?.fontStyle), color: portfolio.bioStyle?.color || "rgba(255,255,255,.6)", marginTop: 22, maxWidth: 520, lineHeight: 1.75 }}>
              {portfolio.bio}
            </p>

            {portfolio.customFields?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                {portfolio.customFields.sort((a, b) => a.order - b.order).map(renderCustomField)}
              </div>
            )}

            <div className="hero-cta" style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 36 }}>
              {portfolio.resumeImageUrl && (
                <div style={{ position: "relative" }}>
                  <MagneticButton onClick={() => setShowResumeMenu(v => !v)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 999, background: "linear-gradient(135deg,#7c3aed,#06b6d4)", color: "#fff", fontSize: 14, fontWeight: 600, border: "none", boxShadow: "0 8px 32px rgba(124,58,237,.4)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                    Resume
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                  </MagneticButton>
                  {showResumeMenu && (
                    <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, background: "rgba(13,21,40,.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, overflow: "hidden", minWidth: 170, zIndex: 20, boxShadow: "0 20px 60px rgba(0,0,0,.5)" }}>
                      <a href={portfolio.resumeImageUrl} target="_blank" rel="noopener noreferrer" onClick={() => setShowResumeMenu(false)}
                        style={{ display: "block", padding: "12px 18px", fontSize: 13, color: "rgba(255,255,255,.7)", textDecoration: "none", transition: "background .2s" }}
                        onMouseEnter={e => e.target.style.background = "rgba(255,255,255,.06)"}
                        onMouseLeave={e => e.target.style.background = "none"}>View Resume</a>
                      <a href={portfolio.resumeImageUrl} download onClick={() => setShowResumeMenu(false)}
                        style={{ display: "block", padding: "12px 18px", fontSize: 13, color: "rgba(255,255,255,.7)", textDecoration: "none", borderTop: "1px solid rgba(255,255,255,.06)", transition: "background .2s" }}
                        onMouseEnter={e => e.target.style.background = "rgba(255,255,255,.06)"}
                        onMouseLeave={e => e.target.style.background = "none"}>Download Resume</a>
                    </div>
                  )}
                </div>
              )}
              {portfolio.bestProjectUrl && (
                <MagneticButton href={portfolio.bestProjectUrl} target="_blank"
                  style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 24px", borderRadius: 999, border: "1px solid rgba(255,255,255,.15)", color: "rgba(255,255,255,.7)", fontSize: 14, background: "transparent", textDecoration: "none" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  Best Project
                </MagneticButton>
              )}
            </div>

            {/* Stats */}
            <div className="hero-stats nexus-stats-gap" style={{ display: "flex", flexWrap: "wrap", gap: 36, marginTop: 48 }}>
              {[
                { value: `${portfolio.yearsExperience || 0}+`, label: "Years Exp." },
                { value: `${portfolio.clientsHandled || 0}+`, label: "Clients" },
                { value: `${portfolio.projects?.length || 0}+`, label: "Projects" },
              ].map((s, i) => (
                <Reveal key={s.label} delay={i * .1}>
                  <div style={{ textAlign: "center" }}>
                    <ShimmerText tag="p" style={{ fontFamily: "'Syne',sans-serif", fontSize: "2.2rem", fontWeight: 800, display: "block" }}>{s.value}</ShimmerText>
                    <p style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: ".14em", color: "rgba(255,255,255,.28)", marginTop: 4 }}>{s.label}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Skills */}
            {portfolio.techStack?.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 32 }}>
                {portfolio.techStack.map((t, i) => <SkillPill key={t} tech={t} i={i} />)}
              </div>
            )}
          </div>

          {/* RIGHT: Profile photo */}
          {portfolio.profilePhotoUrl && (
            <div style={{ position: "relative", flexShrink: 0, transform: `translateY(${-heroParallax * .15}px)` }}>
              <div style={{ position: "absolute", inset: -3, borderRadius: getShapeBorderRadius(portfolio.profileImageStyle?.shape) || "50%", background: "conic-gradient(from 0deg,#7c3aed,#06b6d4,#10b981,#f59e0b,#7c3aed)", animation: "spin 6s linear infinite", zIndex: 0 }} />
              <div className="profile-float" style={{ position: "relative", zIndex: 1 }}>
                <img src={portfolio.profilePhotoUrl} alt="Profile"
                  className="nexus-profile-img"
                  style={{ width: getImageSize(portfolio.profileImageStyle?.size), height: getImageSize(portfolio.profileImageStyle?.size), borderRadius: getShapeBorderRadius(portfolio.profileImageStyle?.shape), clipPath: getShapeClip(portfolio.profileImageStyle?.shape), objectFit: "cover", display: "block", position: "relative", zIndex: 1 }} />
              </div>
              <div style={{ position: "absolute", inset: -40, background: "radial-gradient(circle,rgba(124,58,237,.25) 0%,transparent 70%)", zIndex: 0, filter: "blur(20px)" }} />
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      {portfolio.projects?.length > 0 && (
        <ParallaxSection style={{ position: "relative", maxWidth: 1200, margin: "0 auto", padding: "60px 40px 120px", zIndex: 1 }}>
          <Reveal direction="up">
            <div style={{ marginBottom: 60 }}>
              <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: ".14em", color: "#a78bfa", display: "block", marginBottom: 12 }}>Selected Work</span>
              <ShimmerText tag="h2" style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 800, letterSpacing: "-1px", display: "block" }}>
                Featured Projects
              </ShimmerText>
            </div>
          </Reveal>

          <div className="nexus-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
            {portfolio.projects.map((project, i) => (
              <Reveal key={project.id || i} delay={i * .08} direction={i % 2 === 0 ? "left" : "right"}>
                <StickyProject
                  project={project} index={i} total={portfolio.projects.length}
                  projectImageStyle={portfolio.projectImageStyle}
                  profileImageStyle={portfolio.profileImageStyle}
                  openImageModal={openImageModal}
                />
              </Reveal>
            ))}
          </div>
        </ParallaxSection>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,.07)", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,.25)", letterSpacing: ".04em" }}>
          {portfolio.title} · Built with ✦ Nexus Theme
        </p>
      </footer>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <ImageModal images={modalImages} index={modalIndex} onClose={closeModal}
          onPrev={() => setModalIndex(i => (i - 1 + modalImages.length) % modalImages.length)}
          onNext={() => setModalIndex(i => (i + 1) % modalImages.length)} />
      )}
    </div>
  );
}