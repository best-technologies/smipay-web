"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="h-header w-full bg-brand-bg-primary text-white">
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between px-6">
        <div className="text-xl font-semibold">Smipay</div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 text-sm lg:flex">
          <Link href="#" className="hover:opacity-90">
            Home
          </Link>
          <div className="group relative">
            <button className="flex items-center gap-2 hover:opacity-90">
              <span>Services</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="invisible absolute left-0 top-full z-20 mt-3 w-48 rounded-md bg-white p-2 text-black opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
              <Link
                href="#"
                className="block rounded px-3 py-2 hover:bg-zinc-100"
              >
                Airtime & Data
              </Link>
              <Link
                href="#"
                className="block rounded px-3 py-2 hover:bg-zinc-100"
              >
                Bills Payment
              </Link>
              <Link
                href="#"
                className="block rounded px-3 py-2 hover:bg-zinc-100"
              >
                Gift Cards
              </Link>
            </div>
          </div>
          <Link href="#" className="hover:opacity-90">
            About Us
          </Link>
          <Link href="#" className="hover:opacity-90">
            Support
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="bg-brand-bg-primary px-6 pb-6 lg:hidden">
          <nav className="flex flex-col gap-4 text-sm">
            <Link href="#" className="hover:opacity-90">
              Home
            </Link>
            <Link href="#" className="hover:opacity-90">
              Services
            </Link>
            <Link href="#" className="hover:opacity-90">
              About Us
            </Link>
            <Link href="#" className="hover:opacity-90">
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
