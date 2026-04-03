import ChatSidebar from "./components/ChatSidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[calc(100vh-56px)] bg-[var(--surface)]">
      <ChatSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
