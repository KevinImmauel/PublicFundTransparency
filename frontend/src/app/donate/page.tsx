"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import Chart from "chart.js/auto";

type Transaction = {
  timestamp: string;
  amountUSD: string;
};

export default function DonationPage() {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const contractAddress = "0xe068dE326f03080aaF82b10027F862c786B909Ed";

  const generateQR = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const amountEth = (form.elements.namedItem("donationAmount") as HTMLInputElement)?.value;
    const purpose = (form.elements.namedItem("donationPurpose") as HTMLInputElement)?.value;

    if (!amountEth || isNaN(Number(amountEth)) || parseFloat(amountEth) <= 0) {
      alert("Please enter a valid amount in ETH.");
      return;
    }

    const amountWeiHex = "0x" + (parseFloat(amountEth) * 1e18).toString(16).split(".")[0];
    const link = `https://metamask.app.link/send/${contractAddress}?value=${amountWeiHex}`;

    QRCode.toCanvas(document.getElementById("qrCanvas") as HTMLCanvasElement, link, { width: 256 }, function (err) {
      if (err) console.error(err);
    });
  };

  const fetchAndRenderChart = async () => {
    try {
      const res = await fetch("http://localhost:3000/transactions");
      const data: Transaction[] = await res.json();

      const lastTen = data.slice(-10).reverse();

      const labels = lastTen.map((tx) => {
        const date = new Date(tx.timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      });

      const values = lastTen.map((tx) => parseFloat(tx.amountUSD || "0"));

      const ctx = chartRef.current?.getContext("2d");
      if (!ctx) return;

      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "USD Donated",
              data: values,
              borderColor: "#22C55E",
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              tension: 0.3,
              fill: true,
              pointRadius: 4,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `USD Donated: $${context.raw.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: "#9CA3AF" },
            },
            x: {
              ticks: { color: "#9CA3AF" },
            },
          },
        },
      });
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    }
  };

  useEffect(() => {
    fetchAndRenderChart();
  }, []);

  return (
    <>
      <div className="bg-gray-100 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 p-6 mx-auto my-32 max-w-7xl">
        <h1 className="text-4xl font-bold mb-6">Donation Tracker</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Make a Donation</h2>
            <form id="donationForm" className="space-y-4" onSubmit={generateQR}>
              <input
                name="donationAmount"
                type="number"
                step="0.0001"
                placeholder="Amount in ETH"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <input
                name="donationPurpose"
                type="text"
                placeholder="Purpose"
                className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
              />
              <button
                type="submit"
                className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900"
              >
                Generate QR
              </button>
            </form>
            <div className="mt-6">
              <canvas id="qrCanvas" className="mx-auto"></canvas>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Donations (USD)</h2>
            <canvas ref={chartRef} width={300} height={200}></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
