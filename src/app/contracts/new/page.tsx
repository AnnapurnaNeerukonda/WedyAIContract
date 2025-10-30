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
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-purple-50 via-white to-yellow-50 border shadow-md rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[var(--brand)]">Create a New Contract</h1>
          <p className="text-gray-700 mb-6">Fill in your event and client details below. Use AI Assist for instant contract suggestions!</p>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-1 font-medium">Client name</label>
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Event date</label>
                <input type="date" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required min={new Date().toISOString().slice(0, 10)} />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Event venue</label>
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={eventVenue} onChange={(e) => setEventVenue(e.target.value)} required />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Service package/amount</label>
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={servicePackage} onChange={(e) => setServicePackage(e.target.value)} required />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Contract content</label>
                <button type="button" onClick={aiAssist} className="text-[var(--brand)] text-sm underline font-semibold hover:opacity-80">
                  AI Assist
                </button>
              </div>
              <textarea className="w-full border rounded-lg px-4 py-2 min-h-[180px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={contentHtml.replace(/<[^>]+>/g, "")} onChange={(e) => setContentHtml(`<p>${e.target.value.replace(/\n/g, "</p><p>")}</p>`)} />
            </div>
            <button disabled={loading} className="w-full bg-[var(--brand)] text-white px-6 py-3 rounded-lg shadow-lg hover:opacity-95 font-semibold text-lg transition disabled:opacity-60">
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
        </div>
      </div>
    </main>
  );
}


