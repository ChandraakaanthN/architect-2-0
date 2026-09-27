"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthUser } from "@/lib/backend";

function initialsFrom(name: string, email: string) {
  const source = name.trim() || email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function ProfileSection({ user }: { user: AuthUser }) {
  const [fullName, setFullName] = useState(user.full_name ?? "");
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaving(false);
    toast.success("Profile updated");
  }

  function handleDelete() {
    setDeleteOpen(false);
    toast.error("Account deletion is disabled in this demo");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your name and see the email associated with your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="text-base font-medium">
                {initialsFrom(fullName, user.email)}
              </AvatarFallback>
            </Avatar>
            <p className="text-sm text-muted-foreground">
              This is how your avatar appears across Architect.
            </p>
          </div>

          <div className="grid gap-2 sm:max-w-sm">
            <Label htmlFor="full-name">Full name</Label>
            <Input
              id="full-name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-2 sm:max-w-sm">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} readOnly disabled />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="size-4 animate-spin" />}
            Save changes
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Danger zone</CardTitle>
          <CardDescription>Permanently delete your account and all associated projects.</CardDescription>
        </CardHeader>
        <CardFooter className="justify-end">
          <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
            Delete account
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account, all projects, and deployments. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
