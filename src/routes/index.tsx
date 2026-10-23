import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishnu Priyan G — Digital Dimension Portfolio" },
      { name: "description", content: "Portfolio of Vishnu Priyan G, B.Sc. Computer Science student and aspiring software developer." },
      { property: "og:title", content: "Vishnu Priyan G — Digital Dimension" },
      { property: "og:description", content: "Curious mind. Creative code. Continuous growth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

/* ---------- Config: add real URLs here later ---------- */
const EMAIL = "vishnupriyan0554@gmail.com";
const PHONE = "7904843145";
const SOCIAL = { github: "", linkedin: "" };
const PROJECT_LINKS: Record<string, { code?: string; demo?: string }> = { "01": {}, "02": {}, "03": {} };

const NAV = ["home", "about", "skills", "projects", "education", "contact"];
const ROLES = ["Aspiring Software Developer", "Web Development Enthusiast", "Lifelong Learner"];

/* ---------- Vanilla-style effects ---------- */
function useEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { threshold: 0.15 },
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

    // custom cursor (desktop only)
    const ring = document.getElementById("cursor");
    const fine = window.matchMedia("(pointer: fine)").matches;
    const move = (e: PointerEvent) => {
      if (ring) ring.style.transform = `translate(${e.clientX - ring.offsetWidth / 2}px, ${e.clientY - ring.offsetHeight / 2}px)`;
    };
    const over = (e: Event) => ring?.classList.toggle("big", !!(e.target as HTMLElement).closest("a,button,[data-hover]"));
    if (fine && !reduce) { window.addEventListener("pointermove", move); window.addEventListener("pointerover", over); }
    return () => { io.disconnect(); window.removeEventListener("pointermove", move); window.removeEventListener("pointerover", over); };
  }, []);
}

function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!; const ctx = c.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const css = getComputedStyle(document.documentElement);
    const cyan = css.getPropertyValue("--cyan").trim();
    let w = 0, h = 0, raf = 0; const mouse = { x: -999, y: -999 };
    type P = { x: number; y: number; vx: number; vy: number };
    let pts: P[] = [];
    const resize = () => {
      w = c.width = c.offsetWidth * devicePixelRatio; h = c.height = c.offsetHeight * devicePixelRatio;
      const n = Math.min(90, Math.floor((c.offsetWidth * c.offsetHeight) / 14000));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const R = 130 * devicePixelRatio;
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < R) { p.x += dx / d; p.y += dy / d; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        ctx.fillStyle = cyan; ctx.globalAlpha = 0.7; ctx.fillRect(a.x, a.y, 2 * devicePixelRatio, 2 * devicePixelRatio);
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < R) { ctx.globalAlpha = (1 - d / R) * 0.25; ctx.strokeStyle = cyan; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
      }
      if (!reduce) raf = requestAnimationFrame(draw);
    };
    const pm = (e: PointerEvent) => { const r = c.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio; };
    resize(); draw();
    window.addEventListener("resize", resize); window.addEventListener("pointermove", pm);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", pm); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}

function Typer() {
  const [text, setText] = useState("");
  useEffect(() => {
    let i = 0, n = 0, del = false, t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = ROLES[i];
      n += del ? -1 : 1; setText(word.slice(0, n));
      let d = del ? 40 : 80;
      if (!del && n === word.length) { del = true; d = 1600; }
      else if (del && n === 0) { del = false; i = (i + 1) % ROLES.length; d = 300; }
      t = setTimeout(tick, d);
    };
    tick(); return () => clearTimeout(t);
  }, []);
  return <span className="font-mono text-cyan" aria-live="off">{"> "}{text}<span className="caret">_</span></span>;
}

