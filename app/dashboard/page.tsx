import Studio from "./components/Studio"

export default function Dashboard() {
  return (
    <div>
      <h1 className="font-display text-3xl font-medium tracking-tight text-gray-900 mb-1">
        Generate an Image
      </h1>
      <p className="text-gray-400 text-sm mb-8">
        Describe what you want to create and let AI bring it to life.
      </p>
      <Studio />
    </div>
  );
}
