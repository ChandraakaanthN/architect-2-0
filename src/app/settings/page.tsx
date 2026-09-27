"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CreditCard, Cpu, User, Users, Workflow } from "lucide-react";
import { Logo } from "@/components/logo";
import { GithubMark } from "@/components/icons/github-mark";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { backend, type AuthUser } from "@/lib/backend";
import { ProfileSection } from "@/components/settings/profile-section";
import { ModelsSection } from "@/components/settings/models-section";
import { FrameworksSection } from "@/components/settings/frameworks-section";
import { GithubSection } from "@/components/settings/github-section";
import { BillingSection } from "@/components/settings/billing-section";
import { TeamSection } from "@/components/settings/team-section";

const SECTIONS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "models", label: "Models & AI", icon: Cpu },
  { id: "frameworks", label: "Agent frameworks", icon: Workflow },
  { id: "github", label: "GitHub", icon: GithubMark },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
] as const;

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    backend.getUser().then((resolvedUser) => {
      if (!active) return;
      if (!resolvedUser) {
        router.replace("/sign-in");
        return;
      }
      setUser(resolvedUser);
      setChecking(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (checking || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to dashboard
          </Link>
          <Logo />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile, models, frameworks, integrations, and billing.
          </p>
        </div>

        <Tabs defaultValue="profile" orientation="vertical" className="items-start gap-8">
          <TabsList variant="line" className="w-full shrink-0 md:w-56">
            {SECTIONS.map((section) => (
              <TabsTrigger key={section.id} value={section.id} className="gap-2">
                <section.icon className="size-4" />
                {section.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="min-w-0 flex-1">
            <TabsContent value="profile">
              <ProfileSection user={user} />
            </TabsContent>
            <TabsContent value="models">
              <ModelsSection />
            </TabsContent>
            <TabsContent value="frameworks">
              <FrameworksSection />
            </TabsContent>
            <TabsContent value="github">
              <GithubSection />
            </TabsContent>
            <TabsContent value="billing">
              <BillingSection />
            </TabsContent>
            <TabsContent value="team">
              <TeamSection />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
