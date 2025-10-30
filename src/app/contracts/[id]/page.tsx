"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";

export default function ContractDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [contract, setContract] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [contentHtml, setContentHtml] = useState("");
  const [typedName, setTypedName] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editEventDate, setEditEventDate] = useState("");
  const [editEventVenue, setEditEventVenue] = useState("");
  const [editServicePackage, setEditServicePackage] = useState("");
  const sigRef = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/contracts/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setContract(data);
        setContentHtml(data.contentHtml || "");
        setEditClientName(data.clientName || "");
        setEditEventDate(data.eventDate ? data.eventDate.slice(0, 10) : "");
        setEditEventVenue(data.eventVenue || "");
        setEditServicePackage(data.servicePackage || "");
      }
    })();
  }, [params.id]);

  async function saveEdits() {
    const res = await fetch(`/api/contracts/${params.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientName: editClientName,
        eventDate: editEventDate,
        eventVenue: editEventVenue,
        servicePackage: editServicePackage,
        contentHtml,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setContract(updated);
      setEditing(false);
    }
  }

  async function signDrawn() {
    if (!sigRef.current) return;
    const dataUrl = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
    const res = await fetch(`/api/contracts/${params.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "drawn", data: dataUrl }),
    });
    if (res.ok) {
      const updated = await res.json();
      setContract(updated);
    }
  }

  async function signTyped() {
    if (!typedName.trim()) return;
    const res = await fetch(`/api/contracts/${params.id}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "typed", data: typedName.trim() }),
    });
    if (res.ok) {
      const updated = await res.json();
      setContract(updated);
    }
  }

  if (!contract) return <main>Loading...</main>;

  return (
    <main>
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-50 via-white to-pink-50 border shadow-lg rounded-2xl p-7 mb-7">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--brand)]">Contract with {contract.clientName}</h1>
            <button onClick={() => router.push("/contracts")} className="text-sm underline text-[var(--brand)] hover:opacity-75 transition">Back to list</button>
          </div>
          <p className="text-md text-gray-600 mb-4">
            {contract.eventDate?.slice(0, 10)} — {contract.eventVenue} — <span className="uppercase font-semibold text-[var(--brand)]">{contract.status}</span>
          </p>

          <section className="border rounded-xl bg-white p-5 mb-6 shadow">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold text-lg text-[var(--brand)]">Contract Content</h2>
              {contract.status === "draft" && editing ? (
                <div className="space-x-2">
                  <button onClick={saveEdits} className="text-sm underline text-[var(--brand)] hover:font-bold">Save</button>
                  <button onClick={() => { setEditing(false); setContentHtml(contract.contentHtml); setEditClientName(contract.clientName); setEditEventDate(contract.eventDate?.slice(0, 10)); setEditEventVenue(contract.eventVenue); setEditServicePackage(contract.servicePackage); }} className="text-sm underline hover:opacity-70">Cancel</button>
                </div>
              ) : (
                contract.status === "draft" && !editing && (
                  <button onClick={() => setEditing(true)} className="text-sm underline font-medium text-[var(--brand)] hover:opacity-70">Edit</button>
                )
              )}
            </div>
            {editing ? (
              <div className="space-y-4">
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={editClientName} onChange={e => setEditClientName(e.target.value)} placeholder="Client Name" />
                <input type="date" className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={editEventDate} min={new Date().toISOString().slice(0, 10)} onChange={e => setEditEventDate(e.target.value)} placeholder="Event Date" />
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={editEventVenue} onChange={e => setEditEventVenue(e.target.value)} placeholder="Event Venue" />
                <input className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={editServicePackage} onChange={e => setEditServicePackage(e.target.value)} placeholder="Service Package" />
                <textarea className="w-full border rounded-lg px-4 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={contentHtml.replace(/<[^>]+>/g, "")} onChange={e => setContentHtml(`<p>${e.target.value.replace(/\n/g, "</p><p>")}</p>`)} placeholder="Contract Content" />
                {editing && contract.status === "draft" && (
                  <button className="text-sm underline text-[var(--brand)] font-semibold hover:opacity-80 mb-2" onClick={async () => {
                    const res = await fetch("/api/ai/assist", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        vendorType: contract.vendorType,
                        clientName: editClientName,
                        eventDate: editEventDate,
                        eventVenue: editEventVenue,
                        servicePackage: editServicePackage,
                      }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setContentHtml(`<p>${data.text.replace(/\n/g, "</p><p>")}</p>`);
                    }
                  }}>AI Assist</button>
                )}
                <div className="space-x-2">
                  <button onClick={saveEdits} className="text-sm underline text-[var(--brand)] hover:font-bold">Save</button>
                  <button onClick={() => { setEditing(false); setContentHtml(contract.contentHtml); setEditClientName(contract.clientName); setEditEventDate(contract.eventDate?.slice(0, 10)); setEditEventVenue(contract.eventVenue); setEditServicePackage(contract.servicePackage); }} className="text-sm underline hover:opacity-70">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: contract.contentHtml || "<p>(empty)</p>" }} />
            )}
          </section>

          <section className="border rounded-xl bg-white p-5 shadow">
            <h2 className="font-semibold mb-2 text-[var(--brand)]">Signature</h2>
            {contract.status === "signed" ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Signed at {new Date(contract.signature?.signedAt).toLocaleString()}</p>
                {contract.signature?.type === "drawn" ? (
                  <img src={contract.signature?.data} alt="signature" className="border w-[280px] h-auto" />
                ) : (
                  <p className="font-[cursive] text-3xl text-gray-800">{contract.signature?.data}</p>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm mb-1 font-medium">Draw signature</p>
                  <SignatureCanvas ref={sigRef as any} penColor="black" canvasProps={{ className: "border w-full h-[200px] rounded shadow" }} />
                  <div className="mt-2 space-x-2">
                    <button onClick={() => sigRef.current?.clear()} className="text-sm underline hover:opacity-60">Clear</button>
                    <button onClick={signDrawn} className="text-sm underline text-[var(--brand)] font-semibold hover:opacity-80">Sign (drawn)</button>
                  </div>
                </div>
                <div>
                  <p className="text-sm mb-1 font-medium">Type name</p>
                  <input className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/30 shadow-sm font-medium" value={typedName} onChange={(e) => setTypedName(e.target.value)} placeholder="Your full name" />
                  <button onClick={signTyped} className="mt-2 text-sm underline text-[var(--brand)] font-semibold hover:opacity-80">Sign (typed)</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


