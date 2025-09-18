"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/contracts", { method: "GET" })
      .then((res) => setLoggedIn(res.status !== 401))
      .catch(() => setLoggedIn(false));
  }, []);

  return (
    <header className="border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-[var(--brand)]">wedy</Link>
        <nav className="flex items-center gap-4 text-sm">
          {loggedIn && (
            <>
              <Link href="/contracts" className="hover:underline">Contracts</Link>
              <form action="/api/logout" method="post">
                <button className="hover:underline">Logout</button>
              </form>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}


