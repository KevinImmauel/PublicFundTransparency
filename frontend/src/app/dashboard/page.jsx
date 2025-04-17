"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import Footer from "@/components/Footer";

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

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Donate", link: "/donate" },
    { name: "Contact", link: "#contact" },
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("http://localhost:3000/transactions");
      const data = await res.json();
      setTransactions(data);
      renderCharts(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  const renderCharts = (data) => {
    const dates = data.map((tx) => new Date(tx.timestamp).toLocaleDateString());
    const usdAmounts = data.map((tx) => parseFloat(tx.amountUSD));
    const dailyFreq = {};

    data.forEach((tx) => {
      const date = new Date(tx.timestamp).toLocaleDateString();
      dailyFreq[date] = (dailyFreq[date] || 0) + 1;
    });

    const freqLabels = Object.keys(dailyFreq);
    const freqData = Object.values(dailyFreq);

    Chart.getChart("usdDonatedChart")?.destroy();
    Chart.getChart("transactionFrequencyChart")?.destroy();
    Chart.getChart("balanceOverTimeChart")?.destroy();

    new Chart(document.getElementById("usdDonatedChart"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "USD Donated",
            data: usdAmounts,
            fill: true,
            borderColor: "#4F46E5",
            backgroundColor: "rgba(99, 102, 241, 0.1)",
          },
        ],
      },
    });

    new Chart(document.getElementById("transactionFrequencyChart"), {
      type: "bar",
      data: {
        labels: freqLabels,
        datasets: [
          {
            label: "Transactions per Day",
            data: freqData,
            backgroundColor: "#4F46E5",
          },
        ],
      },
    });

    new Chart(document.getElementById("balanceOverTimeChart"), {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Total Donated (USD)",
            data: usdAmounts.reduce((acc, curr, idx) => {
              acc.push((acc[idx - 1] || 0) + curr);
              return acc;
            }, []),
            fill: true,
            borderColor: "#34D399",
            backgroundColor: "rgba(56, 189, 248, 0.1)",
          },
        ],
      },
    });
  };

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

      <div className="top-0 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-6 py-10">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

        <div className="overflow-x-auto mb-10 rounded shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <thead>
              <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">ETH</th>
                <th className="px-4 py-3">USD</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx, idx) => (
                <tr key={idx} className="text-gray-800 dark:text-gray-100">
                  <td className="px-4 py-2">{tx.user}</td>
                  <td className="px-4 py-2">{tx.amountETH}</td>
                  <td className="px-4 py-2">${tx.amountUSD}</td>
                  <td className="px-4 py-2">{tx.purpose}</td>
                  <td className="px-4 py-2">{tx.type}</td>
                  <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-center">USD Donated</h2>
            <canvas id="usdDonatedChart" height="200"></canvas>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-center">Transactions/Day</h2>
            <canvas id="transactionFrequencyChart" height="200"></canvas>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-2 text-center">Balance Over Time (USD)</h2>
            <canvas id="balanceOverTimeChart" height="200"></canvas>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
