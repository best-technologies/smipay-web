"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="h-header w-full bg-brand-bg-primary text-white">
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between px-6">
        <div className="text-xl font-semibold">Smipay</div>
        <nav className="flex items-center gap-8 text-sm">
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
      </div>
    </header>
  );
}
