"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Leaf, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  Trophy,
  Users,
  Github,
<<<<<<< HEAD
  AlertCircle,
  CheckCircle2,
  Clock,
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
} from "lucide-react"
import { createClient } from "@/lib/supabaseClient"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EcoIllustration } from "./eco-illustration"

const benefits = [
  {
    icon: Leaf,
    title: "Track Your Impact",
    description: "Monitor your daily activities and see your carbon footprint in real-time.",
  },
  {
    icon: Trophy,
    title: "Earn Rewards",
    description: "Earn points, unlock badges and redeem exciting rewards.",
  },
  {
    icon: Users,
    title: "Compete & Inspire",
    description: "Climb the leaderboard and inspire others to go green.",
  },
]

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
<<<<<<< HEAD
  const [errorType, setErrorType] = useState<"rate-limit" | "validation" | "unknown" | "">("")
  const [successMessage, setSuccessMessage] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  const [rateLimitSeconds, setRateLimitSeconds] = useState(0)
=======
  const [successMessage, setSuccessMessage] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

<<<<<<< HEAD
  // Rate limit countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (rateLimitSeconds > 0) {
      interval = setInterval(() => {
        setRateLimitSeconds(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [rateLimitSeconds])

=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
<<<<<<< HEAD
    setErrorType("")
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
    setIsLoading(true)

    try {
      const supabaseClient = createClient()
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (authError) {
<<<<<<< HEAD
        const errorMsg = authError.message || "Invalid email or password"
        const isRateLimit = errorMsg.toLowerCase().includes("rate limit") || 
                           errorMsg.toLowerCase().includes("too many")

        if (isRateLimit) {
          setErrorType("rate-limit")
          setError("Too many login attempts. Please wait a few minutes before trying again.")
          setRateLimitSeconds(300) // 5 minutes
        } else {
          setErrorType("validation")
          setError("Invalid email or password. Please try again.")
        }
=======
        setError(authError.message || "Invalid email or password")
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
        setIsLoading(false)
        return
      }

      if (data.user) {
        setIsLoading(false)
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
<<<<<<< HEAD
      setErrorType("unknown")
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
<<<<<<< HEAD
    setErrorType("")
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
    setSuccessMessage("")
    setIsLoading(true)

    try {
      const supabaseClient = createClient()
      
      const { data, error: authError } = await supabaseClient.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
          data: {
            full_name: signupName,
          }
        }
      })

      if (authError) {
<<<<<<< HEAD
        const errorMsg = authError.message || "Failed to create account"
        const isRateLimit = errorMsg.toLowerCase().includes("rate limit") || 
                           errorMsg.toLowerCase().includes("too many")
        const isAlreadyRegistered = errorMsg.toLowerCase().includes("already registered") || 
                                   errorMsg.toLowerCase().includes("user already exists")

        if (isRateLimit) {
          setErrorType("rate-limit")
          setError("Too many signup attempts. Please wait a few minutes before trying again.")
          setRateLimitSeconds(300) // 5 minutes
        } else if (isAlreadyRegistered) {
          setErrorType("validation")
          setError("This email is already registered. Please try logging in instead.")
        } else {
          setErrorType("unknown")
          setError(errorMsg)
=======
        if (authError.message?.includes("rate limit")) {
          setError("Too many signup attempts. Please wait a few minutes before trying again.")
        } else if (authError.message?.includes("already registered")) {
          setError("This email is already registered. Please try logging in instead.")
        } else {
          setError(authError.message || "Failed to create account")
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
        }
        setIsLoading(false)
        return
      }

      if (data.user) {
        setVerificationSent(true)
        setSuccessMessage("Verification email sent! Please check your inbox and click the link to confirm your account.")
        setSignupName("")
        setSignupEmail("")
        setSignupPassword("")
        setIsLoading(false)
      }
    } catch (err) {
      console.error("[v0] Signup error:", err)
<<<<<<< HEAD
      setErrorType("unknown")
=======
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex flex-col lg:grid lg:grid-cols-2">
      {/* Left Side - Welcome Section */}
<<<<<<< HEAD
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-stone-100 lg:to-stone-50 lg:p-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <Leaf className="h-7 w-7" />
            <span className="text-xl font-bold">CarbonWise</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900">Welcome Back!</h2>
          <p className="text-sm text-stone-600 max-w-sm">
=======
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-stone-100 lg:to-stone-50 lg:p-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-bold">CarbonWise</span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900">Welcome Back!</h2>
          <p className="text-lg text-stone-600 max-w-md">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
            Log in to continue your sustainability journey and make a bigger impact.
          </p>
        </div>

        {/* Benefits Cards */}
<<<<<<< HEAD
        <div className="space-y-3">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-lg bg-emerald-100 mt-0.5">
                <benefit.icon className="h-4 w-4 text-emerald-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-stone-900 text-sm">{benefit.title}</h3>
                <p className="text-xs text-stone-600 leading-tight">{benefit.description}</p>
=======
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                <benefit.icon className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{benefit.title}</h3>
                <p className="text-sm text-stone-600">{benefit.description}</p>
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
              </div>
            </div>
          ))}
        </div>

        {/* Eco Illustration */}
