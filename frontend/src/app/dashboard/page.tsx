"use client";

import { useEffect, useState } from "react";
import Chart from "chart.js/auto";

type Transaction = {
    user: string;
    amountETH: string;
    amountUSD: string;
    purpose: string;
    type: string;
    timestamp: string;
};

export default function DashboardPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch("http://localhost:3000/transactions");
            const data: Transaction[] = await res.json();
            setTransactions(data);
            renderCharts(data);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        }
    };

    const renderCharts = (data: Transaction[]) => {
        const dates = data.map((tx) => new Date(tx.timestamp).toLocaleDateString());
        const usdAmounts = data.map((tx) => parseFloat(tx.amountUSD));
        const dailyFreq: { [key: string]: number } = {};

        data.forEach((tx) => {
            const date = new Date(tx.timestamp).toLocaleDateString();
            dailyFreq[date] = (dailyFreq[date] || 0) + 1;
        });

        const freqLabels = Object.keys(dailyFreq);
        const freqData = Object.values(dailyFreq);

        Chart.getChart("usdDonatedChart")?.destroy();
        Chart.getChart("transactionFrequencyChart")?.destroy();
        Chart.getChart("balanceOverTimeChart")?.destroy();

        const usdCtx = document.getElementById("usdDonatedChart") as HTMLCanvasElement | null;
        const freqCtx = document.getElementById("transactionFrequencyChart") as HTMLCanvasElement | null;
        const balanceCtx = document.getElementById("balanceOverTimeChart") as HTMLCanvasElement | null;

        if (usdCtx) {
            new Chart(usdCtx, {
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
        }

        if (freqCtx) {
            new Chart(freqCtx, {
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
        }

        if (balanceCtx) {
            const cumulative = usdAmounts.reduce((acc: number[], curr, idx) => {
                acc.push((acc[idx - 1] || 0) + curr);
                return acc;
            }, []);

            new Chart(balanceCtx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [
                        {
                            label: "Total Donated (USD)",
                            data: cumulative,
                            fill: true,
                            borderColor: "#34D399",
                            backgroundColor: "rgba(56, 189, 248, 0.1)",
                        },
                    ],
                },
            });
        }
    };

    return (
        <div className="top-0 bg-gray-100 dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 mx-auto my-32 max-w-7xl">
            <h1 className="text-4xl font-bold mb-8 text-indigo-600 dark:text-indigo-400">Dashboard</h1>
            <div className="overflow-x-auto mb-10 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
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
                            <tr key={idx} className="text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-3 text-indigo-600 dark:text-indigo-400 text-center">
                        USD Donated
                    </h2>
                    <canvas id="usdDonatedChart" height="200"></canvas>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-3 text-pink-600 dark:text-pink-400 text-center">
                        Transactions/Day
                    </h2>
                    <canvas id="transactionFrequencyChart" height="200"></canvas>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-3 text-green-600 dark:text-green-400 text-center">
                        Balance Over Time (USD)
                    </h2>
                    <canvas id="balanceOverTimeChart" height="200"></canvas>
                </div>
            </div>
        </div>
    );
}

