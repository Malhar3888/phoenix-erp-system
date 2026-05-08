"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@phoenix.in")
  const [password, setPassword] = useState("phoenix123")
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast.success("Welcome back, Admin")
      router.push("/dashboard")
    }, 600)
  }

  return (
    <div className="grid-bg relative grid min-h-svh lg:grid-cols-2">
      {/* Left brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-sidebar p-10 lg:flex">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-xl bg-background ring-1 ring-primary/30">
            <Image
              src="/phoenix-logo.png"
              alt="Phoenix Computers"
              fill
              sizes="44px"
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold tracking-wide">PHOENIX</div>
            <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-primary">
              Computers ERP
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="max-w-md text-balance text-3xl font-bold leading-tight">
            One admin panel for your{" "}
            <span className="text-primary">entire institute</span>.
          </h2>
          <p className="max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
            Track students, fees, attendance, expenses, profit and loss — and
            share WhatsApp receipts in a click. Phoenix ERP runs your business
            end-to-end.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-4">
            {[
              { k: "Students managed", v: "1,200+" },
              { k: "Receipts shared", v: "5,400+" },
              { k: "Attendance via QR", v: "Real-time" },
              { k: "Profit insights", v: "Live charts" },
            ].map((s) => (
              <div
                key={s.k}
                className="rounded-xl border border-border/60 bg-card/50 p-4 backdrop-blur"
              >
                <div className="text-lg font-bold text-foreground">{s.v}</div>
                <div className="text-xs text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Phoenix Computers. All rights reserved.
        </p>

        <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -top-32 -right-24 size-80 rounded-full bg-chart-2/10 blur-3xl" />
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <Card className="glass w-full max-w-md">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center gap-3 lg:hidden">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-background ring-1 ring-primary/30">
                <Image
                  src="/phoenix-logo.png"
                  alt="Phoenix Computers"
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-bold tracking-wide">PHOENIX</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-primary">
                  Computers ERP
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight">Admin Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your administrator account to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@phoenix.in"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground"
                >
                  Keep me signed in for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full text-sm font-semibold"
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                Protected by JWT session • single-admin access
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