/* ---------- Sections ---------- */
function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    NAV.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav aria-label="Main" className="flex w-full max-w-4xl items-center justify-between rounded-full border bg-background/70 px-5 py-2.5 backdrop-blur-md">
        <a href="#home" className="font-display text-xl font-extrabold">VP<span className="text-cyan">.</span></a>
        <ul className="hidden gap-1 md:flex">
          {NAV.map((id) => (
            <li key={id}>
              <a href={`#${id}`} aria-current={active === id ? "true" : undefined}
                className={`relative rounded-full px-3 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${active === id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {active === id && <span className="absolute inset-x-3 -bottom-0.5 h-px bg-cyan" />}
                {id}
              </a>
            </li>
          ))}
        </ul>
        <button className="font-mono text-xs uppercase tracking-widest md:hidden" aria-expanded={open} aria-controls="mnav" onClick={() => setOpen(!open)}>
          {open ? "Close ×" : "Menu ≡"}
        </button>
      </nav>
      {open && (
        <ul id="mnav" className="absolute top-16 w-[calc(100%-2rem)] rounded-3xl border bg-surface p-4 md:hidden">
          {NAV.map((id, i) => (
            <li key={id}><a href={`#${id}`} onClick={() => setOpen(false)} className={`flex justify-between py-3 font-display text-2xl ${active === id ? "text-cyan" : ""}`}>{id}<span className="label">0{i + 1}</span></a></li>
          ))}
        </ul>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden px-6 pt-28 pb-16 md:px-12">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <Constellation />
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="label reveal mb-6 flex items-center gap-3"><span className="status-dot h-2 w-2 rounded-full bg-cyan" />SYS.ONLINE — v2.0.26</p>
          <p className="reveal font-mono text-sm text-muted-foreground md:text-base">HELLO, WORLD. I'M</p>
          <h1 className="reveal font-display text-[clamp(3.2rem,11vw,9.5rem)] font-extrabold uppercase leading-[0.85] tracking-tight">
            Vishnu<br /><span className="text-outline">Priyan</span> <span className="text-glow">G</span>
          </h1>
          <p className="reveal mt-6 max-w-xl text-lg text-muted-foreground">Computer Science Student / Aspiring Developer</p>
          <p className="reveal mt-3 min-h-7 text-base md:text-lg"><Typer /></p>
          <p className="reveal mt-8 border-l-2 border-violet pl-4 font-display text-xl italic">Curious mind. Creative code. Continuous growth.</p>
          <div className="reveal mt-10 flex flex-wrap gap-4">
            <a href="#projects" className="group rounded-full bg-cyan px-7 py-3.5 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">Explore My Work <span className="inline-block transition-transform group-hover:translate-x-1">→</span></a>
            <a href="#contact" className="rounded-full border px-7 py-3.5 font-semibold transition-colors hover:border-cyan hover:text-cyan">Let's Connect</a>
          </div>
        </div>
        <div className="reveal relative mx-auto aspect-square w-64 md:w-80 lg:col-span-4 lg:w-full" aria-hidden style={{ perspective: "800px" }}>
          <div className="sphere absolute inset-6">
            {Array.from({ length: 9 }, (_, i) => <i key={i} style={{ transform: `rotateY(${i * 20}deg)` }} />)}
            {Array.from({ length: 5 }, (_, i) => <i key={`x${i}`} style={{ transform: `rotateX(90deg) translateZ(${(i - 2) * 40}px) scale(${1 - Math.abs(i - 2) * 0.22})` }} />)}
          </div>
          <div className="absolute inset-[38%] rounded-full bg-primary/40 blur-2xl" />
          <span className="label absolute -left-2 top-4">obj.sphere</span>
          <span className="label absolute bottom-2 right-0">rot: ∞</span>
        </div>
      </div>
      <a href="#about" className="absolute bottom-8 left-6 flex items-center gap-3 md:left-12" aria-label="Scroll to about">
        <span className="relative block h-12 w-px overflow-hidden bg-border"><span className="scroll-line absolute inset-0 bg-cyan" /></span>
        <span className="label">scroll</span>
      </a>
    </section>
  );
}

