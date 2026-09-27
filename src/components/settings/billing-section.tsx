"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
}

const CURRENT_PLAN_ID = "free";

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/month",
    description: "For trying Architect out.",
    features: ["Up to 3 projects", "Community model access", "Basic deploys", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For builders shipping regularly.",
    features: ["Unlimited projects", "All models, incl. BYOK", "Priority build queue", "Custom domains"],
  },
  {
    id: "team",
    name: "Team",
    price: "$99",
    period: "/month",
    description: "For teams building together.",
    features: ["Everything in Pro", "Shared team workspace", "Role-based access", "SSO (coming soon)"],
  },
];

export function BillingSection() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>You&apos;re currently on the Free plan.</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        {PLANS.map((plan) => {
          const isCurrent = plan.id === CURRENT_PLAN_ID;
          return (
            <Card key={plan.id} className={cn(isCurrent && "ring-2 ring-primary")}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{plan.name}</CardTitle>
                  {isCurrent && <Badge>Current plan</Badge>}
                </div>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="size-3.5 shrink-0 text-foreground" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {isCurrent ? (
                  <Button variant="outline" disabled className="w-full">
                    Current plan
                  </Button>
                ) : (
                  <Button className="w-full" onClick={() => setDialogOpen(true)}>
                    Upgrade
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Billing isn&apos;t wired up in this demo</DialogTitle>
            <DialogDescription>
              This is where Stripe checkout would go. No charges happen here — it&apos;s just a preview of the
              upgrade flow.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)}>Got it</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
