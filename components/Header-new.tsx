"use client";

import Link from "next/link";
import { ChevronDown, Menu, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "./ui/button";

export default function HeaderNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  const handleSignOut = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <header className="w-full bg-brand-bg-primary text-white">
      <div className="mx-auto flex h-header max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg sm:text-xl font-semibold hover:opacity-90">
          Smipay
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 text-sm lg:flex">
          <nav className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-90">
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
              </div>
            </div>
            <Link href="#" className="hover:opacity-90">
              About Us
            </Link>
            <Link href="#" className="hover:opacity-90">
              Support
            </Link>
          </nav>

          {/* Auth Buttons / User Menu */}
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:opacity-90 py-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{user.first_name}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                  <div className="invisible absolute right-0 top-full z-20 mt-3 w-48 rounded-md bg-white p-2 text-black opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100">
                    <Link
                      href="/dashboard"
                      className="block rounded px-3 py-2 hover:bg-zinc-100"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block rounded px-3 py-2 hover:bg-zinc-100"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block rounded px-3 py-2 hover:bg-zinc-100"
                    >
                      Settings
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 w-full rounded px-3 py-2 hover:bg-zinc-100 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-white hover:bg-white/10"
                  >
                    <Link href="/auth/signin">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-white text-brand-bg-primary hover:bg-white/90"
                  >
                    <Link href="/auth/register">Register</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

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
        <div className="bg-brand-bg-primary border-t border-white/10 lg:hidden">
          <nav className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-3 sm:gap-4 text-xs sm:text-sm">
            {/* Mobile Auth Section - at the top */}
            {!isLoading && (
              <>
                {isAuthenticated && user ? (
                  <div className="pb-3 border-b border-white/10 space-y-2">
                    <div className="flex items-center gap-2 py-2">
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                      <span className="font-medium">
                        {user.first_name} {user.last_name}
                      </span>
                    </div>
                    <Link
                      href="/dashboard"
                      className="block py-2 hover:opacity-90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block py-2 hover:opacity-90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block py-2 hover:opacity-90"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 py-2 hover:opacity-90 text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="pb-3 border-b border-white/10 flex items-center gap-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="flex-1 text-white hover:bg-white/10"
                    >
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className="flex-1 bg-white text-brand-bg-primary hover:bg-white/90"
                    >
                      <Link
                        href="/auth/register"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </Button>
                  </div>
                )}
              </>
            )}

            <Link
              href="/"
              className="hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <div>
              <button
                className="flex items-center gap-2 hover:opacity-90 w-full"
                onClick={() => setIsServicesOpen(!isServicesOpen)}
              >
                <span>Services</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 flex flex-col gap-2">
                  <Link
                    href="#"
                    className="block py-2 hover:opacity-90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Airtime & Data
                  </Link>
                  <Link
                    href="#"
                    className="block py-2 hover:opacity-90"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Bills Payment
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="#"
              className="hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="#"
              className="hover:opacity-90"
              onClick={() => setIsMenuOpen(false)}
            >
              Support
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

