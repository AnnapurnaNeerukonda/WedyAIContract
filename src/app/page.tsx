"use client";
import { useEffect, useState } from "react";

const cards = [
  {
    title: "Stunning Venues",
    image: "/images/venue.jpg",
    description: "Find the most stunning wedding venues across the country."
  },
  {
    title: "Expert Vendors",
    image: "/images/vendor.jpeg",
    description: "Choose from our curated list of top-notch vendors for your dream wedding."
  },
  {
    title: "Stress-Free Planning",
    image: "/images/planning.jpg",
    description: "Work with your dedicated Wedy planner for a seamless experience."
  },
  {
    title: "Transparent Pricing",
    image: "/images/price.png",
    description: "No hidden costs. Accurate price transparency for every package."
  }
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    fetch("/api/contracts", { method: "GET" })
      .then((res) => setLoggedIn(res.status !== 401))
      .catch(() => setLoggedIn(false));
  }, []);

  return (
    <main>
      <section className="rounded-2xl p-10 bg-gradient-to-br from-pink-100 via-white to-yellow-50 border shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--brand)] mb-2">AI‑assisted Wedding Contracts</h1>
            <p className="text-lg text-gray-700 mb-4">Create, customize and sign beautiful contracts in minutes.</p>
            <div className="mb-4 space-y-1">
              <p className="text-md text-gray-600">Your One Stop Wedding Shop 💍</p>
            </div>
            <div className="mt-6 space-x-3">
              {loggedIn ? (
                <a href="/contracts" className="inline-block bg-[var(--brand)] text-white px-5 py-2.5 rounded-md shadow-sm hover:opacity-95">
                  Go to Contracts
                </a>
              ) : (
                <a href="/login" className="inline-block px-5 py-2.5 rounded-md border hover:bg-white/50">
                  Login
                </a>
              )}
            </div>
            {loggedIn && (
              <form
                className="mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/login";
                }}
              >
                <button className="text-sm underline">Logout</button>
              </form>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
            {cards.map((card, idx) => (
              <div key={card.title} className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border hover:shadow-lg transition">
                <img src={card.image} alt={card.title} className="w-32 h-32 mb-3 object-cover rounded border-2 border-[var(--brand)] shadow" onError={(e) => { e.currentTarget.src = '/vercel.svg'; }} />
                <h2 className="text-xl font-semibold text-[var(--brand)] mb-1">{card.title}</h2>
                <p className="text-gray-600 text-sm">{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
