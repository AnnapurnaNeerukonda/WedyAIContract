"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewContractPage() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [servicePackage, setServicePackage] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [loading, setLoading] = useState(false);

  async function aiAssist() {
    const res = await fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientName, eventDate, eventVenue, servicePackage }),
    });
    const data = await res.json();
    setContentHtml(`<p>${data.text.replace(/\n/g, "</p><p>")}</p>`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contracts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName, eventDate, eventVenue, servicePackage, contentHtml }),
      });
      if (!res.ok) throw new Error("Failed to create");
      const created = await res.json();
      router.replace(`/contracts/${created.id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1 className="text-2xl font-semibold mb-6">New Contract</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Client name</label>
            <input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Event date</label>
            <input type="date" className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required min={new Date().toISOString().slice(0, 10)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Event venue</label>
            <input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Service package/amount</label>
            <input className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10" value={servicePackage} onChange={(e) => setServicePackage(e.target.value)} required />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm">Contract content</label>
            <button type="button" onClick={aiAssist} className="text-sm underline">
              AI Assist
            </button>
          </div>
          <textarea className="w-full border rounded-md px-3 py-2 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-black/10" value={contentHtml.replace(/<[^>]+>/g, "")} onChange={(e) => setContentHtml(`<p>${e.target.value.replace(/\n/g, "</p><p>")}</p>`)} />
        </div>
        <button disabled={loading} className="bg-black text-white px-4 py-2 rounded-md hover:opacity-90 disabled:opacity-60">
          {loading ? "Creating..." : "Create contract"}
        </button>
        {loading && (
          <div className="flex items-center justify-center mt-4">
            <svg className="animate-spin h-5 w-5 mr-2 text-[var(--brand)]" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm text-gray-600">Saving contract, please wait...</span>
          </div>
        )}
      </form>
    </main>
  );
}


