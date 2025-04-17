"use client";

import { cn } from "@/lib/utils";

export default function MagicButton({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl hover:scale-105 transition-all shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
