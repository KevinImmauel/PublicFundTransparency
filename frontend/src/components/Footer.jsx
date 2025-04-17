"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      id="contact"
      className={cn(
        "bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 mt-12"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">FundView</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Empowering transparency in public fund tracking. Built with ❤️ at Innovatex.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/donation">Donate</Link></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Connect</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Email: <a href="mailto:support@fundview.org" className="text-blue-500">support@fundview.org</a>
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-blue-500 transition">Twitter</Link>
              <Link href="#" className="hover:text-blue-500 transition">GitHub</Link>
              <Link href="#" className="hover:text-blue-500 transition">LinkedIn</Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500 dark:text-gray-600">
          &copy; {new Date().getFullYear()} FundView. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
