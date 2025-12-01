import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Footer() {
  return (
    <footer className="mt-24 w-full bg-brand-text-primary text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div>
            <div className="text-xl font-semibold">Smipay</div>
            <div className="mt-6">
              <h3 className="text-lg">
                Be the first to get latest information about Smipay
              </h3>
              <form className="mt-4 flex max-w-lg items-center gap-3">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  className="h-12 border-white/30 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  className="h-12 bg-white text-brand-primary hover:bg-white/90"
                >
                  Submit
                </Button>
              </form>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 text-sm">
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
                Terms of service
              </Link>
              <Link href="#" className="block hover:opacity-90">
                Privacy policy
              </Link>
              <Link href="#" className="block hover:opacity-90">
                Cookies policy
              </Link>
            </div>
          </div>
        </div>
        <div className="my-10 h-px w-full bg-white/15" />
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-white/80">
          <div>© 2025 Smipay, subsidiary of Best Technologies Limited</div>
          <div className="flex items-center gap-6">
            <span>support@smipay.com</span>
            <span>+234 201 887 0061</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
