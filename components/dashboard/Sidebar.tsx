"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Globe,
  CreditCard,
  Wallet,
  Smartphone,
  Zap,
  Database,
  MessageSquare,
  Receipt,
  Tv,
  FileText,
  ArrowLeftRight,
  BarChart3,
  Users,
  Settings,
  User,
  FileCode,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Phone,
  Wifi,
  Satellite,
  Monitor,
  GraduationCap,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href?: string;
  submenu?: {
    id: string;
    label: string;
    href: string;
    icon?: any;
  }[];
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "vtu",
    label: "VTU",
    icon: Phone,
    submenu: [
      { id: "buy-airtime", label: "Buy Airtime", href: "/dashboard/airtime", icon: Smartphone },
      { id: "buy-data", label: "Buy Data", href: "/dashboard/data", icon: Wifi },
    ],
  },
  {
    id: "cable-tv",
    label: "Cable TV",
    icon: Tv,
    submenu: [
      { id: "dstv", label: "DSTV", href: "/dashboard/cabletv?provider=dstv", icon: Satellite },
      { id: "gotv", label: "GOTV", href: "/dashboard/cabletv?provider=gotv", icon: Monitor },
      { id: "startimes", label: "STARTIMES", href: "/dashboard/cabletv?provider=startimes", icon: Tv },
      { id: "showmax", label: "SHOWMAX", href: "/dashboard/cabletv?provider=showmax", icon: Monitor },
    ],
  },
  {
    id: "education",
    label: "Education",
    icon: GraduationCap,
    href: "/dashboard/education",
  },
  // {
  //   id: "pay-bills",
  //   label: "Pay Bills",
  //   icon: Receipt,
  //   submenu: [
  //     { id: "electricity", label: "Electricity", href: "/dashboard/electricity", icon: Zap },
  //     { id: "waec", label: "WAEC PIN", href: "/dashboard/waec", icon: FileText },
  //   ],
  // },
  // {
  //   id: "refer",
  //   label: "Refer and Earn",
  //   icon: Users,
  //   href: "/dashboard/referrals",
  // },
];

const otherMenuItems: MenuItem[] = [
  {
    id: "account-settings",
    label: "Account Settings",
    icon: Settings,
    submenu: [
      // { id: "api-settings", label: "Api Settings", href: "/dashboard/settings-api" },
      { id: "profile", label: "Profile", href: "/dashboard/settings-profile" },
      // { id: "update-profile", label: "Update Profile", href: "/dashboard/settings-update" },
      // { id: "compliance", label: "Compliance", href: "/dashboard/settings-compliance" },
      // { id: "change-pin", label: "Change Pin", href: "/dashboard/settings-pin" },
    ],
  },
  {
    id: "website-services",
    label: "Website Services",
    icon: Globe,
    href: "/",
  },
  // {
  //   id: "api-docs",
  //   label: "API Documentation",
  //   icon: FileCode,
  //   href: "/dashboard/api-docs",
  // },
  // {
  //   id: "whatsapp",
  //   label: "Join Whatsapp Group",
  //   icon: MessageSquare,
  //   href: "https://wa.me/",
  // },
];

