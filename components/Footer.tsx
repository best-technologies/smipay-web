import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
  return (
    <footer className="mt-10 sm:mt-16 md:mt-24 w-full bg-brand-text-primary text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12 lg:grid-cols-2">
          <div>
            <div className="text-lg sm:text-xl font-semibold">Smipay</div>
            <div className="mt-4 sm:mt-6">
              <h3 className="text-sm sm:text-base md:text-lg">
                Be the first to get latest information <br className="hidden sm:block" /> about Smipay
              </h3>
              <form className="mt-3 sm:mt-4 max-w-lg relative">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="h-10 sm:h-12 pr-20 sm:pr-28 text-sm border-white bg-white! text-brand-text-primary placeholder:text-brand-text-primary focus-visible:border-white focus-visible:ring-0 w-full rounded-sm"
                />
                <Button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 sm:h-10 bg-brand-text-primary text-white hover:bg-brand-text-primary/90 px-3 sm:px-6 text-xs sm:text-sm rounded-sm"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>

          {/* Desktop: 3 columns */}
          <div className="hidden md:grid grid-cols-3 gap-6 text-sm">
            <div className="space-y-3">
              <Link href="#" className="block hover:opacity-90">
                Home
              </Link>
              <Link href="#" className="block hover:opacity-90">
                Services
              </Link>
              <Link href="#" className="block hover:opacity-90">
                About us
              </Link>
              <Link href="#" className="block hover:opacity-90">
                Support
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="#" className="block hover:opacity-90">
                support@smipay.com
              </Link>
              <Link href="#" className="block hover:opacity-90">
                +234 201 887 0061
              </Link>
            </div>
            <div className="space-y-3">
              <Link href="/terms" className="block hover:opacity-90">
                Terms of service
              </Link>
              <Link href="/privacy" className="block hover:opacity-90">
                Privacy policy
              </Link>
              <Link href="/cookies" className="block hover:opacity-90">
                Cookies policy
              </Link>
            </div>
          </div>

          {/* Mobile: 2 columns layout */}
          <div className="md:hidden mt-2 sm:mt-4">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm mb-8 sm:mb-12">
              <div className="space-y-2 sm:space-y-3">
                <Link href="#" className="block hover:opacity-90">
                  Home
                </Link>
                <Link href="#" className="block hover:opacity-90">
                  Services
                </Link>
                <Link href="#" className="block hover:opacity-90">
                  About us
                </Link>
                <Link href="#" className="block hover:opacity-90">
                  Support
                </Link>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <Link href="#" className="block hover:opacity-90 break-all">
                  support@smipay.com
                </Link>
                <Link href="#" className="block hover:opacity-90">
                  +234 201 887 0061
                </Link>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm">
              <Link href="/terms" className="hover:opacity-90">
                Terms of service
              </Link>
              <Link href="/privacy" className="hover:opacity-90">
                Privacy policy
              </Link>
              <Link href="/cookies" className="hover:opacity-90">
                Cookies policy
              </Link>
            </div>
          </div>
        </div>
        <div className="my-6 sm:my-8 md:my-10 h-px w-full bg-white/15" />
        <div className="text-[10px] sm:text-xs text-white/80 text-center">
          © 2025 Smipay, subsidiary of Best Technologies Limited
        </div>
      </div>
    </footer>
  );
}
