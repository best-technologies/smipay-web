"use client";

import { useState } from "react";
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
    id: "payments",
    label: "Payments/Purchase",
    icon: CreditCard,
    submenu: [
      // { id: "wallet-balance", label: "Wallet Balance", href: "/dashboard/wallet" },
      { id: "buy-airtime", label: "Buy Airtime", href: "/dashboard/airtime" },
      // { id: "buy-data", label: "Buy Data", href: "/dashboard/data" },
      // { id: "buy-bulk-data", label: "Buy Bulk Data", href: "/dashboard/bulk-data" },
      // { id: "buy-data-card", label: "Buy Data Card", href: "/dashboard/data-card" },
      // { id: "fetch-airtime-pin", label: "Fetch Airtime Pin", href: "/dashboard/airtime-pin" },
      // { id: "fund-wallet", label: "Fund Wallet", href: "/dashboard/fund-wallet" },
      // { id: "transactions", label: "Transactions", href: "/dashboard/transactions" },
    ],
  },
  // {
  //   id: "data-menu",
  //   label: "Data Menu",
  //   icon: BarChart3,
  //   submenu: [
  //     { id: "data-pricing", label: "Data Pricing", href: "/dashboard/data-pricing" },
  //     { id: "mtn-plans", label: "MTN Data Plans", href: "/dashboard/data-mtn" },
  //     { id: "glo-plans", label: "Glo Data Plans", href: "/dashboard/data-glo" },
  //     { id: "airtel-plans", label: "Airtel Data Plans", href: "/dashboard/data-airtel" },
  //     { id: "9mobile-plans", label: "9Mobile Data Plans", href: "/dashboard/data-9mobile" },
  //   ],
  // },
  // {
  //   id: "pay-bills",
  //   label: "Pay Bills",
  //   icon: Receipt,
  //   submenu: [
  //     { id: "dstv", label: "DSTV", href: "/dashboard/dstv" },
  //     { id: "gotv", label: "GOTV", href: "/dashboard/gotv" },
  //     { id: "startimes", label: "STARTIMES", href: "/dashboard/startimes" },
  //     { id: "waec", label: "WAEC PIN", href: "/dashboard/waec" },
  //     { id: "electricity", label: "ELECTRICITY", href: "/dashboard/electricity" },
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

// Active routes - Dashboard, Buy Airtime, and Profile
// When you need to enable a feature, uncomment it above and add its route here
const ENABLED_ROUTES = ["/dashboard", "/dashboard/airtime", "/dashboard/settings-profile"];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [openMenus, setOpenMenus] = useState<string[]>(["payments"]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const isRouteEnabled = (href: string) => ENABLED_ROUTES.includes(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* User Profile */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-brand-bg-primary text-white flex items-center justify-center text-lg font-bold relative">
            {user?.first_name?.[0]}{user?.last_name?.[0]}
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-brand-text-primary truncate">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-xs text-brand-text-secondary">
              Balance: <span className="font-semibold text-green-600">₦{user?.wallet?.current_balance?.toLocaleString() || "0.00"}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-brand-text-primary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {openMenus.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {openMenus.includes(item.id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => {
                          const enabled = isRouteEnabled(subitem.href);
                          return enabled ? (
                            <Link
                              key={subitem.id}
                              href={subitem.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                pathname === subitem.href
                                  ? "bg-brand-bg-primary/10 text-brand-bg-primary font-medium"
                                  : "text-brand-text-secondary hover:bg-gray-100 hover:text-brand-text-primary"
                              }`}
                            >
                              {subitem.label}
                            </Link>
                          ) : (
                            <div
                              key={subitem.id}
                              className="relative group"
                            >
                              <div className="block px-3 py-2 text-sm rounded-lg text-gray-400 cursor-not-allowed">
                                {subitem.label}
                              </div>
                              <div className="absolute left-full top-0 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
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
                        ? "bg-brand-bg-primary text-white font-medium"
                        : "text-brand-text-primary hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-400 cursor-not-allowed">
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="absolute left-0 top-0 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                      Coming Soon
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Other Menu */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-3">
            Other Menu
          </h3>
          <nav className="space-y-1">
            {otherMenuItems.map((item) => (
              <div key={item.id}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.id)}
                      className="w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-100 text-gray-400 cursor-not-allowed transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 text-gray-400" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {openMenus.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    {openMenus.includes(item.id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subitem) => (
                          <div
                            key={subitem.id}
                            className="relative group"
                          >
                            <div className="block px-3 py-2 text-sm rounded-lg text-gray-400 cursor-not-allowed">
                              {subitem.label}
                            </div>
                            <div className="absolute left-0 top-0 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
                              Coming Soon
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : item.href === "/" ? (
                  <Link
                    href={item.href!}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-brand-text-primary hover:bg-gray-100 transition-colors"
                  >
                    <item.icon className="h-5 w-5 text-gray-500" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ) : (
                  <div className="relative group">
                    <div className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg text-gray-400 cursor-not-allowed">
                      <item.icon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="absolute left-0 top-0 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 ml-2">
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
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-brand-text-primary" />
        ) : (
          <Menu className="h-6 w-6 text-brand-text-primary" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed top-0 left-0 w-64 bg-white border-r border-gray-200 h-screen z-40 transform transition-transform duration-300 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}

