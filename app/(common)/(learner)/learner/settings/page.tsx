"use client";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Shield, CreditCard, Upload } from "lucide-react";
import { currentUser } from "@/data/mockData";
import { cn } from "@/lib/utils";
import toaster from "@/lib/toaster";

const settingsTabs = [
  { id: "account", label: "Account", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("account");

  const handleSave = () => {
    toaster.success("Settings saved");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <Card className="md:w-64 h-fit">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "account" && (
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input defaultValue="Doe" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Email</Label>
                    <Input defaultValue={currentUser.email} type="email" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Phone</Label>
                    <Input defaultValue="+1 (555) 123-4567" type="tel" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gradient-primary">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what notifications you receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  {
                    title: "Course Updates",
                    description: "Get notified when courses are updated",
                  },
                  {
                    title: "Study Reminders",
                    description: "Receive daily study reminders",
                  },
                  {
                    title: "Exam Alerts",
                    description: "Get alerts for upcoming exams",
                  },
                  {
                    title: "Marketing Emails",
                    description: "Receive promotional offers and updates",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch defaultChecked={i < 3} />
                  </div>
                ))}

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gradient-primary">
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and security options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input type="password" />
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} className="gradient-primary">
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Payments</CardTitle>
                <CardDescription>
                  Manage your payment methods and view history
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg border border-border bg-accent/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-foreground/10 rounded flex items-center justify-center text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-muted-foreground">
                          Expires 12/25
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">Default</Badge>
                  </div>
                </div>

                <Button variant="outline">Add Payment Method</Button>

                <Separator />

                <div>
                  <h4 className="font-medium mb-4">Recent Transactions</h4>
                  <div className="space-y-3">
                    {[
                      {
                        course: "Complete NCA Pathway Exam Preparation",
                        date: "Jan 15, 2024",
                        amount: "$299",
                      },
                      {
                        course: "Criminal Law & Procedure",
                        date: "Feb 20, 2024",
                        amount: "$149",
                      },
                    ].map((tx, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-sm">{tx.course}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.date}
                          </p>
                        </div>
                        <span className="font-medium">{tx.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
