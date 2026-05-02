"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Leaf, 
  Menu, 
  X,
  CheckCircle,
  Sprout,
  Trophy,
  Chrome,
  BarChart3,
  ClipboardList,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ArrowRight,
<<<<<<< HEAD
  Users,
=======
>>>>>>> f3b66482f7774c42cff6be10355f1bcf487f2dff
} from "lucide-react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getState, type AppState } from "@/lib/store"
const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Eco Actions", href: "#eco-actions" },
  { label: "Rewards", href: "#rewards" },
  { label: "Extension", href: "#extension" },
  { label: "About Us", href: "#about" },
]

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Tracking",
    description: "Track your impact across travel, food, shopping and more.",
  },
  {
    icon: Chrome,
    title: "Chrome Extension",
    description: "Get instant feedback while you browse and shop online.",
  },
  {
    icon: Trophy,
    title: "Gamified Rewards",
    description: "Earn points, level up and unlock achievement badges.",
  },
  {
    icon: Users,
    title: "Live Leaderboard",
    description: "Compete with others and climb the leaderboard in real-time.",
  },
  {
    icon: ClipboardList,
    title: "Log Eco Actions",
    description: "Manually log eco-friendly actions and see your positive impact.",
  },
]

const howItWorks = [
  {
    step: 1,
    title: "Track Actions",
    description: "We automatically detect your activities across platforms.",
    icon: Sprout,
  },
  {
    step: 2,
    title: "Measure Impact",
    description: "Get real-time insights into your carbon footprint.",
    icon: BarChart3,
  },
  {
    step: 3,
    title: "Earn Rewards",
    description: "Earn points, unlock badges and redeem exciting rewards.",
    icon: Trophy,
  },
]

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2">
            <Leaf className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">CarbonWise</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-3 lg:flex">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/login?tab=signup">
              <Button>Sign Up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background lg:hidden">
            <nav className="flex flex-col px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-4 flex flex-col gap-2">
                <Link href="/login">
                  <Button variant="outline" className="w-full">Log In</Button>
                </Link>
                <Link href="/login?tab=signup">
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text Content */}
            <div>
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Track Your Carbon.
                <span className="block text-primary">Make a Difference.</span>
              </h1>
              <p className="mt-6 text-pretty text-lg text-muted-foreground">
                CarbonWise helps you track your daily activities, measure your impact in real-time and earn rewards for making greener choices.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/login?tab=signup">
                  <Button size="lg" className="gap-2">
                    Get Started
                    <Leaf className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Hero Image - Earth */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-80 w-80 lg:h-[400px] lg:w-[400px]">
                {/* Earth Image */}
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DexGonp7rcCXQQV0sumnzZwDixAJdO.png" 
                  alt="Earth - Track your carbon footprint" 
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
                {/* Floating leaves */}
                <div className="absolute -left-4 top-1/4 animate-bounce">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -right-4 bottom-1/3 animate-bounce delay-150">
                  <Leaf className="h-6 w-6 text-primary/70" />
                </div>
                <div className="absolute left-1/4 top-0 animate-bounce delay-300">
                  <Sprout className="h-7 w-7 text-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="flex items-center justify-center gap-2 text-3xl font-bold text-foreground">
              How It Works
              <Sprout className="h-8 w-8 text-primary" />
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {howItWorks.map((item) => (
              <div key={item.step} className="text-center">
                <div className="relative mx-auto mb-4 flex h-20 w-20 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <item.icon className="h-10 w-10 text-primary" />
                  <span className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Why Choose CarbonWise */}
      <section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">Why Choose CarbonWise?</h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-6 text-center transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/90 to-primary px-8 py-12 sm:px-12 sm:py-16">
            <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center sm:flex-row sm:text-left">
              <div>
                <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">
                  Small Actions. Big Impact.
                </h2>
                <p className="mt-2 text-primary-foreground/80">
                  Together, we can build a sustainable future.
                </p>
              </div>
              <Link href="/login?tab=signup">
                <Button size="lg" variant="secondary" className="gap-2">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            {/* Decorative elements */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10" />
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative border-t border-border bg-muted/30 py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <Badge className="mb-4 w-fit">🌱 Transform Your Impact</Badge>

              <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Track Your Carbon Footprint, Save the Planet
              </h1>

              <p className="mb-8 text-lg text-muted-foreground">
                Monitor your eco-impact across your favorite websites. Earn rewards for sustainable choices and join a community of eco-conscious users making a real difference.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/login">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="/">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Try Demo
                  </Button>
                </Link>
              </div>
<<<<<<< HEAD
            </div>

            {/* Right - Hero Image */}
=======

              {/* Right - Hero Image */}
>>>>>>> f3b66482f7774c42cff6be10355f1bcf487f2dff
            <div className="flex items-center justify-center">
              <div className="relative h-80 w-80 lg:h-96 lg:w-96">
                {/* Earth Image */}
                <img 
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DexGonp7rcCXQQV0sumnzZwDixAJdO.png" 
                  alt="Earth - Track your carbon footprint" 
                  className="h-full w-full object-contain"
                />
                {/* Floating leaves */}
                <div className="absolute -left-8 top-1/4 animate-bounce">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute -right-8 bottom-1/3 animate-bounce" style={{animationDelay: '150ms'}}>
                  <Leaf className="h-6 w-6 text-primary/70" />
                </div>
                <div className="absolute left-1/4 -top-4 animate-bounce" style={{animationDelay: '300ms'}}>
                  <Sprout className="h-7 w-7 text-primary/80" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CarbonWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