<<<<<<< HEAD
        <div className="mt-6">
=======
        <div className="mt-8">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
          <EcoIllustration />
        </div>
      </div>

      {/* Right Side - Auth Form */}
<<<<<<< HEAD
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-sm">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6 text-center">
            <div className="inline-flex items-center gap-2 text-emerald-700 mb-2">
              <Leaf className="h-6 w-6" />
              <span className="text-lg font-bold">CarbonWise</span>
            </div>
            <p className="text-xs text-stone-500">Track. Reduce. Earn.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-stone-100 mb-4">
              <TabsTrigger 
                value="login"
                className="py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-700 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
=======
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header */}
          <div className="lg:hidden space-y-2">
            <div className="inline-flex items-center gap-2 text-emerald-700">
              <Leaf className="h-6 w-6" />
              <span className="text-xl font-bold">CarbonWise</span>
            </div>
            <p className="text-sm text-stone-500">Track. Reduce. Earn.</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-stone-100">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-700 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
              >
                Log In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
<<<<<<< HEAD
                className="py-2 text-sm data-[state=active]:border-b-2 data-[state=active]:border-emerald-700 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
=======
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-700 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
<<<<<<< HEAD
            <TabsContent value="login" className="space-y-3 mt-4">
              {error && (
                <div className={`rounded-lg border px-3 py-2 flex gap-2 ${
                  errorType === "rate-limit" 
                    ? "bg-amber-50 border-amber-200" 
                    : "bg-red-50 border-red-200"
                }`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {errorType === "rate-limit" ? (
                      <Clock className="h-4 w-4 text-amber-700" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-700" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-medium ${
                      errorType === "rate-limit" 
                        ? "text-amber-800" 
                        : "text-red-800"
                    }`}>
                      {error}
                    </p>
                    {errorType === "rate-limit" && rateLimitSeconds > 0 && (
                      <p className="text-xs text-amber-700 mt-1">
                        Try again in {Math.floor(rateLimitSeconds / 60)}:{String(rateLimitSeconds % 60).padStart(2, '0')}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="login-email" className="text-stone-700 text-xs font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
=======
            <TabsContent value="login" className="space-y-4 mt-6">
              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-stone-700">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
<<<<<<< HEAD
                      disabled={isLoading || rateLimitSeconds > 0}
                      required
                      className="pl-9 h-9 text-sm border-stone-200"
=======
                      disabled={isLoading}
                      required
                      className="pl-10 border-stone-200"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    />
                  </div>
                </div>

<<<<<<< HEAD
                <div className="space-y-1">
                  <Label htmlFor="login-password" className="text-stone-700 text-xs font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
=======
                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-stone-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
<<<<<<< HEAD
                      disabled={isLoading || rateLimitSeconds > 0}
                      required
                      className="pl-9 pr-9 h-9 text-sm border-stone-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-2.5"
=======
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 border-stone-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
<<<<<<< HEAD
                        <EyeOff className="h-4 w-4 text-stone-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-stone-400" />
=======
                        <EyeOff className="h-5 w-5 text-stone-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-stone-400" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                      )}
                    </button>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-700">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={() => setRememberMe(!rememberMe)}
                      className="h-3 w-3"
                      disabled={rateLimitSeconds > 0}
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-xs text-emerald-700 hover:text-emerald-800 font-medium">
                    Forgot?
=======
                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <Checkbox
                      checked={rememberMe}
                      onCheckedChange={() => setRememberMe(!rememberMe)}
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-sm text-emerald-700 hover:text-emerald-800 font-medium">
                    Forgot Password?
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                  </a>
                </div>

                <Button 
                  type="submit" 
<<<<<<< HEAD
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white gap-2 py-2 text-sm h-9 mt-2"
                  disabled={isLoading || rateLimitSeconds > 0}
                >
                  <Leaf className="h-4 w-4" />
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
=======
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white gap-2 py-6 text-base"
                  disabled={isLoading}
                >
                  <Leaf className="h-5 w-5" />
                  {isLoading ? "Logging in..." : "Log In"}
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-stone-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    <span className="px-2 bg-white text-stone-500">or continue with</span>
                  </div>
                </div>

<<<<<<< HEAD
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-stone-200 text-stone-700 hover:bg-stone-50 h-9 text-xs"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
=======
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-stone-200 text-stone-700 hover:bg-stone-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
<<<<<<< HEAD
                    className="border-stone-200 text-stone-700 hover:bg-stone-50 h-9 text-xs"
                  >
                    <Github className="h-4 w-4" />
=======
                    className="border-stone-200 text-stone-700 hover:bg-stone-50"
                  >
                    <Github className="h-5 w-5" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    GitHub
                  </Button>
                </div>

<<<<<<< HEAD
                <p className="text-center text-xs text-stone-600 pt-1">
=======
                <p className="text-center text-sm text-stone-600">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    className="font-semibold text-emerald-700 hover:text-emerald-800"
                    onClick={() => setActiveTab("signup")}
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </TabsContent>

            {/* Signup Tab */}
<<<<<<< HEAD
            <TabsContent value="signup" className="space-y-3 mt-4">
              {verificationSent ? (
                <div className="space-y-3 py-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                    <Mail className="h-5 w-5 text-emerald-700" />
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Check your email</h3>
                  <p className="text-xs text-stone-600">
=======
            <TabsContent value="signup" className="space-y-4 mt-6">
              {verificationSent ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Mail className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900">Check your email</h3>
                  <p className="text-sm text-stone-600">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    {successMessage}
                  </p>
                  <Button 
                    variant="outline" 
<<<<<<< HEAD
                    className="w-full border-stone-200 h-9 text-xs mt-2"
=======
                    className="w-full border-stone-200"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    onClick={() => {
                      setVerificationSent(false)
                      setActiveTab("login")
                    }}
                  >
                    Back to Login
                  </Button>
                </div>
              ) : (
                <>
                  {error && (
<<<<<<< HEAD
                    <div className={`rounded-lg border px-3 py-2 flex gap-2 ${
                      errorType === "rate-limit" 
                        ? "bg-amber-50 border-amber-200" 
                        : "bg-red-50 border-red-200"
                    }`}>
                      <div className="flex-shrink-0 mt-0.5">
                        {errorType === "rate-limit" ? (
                          <Clock className="h-4 w-4 text-amber-700" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-700" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${
                          errorType === "rate-limit" 
                            ? "text-amber-800" 
                            : "text-red-800"
                        }`}>
                          {error}
                        </p>
                        {errorType === "rate-limit" && rateLimitSeconds > 0 && (
                          <p className="text-xs text-amber-700 mt-1">
                            Try again in {Math.floor(rateLimitSeconds / 60)}:{String(rateLimitSeconds % 60).padStart(2, '0')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {successMessage && (
                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 flex gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <CheckCircle2 className="h-4 w-4 text-emerald-700" />
                      </div>
                      <p className="text-xs font-medium text-emerald-800">{successMessage}</p>
                    </div>
                  )}
                  <form onSubmit={handleSignup} className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="signup-name" className="text-stone-700 text-xs font-medium">Full Name</Label>
=======
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert className="border-emerald-200 bg-emerald-50">
                      <AlertDescription className="text-emerald-800">{successMessage}</AlertDescription>
                    </Alert>
                  )}
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-name" className="text-stone-700">Full Name</Label>
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
<<<<<<< HEAD
                        disabled={isLoading || rateLimitSeconds > 0}
                        required
                        className="h-9 text-sm border-stone-200"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="signup-email" className="text-stone-700 text-xs font-medium">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
=======
                        disabled={isLoading}
                        required
                        className="border-stone-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-stone-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
<<<<<<< HEAD
                          disabled={isLoading || rateLimitSeconds > 0}
                          required
                          className="pl-9 h-9 text-sm border-stone-200"
=======
                          disabled={isLoading}
                          required
                          className="pl-10 border-stone-200"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                        />
                      </div>
                    </div>

<<<<<<< HEAD
                    <div className="space-y-1">
                      <Label htmlFor="signup-password" className="text-stone-700 text-xs font-medium">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
=======
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-stone-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
<<<<<<< HEAD
                          disabled={isLoading || rateLimitSeconds > 0}
                          required
                          className="pl-9 pr-9 h-9 text-sm border-stone-200"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2.5"
=======
                          disabled={isLoading}
                          required
                          className="pl-10 pr-10 border-stone-200"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
<<<<<<< HEAD
                            <EyeOff className="h-4 w-4 text-stone-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-stone-400" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        At least 8 characters recommended
                      </p>
=======
                            <EyeOff className="h-5 w-5 text-stone-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-stone-400" />
                          )}
                        </button>
                      </div>
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    </div>

                    <Button 
                      type="submit" 
<<<<<<< HEAD
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 text-sm h-9 mt-2"
                      disabled={isLoading || rateLimitSeconds > 0}
=======
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-base"
                      disabled={isLoading}
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>

<<<<<<< HEAD
                    <p className="text-center text-xs text-stone-600 pt-1">
=======
                    <p className="text-center text-sm text-stone-600">
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="font-semibold text-emerald-700 hover:text-emerald-800"
                        onClick={() => setActiveTab("login")}
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
<<<<<<< HEAD
      <div className="col-span-full border-t border-stone-200 py-2 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <p className="text-xs text-stone-500">© 2024 CarbonWise. All rights reserved.</p>
=======
      <div className="col-span-full border-t border-stone-200 py-4 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2024 CarbonWise. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-700">Privacy Policy</a>
            <a href="#" className="hover:text-stone-700">Terms & Conditions</a>
          </div>
        </div>
>>>>>>> 778ecd85492936ad34a5a3b1ed51bea1f9da59e8
      </div>
    </div>
  )
}

