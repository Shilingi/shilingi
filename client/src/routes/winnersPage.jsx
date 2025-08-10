import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link";
import { Helmet } from "react-helmet";

const Winners = () => {
  const [winners, setWinners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("https://shilingiapi.vercel.app/winner");
        const data = await res.json();
        // normalize the response into an array of winners
        if (!mounted) return;

        if (data && data.success) {
          let arr = [];

          if (Array.isArray(data.winners) && data.winners.length) {
            arr = data.winners;
          } else if (Array.isArray(data)) {
            arr = data;
          } else if (data.winner) {
            arr = Array.isArray(data.winner) ? data.winner : [data.winner];
          } else if (data.winners) {
            arr = Array.isArray(data.winners) ? data.winners : [data.winners];
          }

          // make sure it's an array
          arr = Array.isArray(arr) ? arr : [];

          // sort newest first by winDate or createdAt
          arr.sort((a, b) => new Date(b.winDate || b.createdAt) - new Date(a.winDate || a.createdAt));

          setWinners(arr);
        } else {
          setWinners([]); // explicit empty if API says success:false
        }
      } catch (err) {
        // silent fail per your request — keep console for debugging
        console.error("Winners fetch failed:", err);
        setWinners([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <Helmet>
        <title>Shilingi: Every Shilling Counts - Winner</title>
        <meta name="description" content="Shilingi winners" />
      </Helmet>

      <div
        style={{ zIndex: 100004 }}
        className="md:px-[5%] bg-[var(--bg)] px-4 sticky top-0 justify-between flex py-4 flex-row text-xs"
      >
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/"><p className="text-[#f2f2f2] hover:text-[#f36dff] transition cursor-pointer">Home</p></Link>
          <Link href="/terms"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Terms</p></Link>
          <Link href="/about"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">About</p></Link>
        </div>
        <div className="gap-2 md:gap-6 flex flex-row">
          <Link href="/help"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Participate</p></Link>
          <Link href="/help"><p className="text-[var(--softTextColori)] hover:text-[#f36dff] transition cursor-pointer">Help</p></Link>
        </div>
      </div>

      <Navbar />

      <div className="text-[var(--softTextColor)] bg-[var(--bg)] space-y-6 max-w-[1100px] mx-auto mt-8 md:mt-[50px] mb-8 md:mb-[40px] px-4 md:px-[80px]">
        <h1 className="text-3xl font-bold mb-4">🎉 Winner Announcement</h1>

        {loading ? (
          <p>Loading winner information...</p>
        ) : winners.length > 0 ? (
          <ul className="space-y-4">
            {winners.map((w) => (
              <li key={w._id || w.entryId || Math.random()}>
                <div className="bg-[#141414] border border-gray-700 p-6 rounded-xl shadow-md space-y-4">
                  <h2 className="text-xl font-semibold text-green-400">🏆 Cycle {w.cycle} Winner</h2>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {w.name}</p>
                    <p><strong>Phone:</strong> {w.phone}</p>
                    <p><strong>Amount Sent:</strong> {w.amount} KES</p>
                    <p><strong>MPESA Receipt:</strong> {w.mpesaReceiptNumber || "N/A"}</p>
                    <p><strong>Transaction ID:</strong> {w.transactionId || "N/A"}</p>
                    <p><strong>Date Won:</strong> {w.winDate ? new Date(w.winDate).toLocaleString() : (w.createdAt ? new Date(w.createdAt).toLocaleString() : "N/A")}</p>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p><strong>🔐 Public Random Seed:</strong></p>
                    <code className="block break-words text-xs text-pink-400 mt-1">{w.publicRandomSeed || "N/A"}</code>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-red-500">No winners yet.</p>
        )}

        <div className="mt-10 space-y-4 text-sm text-gray-300">
          <h3 className="text-lg font-semibold text-white">🔍 How the Winner is Selected?</h3>
          <p>
            Once exactly <strong>1,000,000 KES</strong> has been received, the system selects a winner automatically using a public seed and deterministic process.
          </p>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Winners;
