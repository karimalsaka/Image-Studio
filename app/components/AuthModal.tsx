"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { signUp, logIn } from "@/app/services/api";
import { ApiError } from "@/app/services/errors";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setError("");
    setName("");
    setEmail("");
    setPassword("");
  };

  const switchMode = (m: "login" | "signup") => {
    reset();
    setMode(m);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || loading) return;

    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const data = await signUp(email, name, password);
        login(data.user);
      } else {
        const data = await logIn(email, password);
        login(data.user);
      }
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface-raised)] border border-[var(--border)] rounded-2xl shadow-xl shadow-black/8 w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => switchMode("login")}
            className={`flex-1 py-3.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === "login"
                ? "text-[var(--text-primary)] border-b-2 border-[var(--text-primary)] -mb-px"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => switchMode("signup")}
            className={`flex-1 py-3.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              mode === "signup"
                ? "text-[var(--text-primary)] border-b-2 border-[var(--text-primary)] -mb-px"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-[var(--text-secondary)] text-[13px] leading-relaxed">
            {mode === "login"
              ? "Sign in to generate images and save your conversations."
              : "Create an account to start generating images with AI."}
          </p>

          {mode === "signup" && (
            <div>
              <label className="block text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)] transition-colors placeholder:text-[var(--text-tertiary)]"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)] transition-colors placeholder:text-[var(--text-tertiary)]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-[var(--text-tertiary)] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 px-3.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[14px] text-[var(--text-primary)] outline-none focus:border-[var(--border-hover)] transition-colors placeholder:text-[var(--text-tertiary)]"
              placeholder={mode === "signup" ? "Choose a password" : "Your password"}
            />
          </div>

          {error && (
            <div className="px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <p className="text-red-500 text-[13px]">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!email.trim() || !password.trim() || loading}
            className="w-full h-10 rounded-xl bg-[var(--accent)] text-[var(--accent-text)] text-[14px] font-semibold hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading
              ? mode === "login" ? "Signing in..." : "Creating account..."
              : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