function SectionHead({ n, title }: { n: string; title: string }) {
  return (
    <div className="reveal mb-14 flex items-end gap-6">
      <span className="font-mono text-sm text-cyan">[{n}]</span>
      <h2 className="font-display text-[clamp(2.2rem,6vw,4.8rem)] font-extrabold uppercase leading-none">{title}</h2>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead n="01" title="A little about my world" />
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="reveal relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border bg-surface">
              <div className="grid-bg absolute inset-0 opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center font-display text-[11rem] font-extrabold leading-none text-outline">VP</div>
              <div className="absolute left-5 top-5 label">ID // student.cs</div>
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border bg-background/80 p-4 backdrop-blur">
                <p className="label">Currently exploring</p>
                <p className="mt-1 font-mono text-sm text-cyan">JavaScript · DOM · Problem solving</p>
              </div>
            </div>
            <div className="absolute -right-4 -top-4 hidden rounded-full border bg-background px-4 py-2 font-mono text-xs md:block">Year 02 / B.Sc. CS</div>
          </div>
          <div className="reveal lg:col-span-7 lg:pt-12">
            <p className="font-display text-2xl leading-snug md:text-3xl">
              Hi! I'm <span className="text-cyan">Vishnu Priyan G</span>, a second-year B.Sc. Computer Science student at KG College of Arts and Science.
            </p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              I'm passionate about technology, programming, and exploring new ideas. I'm developing my skills in web development and programming while learning how to build creative and useful applications. I enjoy learning new technologies, solving problems, and improving my technical knowledge. My goal is to become a skilled software developer and create projects that make a positive impact.
            </p>
            <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-3">
              {[["Focus", "Web dev"], ["Mode", "Learning"], ["Year", "Second"]].map(([k, v]) => (
                <div key={k} className="bg-background p-5"><dt className="label">{k}</dt><dd className="mt-2 font-display text-lg">{v}</dd></div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  { group: "Programming", code: "PRG", items: [["C", "Learning"], ["Python", "Beginner"], ["Java", "Beginner"]] },
  { group: "Web Development", code: "WEB", items: [["HTML5", "Learning"], ["CSS3", "Learning"], ["JavaScript", "Beginner"]] },
  { group: "Tools", code: "TLS", items: [["Git & GitHub", "Beginner"]] },
  { group: "Soft Skills", code: "SFT", items: [["Problem Solving", "Growing"], ["Teamwork", "Growing"], ["Communication", "Growing"]] },
];

function Skills() {
  const [sel, setSel] = useState(0);
  return (
    <section id="skills" className="bg-surface/50 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead n="02" title="Skill lab" />
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="reveal flex gap-2 overflow-x-auto lg:col-span-4 lg:flex-col" role="tablist" aria-label="Skill categories">
            {SKILLS.map((s, i) => (
              <button key={s.group} role="tab" aria-selected={sel === i} onClick={() => setSel(i)}
                className={`flex shrink-0 items-center justify-between gap-6 rounded-2xl border px-5 py-4 text-left transition-colors ${sel === i ? "border-cyan bg-background" : "hover:border-cyan/50"}`}>
                <span className="font-display text-lg">{s.group}</span>
                <span className={`font-mono text-xs ${sel === i ? "text-cyan" : "text-muted-foreground"}`}>{s.code}·{s.items.length}</span>
              </button>
            ))}
          </div>
          <div role="tabpanel" className="reveal relative min-h-80 rounded-3xl border bg-background p-6 md:p-10 lg:col-span-8">
            <div className="mb-8 flex items-center justify-between">
              <span className="label">module://{SKILLS[sel].code.toLowerCase()}</span>
              <span className="flex items-center gap-2 font-mono text-xs text-cyan"><span className="status-dot h-1.5 w-1.5 rounded-full bg-cyan" />active</span>
            </div>
            <ul key={sel} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {SKILLS[sel].items.map(([name, lvl], i) => (
                <li key={name} tabIndex={0} data-hover className="skill-tile animate-in fade-in slide-in-from-bottom-2 rounded-2xl border bg-surface p-5" style={{ animationDelay: `${i * 80}ms` }}>
                  <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                  <p className="mt-6 font-display text-2xl">{name}</p>
                  <p className="mt-2 inline-block rounded-full border px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-cyan">{lvl}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tags({ list }: { list: string[] }) {
  return <ul className="flex flex-wrap gap-2">{list.map((t) => <li key={t} className="rounded-full border px-3 py-1 font-mono text-xs">{t}</li>)}</ul>;
}
function Status() {
  return <span className="inline-flex items-center gap-2 rounded-full border border-violet/60 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-wider text-violet"><span className="h-1.5 w-1.5 rounded-full bg-violet" />Planned Project</span>;
}
function ProjLinks({ id }: { id: string }) {
  const l = PROJECT_LINKS[id];
  if (!l?.code && !l?.demo) return null;
  return <div className="mt-6 flex gap-4">{l.demo && <a href={l.demo} target="_blank" rel="noreferrer" className="text-cyan underline">Live demo</a>}{l.code && <a href={l.code} target="_blank" rel="noreferrer" className="text-cyan underline">Source</a>}</div>;
}
const TECH = ["HTML", "CSS", "JavaScript"];

function TodoPreview() {
  const [tasks, setTasks] = useState([{ t: "Learn DOM events", d: true }, { t: "Style task list", d: false }, { t: "Add local storage", d: false }]);
  return (
    <div className="rounded-2xl border bg-background p-5 shadow-2xl" aria-label="To-do preview (interactive mock)">
      <p className="label mb-4">tasks.today</p>
      <ul className="space-y-2">
        {tasks.map((k, i) => (
          <li key={k.t} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3">
            <button aria-label={`Toggle ${k.t}`} onClick={() => setTasks(tasks.map((x, j) => j === i ? { ...x, d: !x.d } : x))}
              className={`h-4 w-4 shrink-0 rounded border ${k.d ? "border-cyan bg-cyan" : ""}`} />
            <span className={`flex-1 text-sm ${k.d ? "text-muted-foreground line-through" : ""}`}>{k.t}</span>
            <button aria-label={`Delete ${k.t}`} onClick={() => setTasks(tasks.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">×</button>
          </li>
        ))}
        {!tasks.length && <li className="py-3 text-center font-mono text-xs text-muted-foreground">all clear ✓</li>}
      </ul>
    </div>
  );
}

function CalcPreview() {
  const [v, setV] = useState("0");
  const press = (k: string) => {
    if (k === "C") return setV("0");
    if (k === "=") { try { const r = /^[\d+\-*/.() ]+$/.test(v) ? Function(`return (${v})`)() : NaN; setV(Number.isFinite(r) ? String(+r.toFixed(6)) : "Err"); } catch { setV("Err"); } return; }
    setV(v === "0" || v === "Err" ? k : v + k);
  };
  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "C", "0", "=", "+"];
  return (
    <div className="w-full max-w-xs rounded-3xl border bg-background p-5 shadow-2xl">
      <output className="mb-4 block truncate rounded-xl bg-surface px-4 py-5 text-right font-mono text-3xl text-cyan" aria-live="polite">{v}</output>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button key={k} onClick={() => press(k)} className={`aspect-square rounded-xl font-mono text-lg transition-colors ${/[+\-*/=]/.test(k) ? "bg-primary/20 text-cyan hover:bg-primary/40" : "bg-surface hover:bg-muted"}`}>{k === "*" ? "×" : k === "/" ? "÷" : k}</button>
        ))}
      </div>
    </div>
  );
}

function Projects() {
  return (
    <section id="projects" className="px-6 py-28 md:px-12">
      <div className="mx-auto max-w-7xl">
        <SectionHead n="03" title="Project showcase" />
        <p className="reveal -mt-8 mb-16 max-w-xl text-muted-foreground">These are planned beginner projects — the previews below are concept mockups, not finished builds.</p>

        {/* 01 — wide browser mock */}
        <article className="reveal group relative mb-32 grid items-center gap-10 lg:grid-cols-12">
          <span className="pointer-events-none absolute -top-16 left-0 font-display text-[10rem] font-extrabold leading-none text-outline opacity-30">01</span>
          <div className="relative lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border bg-surface transition-transform duration-700 group-hover:-rotate-1 group-hover:scale-[1.02]">
              <div className="flex gap-1.5 border-b px-4 py-3"><i className="h-2.5 w-2.5 rounded-full bg-destructive/70" /><i className="h-2.5 w-2.5 rounded-full bg-violet/70" /><i className="h-2.5 w-2.5 rounded-full bg-cyan/70" /><span className="ml-4 font-mono text-[0.65rem] text-muted-foreground">vishnu.dev</span></div>
              <div className="grid-bg relative aspect-[16/9] p-8">
                <div className="h-3 w-24 rounded bg-cyan/60" />
                <div className="mt-6 h-8 w-3/4 rounded bg-foreground/80" /><div className="mt-3 h-8 w-1/2 rounded bg-foreground/40" />
                <div className="mt-8 flex gap-3"><div className="h-8 w-28 rounded-full bg-cyan" /><div className="h-8 w-24 rounded-full border" /></div>
                <div className="absolute bottom-6 right-8 h-24 w-24 rounded-full border-2 border-violet/60 transition-transform duration-700 group-hover:scale-125" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Status />
            <h3 className="mt-4 font-display text-4xl font-bold">Personal Portfolio Website</h3>
            <p className="mt-4 text-muted-foreground">A responsive personal website designed to showcase an introduction, education, skills, projects, and contact information.</p>
            <div className="mt-6"><Tags list={TECH} /></div>
            <ProjLinks id="01" />
          </div>
        </article>

        {/* 02 — reversed, interactive list */}
        <article className="reveal relative mb-32 grid items-center gap-10 rounded-[2.5rem] border bg-surface/60 p-6 md:p-12 lg:grid-cols-2">
          <div>
            <div className="flex items-baseline gap-4"><span className="font-display text-7xl font-extrabold text-cyan">02</span><Status /></div>
            <h3 className="mt-4 font-display text-4xl font-bold">To-Do List Application</h3>
            <p className="mt-4 text-muted-foreground">A task management application that lets users add tasks, mark them complete, and delete tasks.</p>
            <div className="mt-6"><Tags list={TECH} /></div>
            <p className="label mt-6">↳ try the mock — tick or delete a task</p>
            <ProjLinks id="02" />
          </div>
          <div className="rotate-1 transition-transform duration-500 hover:rotate-0"><TodoPreview /></div>
        </article>

        {/* 03 — centered stacked */}
        <article className="reveal relative flex flex-col items-center text-center">
          <span className="font-mono text-sm text-cyan">PROJECT_03</span>
          <h3 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold uppercase leading-none">Interactive<br /><span className="text-glow">Calculator</span></h3>
          <div className="mt-4"><Status /></div>
          <p className="mt-6 max-w-lg text-muted-foreground">A calculator for basic arithmetic operations with an interactive keypad and a clean user interface.</p>
          <div className="mt-6 flex justify-center"><Tags list={TECH} /></div>
          <div className="mt-12 flex w-full justify-center"><CalcPreview /></div>
          <ProjLinks id="03" />
        </article>
      </div>
    </section>
  );
}

function Education() {
  const items = [
    { tag: "NOW", place: "KG College of Arts and Science", detail: "B.Sc. Computer Science — Second Year", live: true },
    { tag: "PREV", place: "ASD Higher Secondary School, Ooty", detail: "Higher Secondary Education", live: false },
  ];
  return (
    <section id="education" className="bg-surface/50 px-6 py-28 md:px-12">
      <div className="mx-auto max-w-5xl">
        <SectionHead n="04" title="Education" />
        <ol className="relative border-l pl-8 md:pl-14">
          {items.map((e) => (
            <li key={e.place} className="reveal relative mb-16 last:mb-0">
              <span className={`absolute -left-[2.55rem] top-2 h-4 w-4 rounded-full border-2 md:-left-[4.05rem] ${e.live ? "status-dot border-cyan bg-cyan" : "bg-background"}`} />
              <span className="font-mono text-xs text-cyan">{e.tag}</span>
              <h3 className="mt-2 font-display text-3xl font-bold md:text-4xl">{e.place}</h3>
              <p className="mt-2 text-lg text-muted-foreground">{e.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Learning() {
  const list = ["Web development", "JavaScript fundamentals", "Programming and problem-solving", "Building practical projects"];
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      let n = 0; const t = setInterval(() => { n++; setShown(n); if (n >= list.length) clearInterval(t); }, 450);
    }, { threshold: 0.4 });
    if (ref.current) io.observe(ref.current); return () => io.disconnect();
  }, []);
  return (
    <section className="px-6 py-28 md:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <span className="font-mono text-sm text-cyan">[05]</span>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] font-extrabold uppercase leading-none">The next version of me</h2>
        </div>
        <div ref={ref} className="reveal overflow-hidden rounded-2xl border bg-background font-mono text-sm lg:col-span-7">
          <div className="flex items-center justify-between border-b bg-surface px-4 py-2.5"><span className="text-muted-foreground">~/vishnu/roadmap</span><span className="text-xs text-cyan">zsh</span></div>
          <div className="space-y-3 p-6 md:text-base">
            <p><span className="text-cyan">$</span> ./learn --status</p>
            {list.slice(0, shown).map((l) => <p key={l} className="animate-in fade-in"><span className="text-violet">[in progress]</span> {l}</p>)}
            <p className="text-muted-foreground">{shown >= list.length ? "# always compiling…" : ""}<span className="caret">▍</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Objective() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <p className="label reveal mb-8">[06] career.objective</p>
        <blockquote className="reveal font-display text-[clamp(1.6rem,3.6vw,3rem)] font-bold leading-tight">
          To strengthen my <span className="text-cyan">programming fundamentals</span>, gain practical development experience, and grow into a <span className="text-glow">skilled software developer</span> by building useful applications and continuously learning new technologies.
        </blockquote>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const loadedAt = useRef(Date.now());
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get("website") || Date.now() - loadedAt.current < 2500) { setStatus({ type: "err", msg: "Something looked automated. Please try again." }); return; }
    const name = String(f.get("name") || "").trim(), email = String(f.get("email") || "").trim(), message = String(f.get("message") || "").trim();
    const errs: Record<string, string> = {};
    if (name.length < 2 || name.length > 80) errs.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) errs.email = "Please enter a valid email.";
    if (message.length < 10 || message.length > 2000) errs.message = "Message should be 10–2000 characters.";
    setErrors(errs);
    if (Object.keys(errs).length) { setStatus({ type: "err", msg: "Please fix the highlighted fields." }); return; }
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${body}`;
    setStatus({ type: "ok", msg: "Your email app has opened with this message ready — press send there to deliver it." });
  };
  const field = "w-full rounded-xl border bg-surface px-4 py-3.5 outline-none transition-colors focus:border-cyan";
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 md:px-12">
      <div className="grid-bg absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-7xl">
        <p className="label reveal">[07] contact</p>
        <h2 className="reveal mt-4 font-display text-[clamp(2.8rem,9vw,8rem)] font-extrabold uppercase leading-[0.88]">Have an idea?<br /><span className="text-outline">Let's connect.</span></h2>
        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <div className="reveal space-y-6 lg:col-span-5">
            <a href={`mailto:${EMAIL}`} className="group block border-b pb-6"><span className="label">email</span><span className="mt-2 block break-all font-display text-xl group-hover:text-cyan md:text-2xl">{EMAIL} ↗</span></a>
            <a href={`tel:+91${PHONE}`} className="group block border-b pb-6"><span className="label">phone</span><span className="mt-2 block font-display text-xl group-hover:text-cyan md:text-2xl">+91 {PHONE} ↗</span></a>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href={`mailto:${EMAIL}`} className="rounded-full bg-cyan px-6 py-3 font-semibold text-primary-foreground">Send Email</a>
              <a href={`tel:+91${PHONE}`} className="rounded-full border px-6 py-3 font-semibold hover:border-cyan">Call Me</a>
              {SOCIAL.github && <a href={SOCIAL.github} target="_blank" rel="noreferrer" className="rounded-full border px-6 py-3 font-semibold hover:border-cyan">GitHub</a>}
              {SOCIAL.linkedin && <a href={SOCIAL.linkedin} target="_blank" rel="noreferrer" className="rounded-full border px-6 py-3 font-semibold hover:border-cyan">LinkedIn</a>}
            </div>
          </div>
          <form onSubmit={onSubmit} noValidate className="reveal space-y-5 rounded-3xl border bg-background/80 p-6 backdrop-blur md:p-10 lg:col-span-7">
            <div className="absolute -left-[9999px]" aria-hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
            {(["name", "email"] as const).map((n) => (
              <div key={n}>
                <label htmlFor={n} className="label mb-2 block">{n}</label>
                <input id={n} name={n} type={n === "email" ? "email" : "text"} autoComplete={n} aria-invalid={!!errors[n]} aria-describedby={`${n}-err`} className={`${field} ${errors[n] ? "border-destructive" : ""}`} />
                {errors[n] && <p id={`${n}-err`} className="mt-1.5 text-sm text-destructive">{errors[n]}</p>}
              </div>
            ))}
            <div>
              <label htmlFor="message" className="label mb-2 block">message</label>
              <textarea id="message" name="message" rows={5} aria-invalid={!!errors.message} aria-describedby="message-err" className={`${field} resize-none ${errors.message ? "border-destructive" : ""}`} />
              {errors.message && <p id="message-err" className="mt-1.5 text-sm text-destructive">{errors.message}</p>}
            </div>
            <button type="submit" className="w-full rounded-full bg-foreground py-4 font-semibold text-background transition-colors hover:bg-cyan">Compose message →</button>
            {status && <p role="status" className={`rounded-xl border p-3 text-sm ${status.type === "ok" ? "border-cyan text-cyan" : "border-destructive text-destructive"}`}>{status.msg}</p>}
            <p className="text-xs text-muted-foreground">This form opens your email app — no message is stored or sent from this site.</p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 font-mono text-xs text-muted-foreground sm:flex-row">
        <p className="flex items-center gap-2"><span className="status-dot h-1.5 w-1.5 rounded-full bg-cyan" />Designed with curiosity by Vishnu Priyan G.</p>
        <p>© {new Date().getFullYear()} · VP.</p>
      </div>
    </footer>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => { const f = () => setShow(window.scrollY > 800); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  return (
    <a href="#home" aria-label="Back to top" className={`fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border bg-background/80 backdrop-blur transition-all hover:border-cyan hover:text-cyan ${show ? "opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>↑</a>
  );
}

function Index() {
  useEffects();
  return (
    <>
      <div id="cursor" className="cursor-ring hidden md:block" aria-hidden />
      <Nav />
      <main>
        <Hero /><About /><Skills /><Projects /><Education /><Learning /><Objective /><Contact />
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}
