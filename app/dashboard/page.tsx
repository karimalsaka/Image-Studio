import Studio from "./components/Studio"
import RecentChats from "./components/RecentChats"

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6">
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
        </div>
      </div>
      <div className="max-w-5xl mx-auto w-full px-6 pb-10">
        <RecentChats />
      </div>
    </div>
  );
}
