import Link from "next/link";
import FadeIn from "./components/FadeIn";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 pb-28">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.1] text-gray-900 mb-4">
            Create something{" "}
            <span className="italic">beautiful</span>
          </h1>
          <p className="text-gray-500 text-lg mb-10">
            Idea to image in seconds, with your personal AI artist
          </p>

          <Link
            href="/dashboard"
            className="inline-block bg-gray-900 text-white text-sm font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Start Generating
          </Link>
        </div>
      </FadeIn>
    </div>
  );
}
