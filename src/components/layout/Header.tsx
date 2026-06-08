"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, Flag, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/issues", label: "Issues" },
  { href: "/trending", label: "Trending Australia" },
  { href: "/suggest", label: "Suggest Box" },
  { href: "/join", label: "Join Us" },
];

export function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy-deep/95 backdrop-blur-sm border-b border-white/10">
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🇦🇺</span>
            <span className="font-bold text-white text-lg tracking-tight">
              Nation<span className="text-gold">Lovers</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link",
                  pathname === link.href && "nav-link-active"
                )}
              >
                {link.label}
              </Link>
            ))}
            {session?.user?.role === "ADMIN" && (
              <Link
                href="/admin"
                className={cn("nav-link", pathname.startsWith("/admin") && "nav-link-active")}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center text-navy font-bold text-sm">
                    {session.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">
                    {session.user?.name}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => { signOut(); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-grey-dark hover:bg-grey-light transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-white/40 text-white hover:border-white hover:bg-white hover:text-navy">
                  Login
                </Button>
              </Link>
            )}
            <Link href="/report">
              <Button size="sm">
                🚨 Report Issue
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-navy border-t border-white/10 animate-slide-up">
          <nav className="container-wide py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "py-2 text-white/80 hover:text-gold transition-colors text-base font-medium",
                  pathname === link.href && "text-gold"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
              {session ? (
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-white/70 py-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" fullWidth className="border-white/40 text-white hover:bg-white hover:text-navy">
                    Login
                  </Button>
                </Link>
              )}
              <Link href="/report" onClick={() => setMobileOpen(false)}>
                <Button fullWidth>🚨 Report Issue</Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
