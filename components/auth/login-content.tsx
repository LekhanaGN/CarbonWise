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
  const [successMessage, setSuccessMessage] = useState("")
  const [verificationSent, setVerificationSent] = useState(false)
  
  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab === "signup") {
      setActiveTab("signup")
    }
  }, [searchParams])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const supabaseClient = createClient()
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (authError) {
        setError(authError.message || "Invalid email or password")
        setIsLoading(false)
        return
      }

      if (data.user) {
        setIsLoading(false)
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("[v0] Login error:", err)
      setError("An unexpected error occurred")
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
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
        if (authError.message?.includes("rate limit")) {
          setError("Too many signup attempts. Please wait a few minutes before trying again.")
        } else if (authError.message?.includes("already registered")) {
          setError("This email is already registered. Please try logging in instead.")
        } else {
          setError(authError.message || "Failed to create account")
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
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white flex flex-col lg:grid lg:grid-cols-2">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex lg:flex-col lg:justify-between lg:bg-gradient-to-br lg:from-stone-100 lg:to-stone-50 lg:p-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 text-emerald-700">
            <Leaf className="h-8 w-8" />
            <span className="text-2xl font-bold">CarbonWise</span>
          </div>
          <h2 className="text-3xl font-bold text-stone-900">Welcome Back!</h2>
          <p className="text-lg text-stone-600 max-w-md">
            Log in to continue your sustainability journey and make a bigger impact.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-3 items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-emerald-100">
                <benefit.icon className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{benefit.title}</h3>
                <p className="text-sm text-stone-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Eco Illustration */}
        <div className="mt-8">
          <EcoIllustration />
        </div>
      </div>

      {/* Right Side - Auth Form */}
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
              >
                Log In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:border-b-2 data-[state=active]:border-emerald-700 data-[state=active]:bg-transparent data-[state=active]:text-emerald-700 data-[state=active]:shadow-none"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
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
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10 border-stone-200"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-stone-700">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      required
                      className="pl-10 pr-10 border-stone-200"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-stone-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-stone-400" />
                      )}
                    </button>
                  </div>
                </div>

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
                  </a>
                </div>

                <Button 
                  type="submit" 
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
                    <span className="px-2 bg-white text-stone-500">or continue with</span>
                  </div>
                </div>

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
                    </svg>
                    Google
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    className="border-stone-200 text-stone-700 hover:bg-stone-50"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </Button>
                </div>

                <p className="text-center text-sm text-stone-600">
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
            <TabsContent value="signup" className="space-y-4 mt-6">
              {verificationSent ? (
                <div className="space-y-4 py-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <Mail className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900">Check your email</h3>
                  <p className="text-sm text-stone-600">
                    {successMessage}
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full border-stone-200"
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
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="John Doe"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        disabled={isLoading}
                        required
                        className="border-stone-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-stone-700">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          disabled={isLoading}
                          required
                          className="pl-10 border-stone-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-stone-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-stone-400" />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          disabled={isLoading}
                          required
                          className="pl-10 pr-10 border-stone-200"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-stone-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-stone-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-6 text-base"
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating account..." : "Sign Up"}
                    </Button>

                    <p className="text-center text-sm text-stone-600">
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
      <div className="col-span-full border-t border-stone-200 py-4 px-4 sm:px-6 lg:px-12 bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2024 CarbonWise. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-700">Privacy Policy</a>
            <a href="#" className="hover:text-stone-700">Terms & Conditions</a>
          </div>
        </div>
      </div>
    </div>
  )
}

