import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import p1 from "@/assets/photo-1.jpg.asset.json";
import p2 from "@/assets/photo-2.jpg.asset.json";
import p3 from "@/assets/photo-3.jpg.asset.json";
import p4 from "@/assets/photo-4.jpg.asset.json";
import p5 from "@/assets/photo-5.jpg.asset.json";
import theme from "@/assets/theme.mp3.asset.json";

/* Deterministic pseudo-random so server and client render the same sky */
const rnd = (i: number, s = 1) => {
  const x = Math.sin(i * 12.9898 * s + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Stage = "welcome" | "opening" | "book" | "finale";

/* ------------------------------------------------------------------ */
/* Decorative pieces                                                   */
/* ------------------------------------------------------------------ */
function Crown({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 40" className={className} fill="none" aria-hidden>
      <path d="M4 34 L8 10 L20 22 L32 4 L44 22 L56 10 L60 34 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 38 H58" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="32" cy="4" r="2.2" fill="currentColor" />
      <circle cx="8" cy="10" r="1.8" fill="currentColor" />
      <circle cx="56" cy="10" r="1.8" fill="currentColor" />
    </svg>
  );
}

function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 16" className={className} fill="none" aria-hidden>
      <path d="M0 8 H80 M120 8 H200" stroke="currentColor" strokeWidth="0.8" />
      <path d="M100 2 L106 8 L100 14 L94 8 Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="86" cy="8" r="1.4" fill="currentColor" />
      <circle cx="114" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function Sky() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      {Array.from({ length: 70 }).map((_, i) => (
        <span
          key={`s${i}`}
          className="absolute rounded-full bg-ivory animate-twinkle"
          style={{
            left: `${rnd(i) * 100}%`,
            top: `${rnd(i, 2) * 100}%`,
            width: rnd(i, 3) > 0.85 ? 3 : 1.5,
            height: rnd(i, 3) > 0.85 ? 3 : 1.5,
            animationDelay: `${rnd(i, 4) * 3}s`,
            animationDuration: `${2 + rnd(i, 5) * 4}s`,
          }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={`g${i}`}
          className="absolute rounded-full bg-gold-light shadow-glow"
          style={{
            left: `${rnd(i, 6) * 100}%`,
            top: "105%",
            width: 3,
            height: 3,
            opacity: 0.6,
            animation: `drift ${18 + rnd(i, 7) * 18}s linear ${-rnd(i, 8) * 30}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Story pages                                                         */
/* ------------------------------------------------------------------ */
function PageFrame({ children, n }: { children: ReactNode; n?: number }) {
  return (
    <div className="relative h-full w-full bg-paper text-ink">
      <div className="absolute inset-3 rounded-sm border border-gold/60" />
      <div className="absolute inset-[18px] rounded-sm border border-gold/25" />
      <div className="relative flex h-full flex-col px-7 py-8 sm:px-9">{children}</div>
      {n !== undefined && (
        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 font-display text-sm text-gold">— {n} —</span>
      )}
    </div>
  );
}

function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`rounded-sm bg-ivory p-2 shadow-[0_8px_20px_-8px_oklch(0_0_0/40%)] ring-1 ring-gold/50 ${className}`}>
      <img src={src} alt={alt} className="h-full w-full rounded-[2px] object-cover" draggable={false} loading="lazy" />
    </div>
  );
}

function Chapter({ num, title }: { num: string; title: string }) {
  return (
    <div className="text-center">
      <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-gold">Chapter {num}</p>
      <h3 className="mt-1 font-display text-2xl font-semibold leading-tight sm:text-[1.7rem]">{title}</h3>
    </div>
  );
}

const body = "font-display text-[1.05rem] leading-snug text-ink/85 sm:text-lg";

function buildPages(onFinish: () => void): ReactNode[] {
  return [
    // 0 — Cover
    <div key="cover" className="relative h-full w-full overflow-hidden bg-navy text-gold-light">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,oklch(0.77_0.1_80/18%),transparent_60%)]" />
      <div className="absolute inset-4 rounded-sm border border-gold/70" />
      <div className="absolute inset-[22px] rounded-sm border border-gold/30" />
      <div className="absolute inset-y-0 left-0 w-3 bg-navy-deep/80" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <Crown className="w-20 text-gold" />
        <Flourish className="mt-6 w-40 text-gold/70" />
        <h2 className="mt-5 font-display text-4xl font-semibold leading-tight text-gold-gradient sm:text-5xl">
          The Magical
          <br />
          First Year
        </h2>
        <Flourish className="mt-5 w-40 text-gold/70" />
        <p className="mt-6 font-display text-lg italic text-ivory/80">Dedicated to Prince Ishaq</p>
        <p className="absolute bottom-10 font-sans text-[10px] uppercase tracking-[0.4em] text-gold/70">Tap to open</p>
      </div>
    </div>,

    // 1 — Prologue
    <PageFrame key="pro" n={1}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Crown className="w-12 text-gold" />
        <p className="mt-6 font-display text-3xl italic">Once upon a time…</p>
        <Flourish className="my-5 w-32 text-gold" />
        <p className={body}>
          in a kingdom made of love, a family waited for a wish to come true. One gentle morning, the stars leaned close,
          the sky turned soft with gold — and a little prince named <strong className="font-semibold">Ishaq</strong>{" "}
          arrived, bringing a brand-new kind of magic with him.
        </p>
      </div>
    </PageFrame>,

    // 2 — Photo 1 (newborn, portrait large)
    <PageFrame key="c1" n={2}>
      <Chapter num="I" title="The Little Prince Arrives" />
      <Photo src={p1.url} alt="Baby Ishaq in a cosy beige outfit and Mickey hat, sitting in front of a shiny red car" className="mx-auto mt-4 min-h-0 w-[78%] flex-1" />
      <p className={`${body} mt-4 mb-4 text-center`}>
        So tiny, so curious — already riding in style and greeting his kingdom with wide, wondering eyes.
      </p>
    </PageFrame>,

    // 3 — Photo 2 (thobe, regal)
    <PageFrame key="c2" n={3}>
      <div className="flex flex-1 flex-col justify-center gap-4">
        <Photo src={p2.url} alt="Ishaq in a white thobe with a black and gold embroidered vest, sitting on a sofa" className="mx-auto aspect-[3/4] w-[70%] -rotate-2" />
        <Chapter num="II" title="Dressed Like Royalty" />
        <p className={`${body} mb-4 text-center`}>
          In white and gold he sat, calm as a little king — every bit the prince of our hearts.
        </p>
      </div>
    </PageFrame>,

    // 4 — Photo 3 (smile, minimal)
    <PageFrame key="c3" n={4}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Chapter num="III" title="The Smile That Lit the Kingdom" />
        <div className="mt-5 aspect-square w-[72%] overflow-hidden rounded-full p-2 ring-1 ring-gold bg-ivory shadow-[0_10px_30px_-10px_oklch(0_0_0/40%)]">
          <img src={p3.url} alt="Ishaq smiling brightly in a white button shirt" className="h-full w-full rounded-full object-cover object-[50%_45%]" draggable={false} loading="lazy" />
        </div>
        <p className="mt-6 mb-4 font-display text-2xl italic leading-snug">“One smile, and the whole palace glowed.”</p>
      </div>
    </PageFrame>,

    // 5 — Photo 4 (night out)
    <PageFrame key="c4" n={5}>
      <Chapter num="IV" title="Evenings of Wonder" />
      <div className="mt-4 flex min-h-0 flex-1 gap-4">
        <Photo src={p4.url} alt="Ishaq in a yellow t-shirt at an evening restaurant, looking around with curiosity" className="min-h-0 w-[58%]" />
        <div className="flex w-[42%] flex-col justify-center">
          <Flourish className="mb-3 w-full text-gold" />
          <p className={`${body} !text-base`}>
            When the lanterns came on, the little prince explored the night — every light a new star, every face a new friend.
          </p>
        </div>
      </div>
      <div className="h-8" />
    </PageFrame>,

    // 6 — Photo 5 (beach)
    <PageFrame key="c5" n={6}>
      <Chapter num="V" title="Adventures by the Sea" />
      <Photo src={p5.url} alt="Ishaq on the beach in a red swimsuit and sun hat, playing with sand toys" className="mx-auto mt-4 min-h-0 w-[74%] flex-1 rotate-1" />
      <p className={`${body} mt-4 mb-4 text-center`}>
        With sand on his toes and treasures in hand, he discovered that the whole world is a playground.
      </p>
    </PageFrame>,

    // 7 — Epilogue
    <PageFrame key="epi" n={7}>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <Crown className="w-12 text-gold" />
        <p className={`${body} mt-6`}>
          And so, one magical year has passed. A little prince has completed his first wonderful year — and this storybook
          exists to celebrate the beginning of his journey.
        </p>
        <Flourish className="my-6 w-32 text-gold" />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFinish();
          }}
          className="rounded-full bg-navy px-6 py-3 font-display text-lg tracking-wide text-gold-light shadow-glow transition hover:scale-105"
        >
          Begin the Celebration ✦
        </button>
      </div>
    </PageFrame>,
  ];
}

/* ------------------------------------------------------------------ */
/* Storybook with 3D page turning                                      */
/* ------------------------------------------------------------------ */
const FLIP_MS = 900;

function Storybook({ onFinish }: { onFinish: () => void }) {
  const pages = buildPages(onFinish);
  const last = pages.length - 1;
  const [page, setPage] = useState(0);
  const [flip, setFlip] = useState<{ dir: "fwd" | "back"; from: number; to: number } | null>(null);
  const [touched, setTouched] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const bookRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (dir: "fwd" | "back") => {
      if (flip) return;
      const to = dir === "fwd" ? page + 1 : page - 1;
      if (to < 0) return;
      if (to > last) return onFinish();
      setTouched(true);
      setFlip({ dir, from: page, to });
      window.setTimeout(() => {
        setPage(to);
        setFlip(null);
      }, FLIP_MS);
    },
    [flip, page, last, onFinish],
  );

  // Keyboard navigation
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go("fwd");
      if (e.key === "ArrowLeft") go("back");
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [go]);

  // Swipe or tap the page edges
  const onDown = (e: React.PointerEvent) => (start.current = { x: e.clientX, y: e.clientY });
  const onUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || !bookRef.current) return;
    const dx = e.clientX - s.x;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(e.clientY - s.y)) return go(dx < 0 ? "fwd" : "back");
    const r = bookRef.current.getBoundingClientRect();
    const rel = (e.clientX - r.left) / r.width;
    if (page === 0 || rel > 0.55) go("fwd");
    else if (rel < 0.35) go("back");
  };

  const base = flip ? (flip.dir === "fwd" ? flip.to : flip.from) : page;
  const turning = flip ? (flip.dir === "fwd" ? flip.from : flip.to) : null;

  return (
    <div className="relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-4 py-10">
      <div className="animate-book-in" style={{ perspective: "2200px" }}>
        <div
          ref={bookRef}
          role="region"
          aria-label={`Storybook, page ${page + 1} of ${pages.length}`}
          onPointerDown={onDown}
          onPointerUp={onUp}
          className="relative cursor-pointer select-none rounded-r-md shadow-book"
          style={{ width: "min(90vw, 440px, 52dvh)", aspectRatio: "5 / 7", touchAction: "pan-y" }}
        >
          {/* Page block edges for thickness */}
          <div className="absolute -right-1.5 top-1.5 bottom-1.5 w-2 rounded-r-sm bg-[repeating-linear-gradient(90deg,var(--ivory)_0_1px,oklch(0.85_0.02_85)_1px_2px)]" aria-hidden />
          <div className="absolute inset-0 overflow-hidden rounded-r-md">{pages[base]}</div>

          {turning !== null && flip && (
            <div
              className={`absolute inset-0 ${flip.dir === "fwd" ? "flip-forward" : "flip-backward"}`}
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-r-md" style={{ backfaceVisibility: "hidden" }}>
                {pages[turning]}
                <div className="page-shade absolute inset-0 bg-gradient-to-l from-navy-deep/70 to-transparent" />
                <div className="absolute inset-y-0 right-0 w-1 bg-gold-light/60" />
              </div>
              <div
                className="absolute inset-0 rounded-l-md bg-paper"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="page-shade absolute inset-0 bg-gradient-to-r from-navy-deep/60 to-transparent" />
              </div>
            </div>
          )}
          {/* Shadow cast on the page below during a turn */}
          {flip && <div className="page-shade pointer-events-none absolute inset-0 bg-gradient-to-r from-navy-deep/50 via-transparent to-transparent" />}

          {!touched && page > 0 && (
            <span className="animate-hint pointer-events-none absolute bottom-10 right-5 font-sans text-[11px] uppercase tracking-widest text-gold">
              Turn the page →
            </span>
          )}
        </div>
      </div>

      <div className="mt-7 flex items-center gap-5">
        <button type="button" onClick={() => go("back")} disabled={page === 0} aria-label="Previous page" className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 text-gold-light transition hover:bg-gold/15 disabled:opacity-30">
          ←
        </button>
        <span className="min-w-20 text-center font-display text-lg text-gold-light">
          {page === 0 ? "Cover" : `${page} / ${last}`}
        </span>
        <button type="button" onClick={() => go("fwd")} aria-label="Next page" className="grid h-11 w-11 place-items-center rounded-full border border-gold/60 text-gold-light transition hover:bg-gold/15">
          →
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Final celebration                                                   */
/* ------------------------------------------------------------------ */
function Finale({ onReplay }: { onReplay: () => void }) {
  return (
    <div className="relative z-10 flex min-h-[100dvh] items-center justify-center overflow-hidden px-6 py-14">
      {/* Confetti — falls a few times, then fades */}
      <div className="pointer-events-none fixed inset-0" aria-hidden>
        {Array.from({ length: 70 }).map((_, i) => (
          <span
            key={i}
            className={i % 3 === 0 ? "absolute bg-ivory" : "absolute bg-gold-gradient"}
            style={{
              left: `${rnd(i, 9) * 100}%`,
              top: 0,
              width: 6 + rnd(i, 10) * 6,
              height: 10 + rnd(i, 11) * 8,
              borderRadius: i % 4 === 0 ? 999 : 1,
              animation: `fall ${4 + rnd(i, 12) * 4}s ease-in ${rnd(i, 13) * 3}s 3 both`,
            }}
          />
        ))}
        {/* Balloons */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`b${i}`}
            className="absolute"
            style={{ left: `${6 + i * 12}%`, bottom: "-160px", animation: `float-up ${14 + rnd(i, 14) * 8}s ease-in ${i * 0.8}s infinite` }}
          >
            <div style={{ animation: `sway ${3 + rnd(i, 15) * 2}s ease-in-out infinite` }}>
              <div className={`h-20 w-16 rounded-[50%] opacity-85 ${i % 3 === 0 ? "bg-ivory" : i % 3 === 1 ? "bg-gold-gradient" : "bg-navy ring-1 ring-gold"}`} />
              <div className="mx-auto h-20 w-px bg-gold/60" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex max-w-xl flex-col items-center text-center">
        <Crown className="w-16 animate-rise text-gold" />
        <div className="relative mt-2 animate-rise" style={{ animationDelay: ".3s" }}>
          <span className="block font-display text-[11rem] font-bold leading-none text-gold-gradient drop-shadow-[0_0_40px_oklch(0.88_0.11_88/40%)] sm:text-[14rem]">
            1
          </span>
          <div className="absolute -right-10 bottom-6 h-24 w-24 overflow-hidden rounded-full p-1 bg-gold-gradient shadow-glow sm:-right-16 sm:h-28 sm:w-28">
            <img src={p3.url} alt="Ishaq smiling" className="h-full w-full rounded-full object-cover object-[50%_45%]" />
          </div>
        </div>
        <p className="mt-2 animate-rise font-sans text-sm uppercase tracking-[0.45em] text-gold-light" style={{ animationDelay: ".8s" }}>
          Happy 1st Birthday
        </p>
        <h1 className="mt-3 animate-rise font-display text-5xl font-semibold text-ivory sm:text-6xl" style={{ animationDelay: "1.1s" }}>
          Prince Ishaq
        </h1>
        <Flourish className="mt-5 w-48 animate-rise text-gold" />
        <p className="mt-5 animate-rise font-display text-xl italic leading-relaxed text-ivory/85 sm:text-2xl" style={{ animationDelay: "1.5s" }}>
          May your little world always be filled with wonder, your days with laughter, and your heart with endless love.
        </p>
        <button type="button" onClick={onReplay} className="btn-royal mt-9 animate-rise" style={{ animationDelay: "2s" }}>
          ↺ Relive the Magic
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main experience: welcome → opening → book → finale                  */
/* ------------------------------------------------------------------ */
export function Experience() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [playing, setPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audio = useRef<HTMLAudioElement | null>(null);

  // A single audio element for the whole session
  const getAudio = () => {
    if (!audio.current) {
      const a = new Audio(theme.url);
      a.loop = true;
      a.volume = 0.6;
      a.addEventListener("play", () => setPlaying(true));
      a.addEventListener("pause", () => setPlaying(false));
      a.addEventListener("error", () => setAudioError(true));
      audio.current = a;
    }
    return audio.current;
  };
  const play = () => {
    setAudioError(false);
    getAudio().play().catch(() => setAudioError(true));
  };
  const toggle = () => (playing ? audio.current?.pause() : play());

  useEffect(() => () => audio.current?.pause(), []);

  const open = () => {
    play();
    setStage("opening");
    window.setTimeout(() => setStage("book"), 1100);
  };

  const finish = useCallback(() => {
    setStage("finale");
    window.scrollTo({ top: 0 });
  }, []);

  const replay = () => {
    if (audio.current) audio.current.currentTime = 0;
    setStage("welcome");
  };

  return (
    <main className="relative min-h-[100dvh] overflow-hidden">
      <Sky />

      {stage !== "welcome" && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause music" : "Play music"}
          className="fixed right-4 top-4 z-30 flex items-center gap-2 rounded-full border border-gold/50 bg-navy-deep/70 px-4 py-2 font-sans text-xs text-gold-light backdrop-blur transition hover:bg-gold/15"
        >
          {playing ? "♪ Music on" : audioError ? "♪ Tap to play music" : "♪ Music off"}
        </button>
      )}

      {(stage === "welcome" || stage === "opening") && (
        <section className={`relative z-10 flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center transition-all duration-1000 ${stage === "opening" ? "scale-110 opacity-0 blur-sm" : ""}`}>
          <span className="h-2 w-2 animate-rise rounded-full bg-gold-light shadow-glow" />
          <Crown className="mt-6 w-20 animate-rise text-gold" />
          <p className="mt-6 animate-rise font-sans text-xs uppercase tracking-[0.4em] text-muted-foreground sm:text-sm" style={{ animationDelay: ".6s" }}>
            Welcome to a Magical Little Kingdom
          </p>
          <h1 className="mt-4 animate-rise font-display text-6xl font-semibold leading-none text-gold-gradient sm:text-8xl" style={{ animationDelay: "1.1s" }}>
            Prince Ishaq
          </h1>
          <Flourish className="mt-6 w-56 animate-rise text-gold/80" />
          <p className="mt-5 animate-rise font-display text-xl italic text-ivory/85 sm:text-2xl" style={{ animationDelay: "1.6s" }}>
            A Little Prince, A Magical First Year
          </p>
          <button type="button" onClick={open} className="btn-royal mt-12 animate-rise" style={{ animationDelay: "2.2s" }}>
            ✦ Open the Magic
          </button>
        </section>
      )}

      {stage === "opening" && (
        <div className="pointer-events-none fixed inset-0 z-20 m-auto h-10 w-10 animate-burst rounded-full bg-gold-light" aria-hidden />
      )}

      {stage === "book" && <Storybook onFinish={finish} />}
      {stage === "finale" && <Finale onReplay={replay} />}
    </main>
  );
}
