"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ContractsPage() {
  const [contracts, setContracts] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/contracts", { cache: "no-store" });
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        if (!res.ok) throw new Error("Failed to load contracts");
        const data = await res.json();
        setContracts(data);
      } catch (e: any) {
        setError(e.message || "Failed to load");
        setContracts([]);
      }
    })();
  }, []);

  return (
    <main>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Your Contracts</h1>
        <Link className="bg-black text-white px-4 py-2 rounded-md" href="/contracts/new">
          New Contract
        </Link>
      </div>
      {contracts === null ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {contracts.length === 0 ? (
            <p className="text-gray-600">No contracts yet.</p>
          ) : (
            contracts.map((c: any) => (
              <Link key={c.id || c._id} href={`/contracts/${c.id || c._id}`} className="block border p-4 rounded-lg hover:shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.clientName}</p>
                    <p className="text-sm text-gray-600">{c.eventDate?.slice(0, 10)} — {c.eventVenue}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 uppercase tracking-wide">{c.status}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      )}
    </main>
  );
}


