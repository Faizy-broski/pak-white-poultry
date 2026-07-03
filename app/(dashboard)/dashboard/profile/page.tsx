"use client"

import { useState } from "react"
import {
  CameraIcon,
  ShieldCheckIcon,
  LaptopIcon,
  SmartphoneIcon,
  LogOutIcon,
  BadgeCheckIcon,
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PasswordInput } from "@/components/auth/password-input"

const sessions = [
  { id: 1, device: "MacBook Pro — Chrome", location: "Lahore, Pakistan", current: true, icon: LaptopIcon },
  { id: 2, device: "iPhone 15 — Claude app", location: "Lahore, Pakistan", current: false, icon: SmartphoneIcon },
]

export default function ProfilePage() {
  const [fullName, setFullName] = useState("Admin User")
  const [email, setEmail] = useState("admin@pakwhitepoultry.pk")
  const [phone, setPhone] = useState("0300 1234567")
  const [savedGeneral, setSavedGeneral] = useState(false)

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [twoFactor, setTwoFactor] = useState(false)

  const [notifyNewOrders, setNotifyNewOrders] = useState(true)
  const [notifyStatusChanges, setNotifyStatusChanges] = useState(true)
  const [notifyWeeklySummary, setNotifyWeeklySummary] = useState(true)
  const [notifySms, setNotifySms] = useState(false)

  function saveGeneral() {
    setSavedGeneral(true)
    setTimeout(() => setSavedGeneral(false), 2000)
  }

  function updatePassword() {
    setPasswordError(null)
    if (!currentPassword) return setPasswordError("Enter your current password.")
    if (newPassword.length < 8) return setPasswordError("New password must be at least 8 characters.")
    if (newPassword !== confirmPassword) return setPasswordError("New passwords don't match.")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const initials = fullName.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account details, security, and notification preferences.
        </p>
      </div>

      {/* Summary card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 text-center sm:flex-row sm:text-left">
          <div className="relative">
            <Avatar className="size-20">
              <AvatarFallback className="bg-primary text-2xl text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border-2 border-card bg-secondary text-foreground transition-colors hover:bg-secondary/70"
              aria-label="Change photo"
            >
              <CameraIcon className="size-3.5" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex flex-col items-center gap-1.5 sm:flex-row">
              <h2 className="font-serif text-xl font-semibold">{fullName}</h2>
              <Badge className="gap-1 bg-primary/15 text-primary">
                <BadgeCheckIcon className="size-3" />
                Admin
              </Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{email}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Member since January 2026</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Personal information</CardTitle>
              <CardDescription>Update your name, email, and phone number.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </CardContent>
            <CardFooter className="justify-between border-t border-border pt-4">
              <p className={`text-sm text-emerald-600 transition-opacity ${savedGeneral ? "opacity-100" : "opacity-0"}`}>
                Saved
              </p>
              <Button onClick={saveGeneral}>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Change password</CardTitle>
              <CardDescription>Use a strong password you don&rsquo;t use elsewhere.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:max-w-md">
              <div className="grid gap-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <PasswordInput
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New password</Label>
                <PasswordInput
                  id="newPassword"
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmNewPassword">Confirm new password</Label>
                <PasswordInput
                  id="confirmNewPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button onClick={updatePassword}>Update password</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Two-factor authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                    <ShieldCheckIcon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium">Authenticator app</p>
                    <p className="text-xs text-muted-foreground">
                      {twoFactor ? "Enabled" : "Not enabled"}
                    </p>
                  </div>
                </div>
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active sessions</CardTitle>
              <CardDescription>Devices currently signed in to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                      <session.icon className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium">{session.device}</p>
                      <p className="text-xs text-muted-foreground">{session.location}</p>
                    </div>
                  </div>
                  {session.current ? (
                    <Badge variant="secondary">This device</Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                      <LogOutIcon className="size-3.5" />
                      Log out
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Log out of all other devices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationRow
                title="New orders"
                description="Get notified the moment a customer places an order"
                checked={notifyNewOrders}
                onCheckedChange={setNotifyNewOrders}
              />
              <NotificationRow
                title="Order status changes"
                description="Updates when an order moves through delivery stages"
                checked={notifyStatusChanges}
                onCheckedChange={setNotifyStatusChanges}
              />
              <NotificationRow
                title="Weekly summary"
                description="A Monday morning digest of last week's performance"
                checked={notifyWeeklySummary}
                onCheckedChange={setNotifyWeeklySummary}
              />
              <Separator />
              <NotificationRow
                title="SMS alerts"
                description="Send critical alerts to your phone as well as email"
                checked={notifySms}
                onCheckedChange={setNotifySms}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function NotificationRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3.5">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}