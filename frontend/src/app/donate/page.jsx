"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui/resizable-navbar";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import Chart from "chart.js/auto";
import Footer from "@/components/Footer";

export default function DonationPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Donate", link: "/donation" },
    { name: "Contact", link: "#contact-us" },
  ];

  const contractAddress = "0xe068dE326f03080aaF82b10027F862c786B909Ed";

  const generateQR = async (event) => {
    event.preventDefault();
    const amountEth = event.target.donationAmount.value;
    const purpose = event.target.donationPurpose.value;

    if (!amountEth || isNaN(amountEth) || parseFloat(amountEth) <= 0) {
      alert("Please enter a valid amount in ETH.");
      return;
    }

    const amountWeiHex = "0x" + (parseFloat(amountEth) * 1e18).toString(16).split(".")[0];
    const link = `https://metamask.app.link/send/${contractAddress}?value=${amountWeiHex}`;

    QRCode.toCanvas(document.getElementById("qrCanvas"), link, { width: 256 }, function (err) {
      if (err) console.error(err);
    });
  };

  const fetchAndRenderChart = async () => {
    try {
      const res = await fetch("http://localhost:3000/transactions");
      const data = await res.json();

      const lastTen = data.slice(-10).reverse();

      const labels = lastTen.map((tx) => {
        const date = new Date(tx.timestamp);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      });

      const values = lastTen.map((tx) => parseFloat(tx.amountUSD || 0));

      const ctx = chartRef.current.getContext("2d");
      if (chartInstance.current) chartInstance.current.destroy();

      chartInstance.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
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
            legend: {
              display: false,
            },
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
              ticks: {
                color: "#9CA3AF",
              },
            },
            x: {
              ticks: {
                color: "#9CA3AF",
              },
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
      <Navbar>
        <NavBody visible>
          <NavbarLogo />
          <NavItems items={navItems} />
          <NavbarButton href="/donate">Get Started</NavbarButton>
        </NavBody>

        {/* Mobile View */}
        <MobileNav visible>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle isOpen={menuOpen} onClick={() => setMenuOpen(!menuOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a key={idx} href={item.link} onClick={() => setMenuOpen(false)}>
                {item.name}
              </a>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Donation Tracker</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Donate Form */}
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
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Generate QR
              </button>
            </form>
            <div className="mt-6">
              <canvas id="qrCanvas" className="mx-auto"></canvas>
            </div>
          </div>

          {/* Recent Donations Graph */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Donations (USD)</h2>
            <canvas ref={chartRef} width="300" height="200"></canvas>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