// Active routes - Dashboard, VTU (Airtime, Data), Cable TV, Education, and Profile
// When you need to enable a feature, uncomment it above and add its route here
const ENABLED_ROUTES = [
  "/dashboard",
  "/dashboard/airtime",
  "/dashboard/data",
  "/dashboard/cabletv",
  "/dashboard/education",
  "/dashboard/settings-profile",
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  // By default, only keep VTU expanded; others collapsed
  const [openMenus, setOpenMenus] = useState<string[]>(["vtu"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open so the dashboard behind doesn’t scroll
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMobileMenuOpen]);

  const toggleMenu = (menuId: string) => {
    setOpenMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const isRouteEnabled = (href: string) => {
    // Treat all Cable TV subtabs as enabled via the base /dashboard/cabletv route
    if (href.startsWith("/dashboard/cabletv")) {
      return ENABLED_ROUTES.includes("/dashboard/cabletv");
    }
    // Treat all Education subtabs as enabled via the base /dashboard/education route
    if (href.startsWith("/dashboard/education")) {
      return ENABLED_ROUTES.includes("/dashboard/education");
    }
    return ENABLED_ROUTES.includes(href);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Mobile: in-panel header with close button */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-dashboard-border bg-dashboard-surface">
        <span className="text-sm font-semibold text-dashboard-heading">Menu</span>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 -m-2 rounded-lg hover:bg-dashboard-bg text-dashboard-muted hover:text-dashboard-heading transition-colors"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 bg-dashboard-surface border-b border-dashboard-border">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-lg font-semibold relative">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-emerald-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-dashboard-heading truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-dashboard-muted">
              Balance: <span className="font-semibold text-emerald-600">₦{user?.wallet?.current_balance?.toLocaleString() || "0.00"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu - Scrollable; min-h-0 lets this flex item shrink so overflow works */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-dashboard-bg text-dashboard-heading transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-dashboard-muted" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {openMenus.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4 text-dashboard-muted" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-dashboard-muted" />
                      )}
                    </button>
                    {openMenus.includes(item.id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => {
                          const enabled = isRouteEnabled(subitem.href);
                          const SubIcon = subitem.icon;
                          return enabled ? (
                            <Link
                              key={subitem.id}
                              href={subitem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === subitem.href
                                  ? "bg-slate-100 text-dashboard-heading font-medium"
                                  : "text-dashboard-muted hover:bg-dashboard-bg hover:text-dashboard-heading"
                              }`}
                            >
                              {SubIcon && <SubIcon className="h-4 w-4" />}
                              <span>{subitem.label}</span>
                            </Link>
                          ) : (
                            <div
                              key={subitem.id}
                              className="relative group"
                            >
                              <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-dashboard-muted cursor-not-allowed">
                                {SubIcon && <SubIcon className="h-4 w-4" />}
                                <span>{subitem.label}</span>
                              </div>
                              <div className="absolute left-full top-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                                Coming Soon
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : isRouteEnabled(item.href!) ? (
                  <Link
                    href={item.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                      pathname === item.href
                        ? "bg-dashboard-heading text-white font-medium"
                        : "text-dashboard-heading hover:bg-dashboard-bg"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-dashboard-muted cursor-not-allowed">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="absolute left-0 top-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                      Coming Soon
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* Other Menu - Pinned to Bottom; shrink-0 keeps it visible */}
      <div className="flex-shrink-0 p-4 border-t border-dashboard-border bg-dashboard-surface">
        <h3 className="text-xs font-semibold text-dashboard-muted uppercase tracking-wider mb-3">
          Other Menu
        </h3>
        <nav className="space-y-1">
          {otherMenuItems.map((item) => (
            <div key={item.id}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-dashboard-bg text-dashboard-heading transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-dashboard-muted" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {openMenus.includes(item.id) ? (
                      <ChevronDown className="h-4 w-4 text-dashboard-muted" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-dashboard-muted" />
                    )}
                  </button>
                  {openMenus.includes(item.id) && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subitem) => {
                        const enabled = isRouteEnabled(subitem.href);
                        const SubIcon = subitem.icon;
                        return enabled ? (
                          <Link
                            key={subitem.id}
                            href={subitem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                              pathname === subitem.href
                                ? "bg-slate-100 text-dashboard-heading font-medium"
                                : "text-dashboard-muted hover:bg-dashboard-bg hover:text-dashboard-heading"
                            }`}
                          >
                            {SubIcon && <SubIcon className="h-4 w-4" />}
                            <span>{subitem.label}</span>
                          </Link>
                        ) : (
                          <div
                            key={subitem.id}
                            className="relative group"
                          >
                            <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg text-dashboard-muted cursor-not-allowed">
                              {SubIcon && <SubIcon className="h-4 w-4" />}
                              <span>{subitem.label}</span>
                            </div>
                            <div className="absolute left-full top-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                              Coming Soon
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : item.href === "/" ? (
                <Link
                  href={item.href!}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-dashboard-heading hover:bg-dashboard-bg transition-colors"
                >
                  <item.icon className="h-5 w-5 text-dashboard-muted" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <div className="relative group">
                  <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-dashboard-muted cursor-not-allowed">
                    <item.icon className="h-5 w-5 text-dashboard-muted" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  <div className="absolute left-0 top-0 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                    Coming Soon
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button – top-right on mobile (replaces Fund Wallet in header) */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2.5 bg-dashboard-surface rounded-lg shadow-md border border-dashboard-border touch-manipulation"
        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-dashboard-heading" />
        ) : (
          <Menu className="h-6 w-6 text-dashboard-heading" />
        )}
      </button>

      {/* Mobile Overlay – covers entire screen behind sidebar; tap to close; prevent scroll pass-through */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-[45] touch-none"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-dashboard-surface border-r border-dashboard-border h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar – solid opaque background; full viewport height, content scrolls inside; overflow-y-auto so only this panel scrolls */}
      <aside
        className={`lg:hidden fixed top-0 left-0 w-[min(288px,85vw)] max-w-full h-dvh max-h-screen z-50 transform transition-transform duration-300 ease-out overscroll-contain ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div
          className="h-full min-h-0 w-full border-r border-slate-200 flex flex-col overflow-hidden overscroll-contain"
          style={{ backgroundColor: "#ffffff" }}
        >
          <SidebarContent />
        </div>
      </aside>
    </>
  );
}

