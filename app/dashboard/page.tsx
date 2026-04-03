import Studio from "./components/Studio"
import RecentChats from "./components/RecentChats"

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
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
  );
}
