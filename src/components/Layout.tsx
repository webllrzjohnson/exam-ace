"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ClipboardList, Trophy, User, Menu, X, Shield, Layers, LogIn, UserPlus, Lock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { getUserTier, canAccessFeature } from "@/lib/access-control";
import { TierBadge } from "@/components/paywall/tier-badge";
import { PremiumPromoBanner } from "@/components/paywall/premium-promo-banner";
import { AccessibilityWidget } from "@/components/accessibility/accessibility-widget";

async function handleSignOut() {
  await signOut({ redirect: false });
  window.location.href = "/";
}

const baseNavItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/quizzes", label: "Quiz Catalog", icon: LayoutGrid },
  { to: "/flashcards", label: "Flashcards", icon: Layers },
  { to: "/simulation", label: "Simulation", icon: ClipboardList },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tier = getUserTier(session);
  const isPremium = tier === "premium";
  const canAccessFlashcards = canAccessFeature(tier, "canAccessFlashcards");
  const canAccessSimulations = canAccessFeature(tier, "canAccessSimulations");
  const canAccessLeaderboard = canAccessFeature(tier, "canAccessLeaderboard");
  const canAccessDashboard = canAccessFeature(tier, "canAccessDashboard");
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl">🍁</span>
            <span className="font-display font-bold text-lg text-foreground">
              Canadian<span className="text-primary">Citizenship</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 md:gap-4">
            <Link
              href="/"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Home className="w-4 h-4" />
              Home
            </Link>
            <Link
              href="/quizzes"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                pathname === "/quizzes" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              Quiz Catalog
            </Link>
            {canAccessFlashcards ? (
              <Link
                href="/flashcards"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname === "/flashcards" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Layers className="w-4 h-4" />
                Flashcards
              </Link>
            ) : (
              <div className="relative group">
                <Link
                  href="/upgrade"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200"
                >
                  <Layers className="w-4 h-4" />
                  Flashcards
                  <Lock className="w-3 h-3" />
                </Link>
              </div>
            )}
            {canAccessSimulations ? (
              <Link
                href="/simulation"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname === "/simulation" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                Simulation
              </Link>
            ) : (
              <div className="relative group">
                <Link
                  href="/upgrade"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200"
                >
                  <ClipboardList className="w-4 h-4" />
                  Simulation
                  <Lock className="w-3 h-3" />
                </Link>
              </div>
            )}
            {isAuthenticated ? (
              <Link
                href="/leaderboard"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname === "/leaderboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Trophy className="w-4 h-4" />
                Leaderboard
              </Link>
            ) : (
              <div className="relative group">
                <Link
                  href="/login?callbackUrl=/leaderboard"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground/50 hover:text-muted-foreground transition-all duration-200"
                >
                  <Trophy className="w-4 h-4" />
                  Leaderboard
                  <Lock className="w-3 h-3" />
                </Link>
              </div>
            )}
            {canAccessDashboard && (
              <Link
                href="/dashboard"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <User className="w-4 h-4" />
                Dashboard
              </Link>
            )}
            {canAccessDashboard && (
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname === "/dashboard/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Profile
              </Link>
            )}
            {session?.user?.role === "admin" && (
              <Link
                href="/admin"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-muted/80 ${
                  pathname.startsWith("/admin") ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {session ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <TierBadge tier={tier} size="sm" />
                </div>
                {isPremium && (
                  <Link
                    href="/dashboard/subscription"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                  >
                    Manage
                  </Link>
                )}
                <button
                  onClick={() => handleSignOut()}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden border-t border-border overflow-hidden bg-card"
            >
              <div className="container py-3 flex flex-col gap-1">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </Link>
                <Link
                  href="/quizzes"
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    pathname === "/quizzes" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Quiz Catalog
                </Link>
                {canAccessFlashcards ? (
                  <Link
                    href="/flashcards"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/flashcards" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Layers className="w-4 h-4" />
                    Flashcards
                  </Link>
                ) : (
                  <Link
                    href="/upgrade"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground/50"
                  >
                    <Layers className="w-4 h-4" />
                    Flashcards
                    <Lock className="w-3 h-3" />
                  </Link>
                )}
                {canAccessSimulations ? (
                  <Link
                    href="/simulation"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/simulation" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    Simulation
                  </Link>
                ) : (
                  <Link
                    href="/upgrade"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground/50"
                  >
                    <ClipboardList className="w-4 h-4" />
                    Simulation
                    <Lock className="w-3 h-3" />
                  </Link>
                )}
                {isAuthenticated ? (
                  <Link
                    href="/leaderboard"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/leaderboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Link>
                ) : (
                  <Link
                    href="/login?callbackUrl=/leaderboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground/50"
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                    <Lock className="w-3 h-3" />
                  </Link>
                )}
                {canAccessDashboard && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/dashboard" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                )}
                {canAccessDashboard && (
                  <Link
                    href="/dashboard/profile"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/dashboard/profile" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    Profile
                  </Link>
                )}
                {session?.user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                {session ? (
                  <>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setMobileOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted w-full text-left"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                  </>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {!isPremium && <PremiumPromoBanner />}

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card py-8">
        <div className="container flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2026 Canadian Citizenship Test Prep. Practice smarter, pass with confidence. 🍁</p>
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
              <Link href="/about" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="/contact" className="hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
            </nav>
          </div>
        </div>
      </footer>
      <AccessibilityWidget />
    </div>
  );
}
