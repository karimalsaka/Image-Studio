import Studio from "./components/Studio"
import RecentChats from "./components/RecentChats"

export default function Dashboard() {
  return (
    <div className="flex-1 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl font-medium tracking-tight text-[var(--text-primary)] mb-1">
            Generate an Image
          </h1>
          <p className="text-[var(--text-tertiary)] text-sm">
            Describe what you want to create and let AI bring it to life.
          </p>
        </div>
        <Studio />
        <RecentChats />
      </div>
    </div>
  );
}
