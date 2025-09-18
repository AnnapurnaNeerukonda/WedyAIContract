"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TEST_USERS = [
  { label: "Photographer", email: "photographer@test.com" },
  { label: "Caterer", email: "caterer@test.com" },
  { label: "Florist", email: "florist@test.com" },
];

const loginBg = "url('/images/login.jpeg')";

const demoTexts = [
  "Your One Stop Wedding Shop 💍",
  "With Wedy: You can build the wedding package that is right for you and your budget. Our customizable options let you add what you love and exclude what doesn't match your vision. Start with a venue and base package, then have fun tweaking for the perfect experience!",
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showFields, setShowFields] = useState(false);

  function handleDemoClick(user: typeof TEST_USERS[number]) {
    setEmail(user.email);
    setPassword("password123");
    setShowFields(true);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || "Login failed");
      }
      router.replace("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: loginBg }}
    >
      <div className="w-full max-w-md rounded-xl border p-8 shadow-lg bg-white/90 backdrop-blur">
        <h1 className="text-3xl font-bold mb-2 text-[var(--brand)]">Welcome to Wedy</h1>
        <div className="mb-4 space-y-1">
          {demoTexts.map((t, i) => (
            <p key={i} className="text-sm text-gray-700">{t}</p>
          ))}
        </div>
        {!showFields && (
          <div className="mb-6">
            <p className="text-xs text-gray-600 mb-2">Choose a demo login:</p>
            <div className="flex gap-2">
              {TEST_USERS.map((u) => (
                <button
                  key={u.email}
                  type="button"
                  className="bg-[var(--brand)] text-white px-3 py-2 rounded hover:opacity-90 text-xs"
                  onClick={() => handleDemoClick(u)}
                >
                  Demo Cred for {u.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {showFields && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="block text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                required
                readOnly
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10"
                required
                readOnly
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white rounded-md py-2 hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


