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

import { motion } from "motion/react";
import HeroSectionOne from "@/components/hero-section-demo-1";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import Footer from "@/components/Footer";

import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Dashboard", link: "/dashboard" },
    { name: "Donate", link: "/donate" },
    { name: "Track Funds", link: "/dashboard" },
    { name: "Contact", link: "#contact" },
  ];

  return (
    <>
      <Navbar>
        <NavBody visible>
          <NavbarLogo />
          <NavItems items={navItems} />
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

      <HeroSectionOne />
      
      <HeroHighlight id="hero">
        <h1 className="text-5xl font-bold text-center text-gray-800 dark:text-white">
          Empowering Transparency with <Highlight>FundView</Highlight>
        </h1>
        <p className="text-center text-lg mt-4 text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
          Track public fund allocations, ensure donor transparency, and build trust through blockchain technology.
        </p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => window.location.href = "/donate"}
            className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Donate Now
          </button>
          <button
            onClick={() => window.location.href = "#contact"}
            className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
      </HeroHighlight>
      <Footer />
    </>
  );
}
