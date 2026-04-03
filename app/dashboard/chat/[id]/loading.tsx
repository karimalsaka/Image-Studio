export default function ChatLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="w-8 h-8 rounded-full border-2 border-stone-300 border-t-gray-900 animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Loading conversation...</p>
      </div>
    </div>
  );
}
