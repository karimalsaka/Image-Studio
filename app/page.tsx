import Link from "next/link";
import FadeIn from "./components/FadeIn";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[var(--text-tertiary)] text-[13px] font-medium tracking-widest uppercase mb-6">
            AI-Powered Image Generation
          </p>
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.08] text-[var(--text-primary)] mb-5">
            Create something{" "}
            <span className="italic">beautiful</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg mb-12 max-w-md mx-auto leading-relaxed">
            From idea to image in seconds. Your personal AI artist, ready when you are.
          </p>

          <Link
            href="/dashboard"
            className="group inline-flex items-center gap-2.5 bg-[var(--accent)] text-[var(--accent-text)] text-[13px] font-semibold px-7 py-3 rounded-full hover:bg-[var(--accent-hover)] transition-all"
          >
            Start Generating
            <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
