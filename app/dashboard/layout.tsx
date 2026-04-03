export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {children}
      </div>
    </main>
  );
}
