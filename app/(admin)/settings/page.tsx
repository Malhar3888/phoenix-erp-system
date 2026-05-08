"use client"

import { useState } from "react"
import Image from "next/image"
import { Save, Building2, Bell, Database, ShieldCheck } from "lucide-react"
import { PageHeader } from "@/components/admin/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

export default function SettingsPage() {
  const [name, setName] = useState("Phoenix Computers")
  const [tagline, setTagline] = useState("Career-grade computer education")
  const [address, setAddress] = useState(
    "Shop No. 12, Main Road, Phoenix Plaza, Mumbai 400001",
  )
  const [phone, setPhone] = useState("+91 98201 11122")
  const [email, setEmail] = useState("admin@phoenix.in")
  const [gst, setGst] = useState("27AABCP1234F1Z5")

  const [whatsappReceipts, setWhatsappReceipts] = useState(true)
  const [feeReminders, setFeeReminders] = useState(true)
  const [attendanceAlerts, setAttendanceAlerts] = useState(false)
  const [followUpAlerts, setFollowUpAlerts] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Settings"
        description="Manage institute profile, integrations and preferences."
        actions={
          <Button onClick={() => toast.success("Settings saved")}>
            <Save />
            Save Changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-primary" />
              <CardTitle>Institute Profile</CardTitle>
            </div>
            <CardDescription>
              This information appears on receipts, certificates and public pages.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="iname">Institute Name</Label>
                <Input
                  id="iname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tag">Tagline</Label>
                <Input
                  id="tag"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="addr">Address</Label>
              <Textarea
                id="addr"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
              />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              <div className="grid gap-2">
                <Label htmlFor="ph">Phone</Label>
                <Input
                  id="ph"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="em">Email</Label>
                <Input
                  id="em"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gst">GST Number</Label>
                <Input
                  id="gst"
                  value={gst}
                  onChange={(e) => setGst(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Brand Identity</CardTitle>
            <CardDescription>Logo used across the system</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl bg-background ring-1 ring-primary/30">
              <Image
                src="/phoenix-logo.png"
                alt="Phoenix Computers"
                fill
                sizes="128px"
                className="object-contain p-2"
              />
            </div>
            <div className="text-center">
              <div className="text-sm font-semibold">PHOENIX COMPUTERS</div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-primary">
                Education ERP
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Replace Logo
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="size-4 text-primary" />
            <CardTitle>Notifications & Automations</CardTitle>
          </div>
          <CardDescription>
            Configure WhatsApp messaging, alerts and reminders.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1">
          {[
            {
              title: "WhatsApp receipt sharing",
              desc: "Share PDF receipts to students instantly via WhatsApp deep links.",
              checked: whatsappReceipts,
              set: setWhatsappReceipts,
            },
            {
              title: "Fee reminder messages",
              desc: "Auto-suggest WhatsApp follow-ups 5 days before due date.",
              checked: feeReminders,
              set: setFeeReminders,
            },
            {
              title: "Low-attendance alerts",
              desc: "Notify when a student's attendance dips below 70%.",
              checked: attendanceAlerts,
              set: setAttendanceAlerts,
            },
            {
              title: "Inquiry follow-up alerts",
              desc: "Daily summary of inquiries due for follow-up today.",
              checked: followUpAlerts,
              set: setFollowUpAlerts,
            },
          ].map((row, idx, arr) => (
            <div key={row.title}>
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">{row.title}</div>
                  <div className="text-xs text-muted-foreground">{row.desc}</div>
                </div>
                <Switch
                  checked={row.checked}
                  onCheckedChange={row.set}
                />
              </div>
              {idx < arr.length - 1 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="size-4 text-primary" />
              <CardTitle>Data & Backend</CardTitle>
            </div>
            <CardDescription>
              Connect a database to persist students, payments and attendance.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
              <div>
                <div className="text-sm font-medium">Supabase</div>
                <div className="text-xs text-muted-foreground">
                  Recommended for auth + Postgres
                </div>
              </div>
              <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                Not connected
              </Badge>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 p-3">
              <div>
                <div className="text-sm font-medium">Vercel Blob</div>
                <div className="text-xs text-muted-foreground">
                  For document & ID uploads
                </div>
              </div>
              <Badge variant="outline" className="border-amber-500/40 text-amber-400">
                Not connected
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Add an integration from the project settings to enable persistent
              storage and authentication.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>
              Protect access to your institute&apos;s data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="cur">Current Password</Label>
              <Input id="cur" type="password" placeholder="••••••••" />
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="np">New Password</Label>
                <Input id="np" type="password" placeholder="••••••••" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cp">Confirm Password</Label>
                <Input id="cp" type="password" placeholder="••••••••" />
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Update Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
