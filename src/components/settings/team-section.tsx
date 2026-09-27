"use client";

import { useState } from "react";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Role = "Owner" | "Admin" | "Member";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
}

const ROLE_BADGE_VARIANT: Record<Role, "default" | "secondary" | "outline"> = {
  Owner: "default",
  Admin: "secondary",
  Member: "outline",
};

const INITIAL_MEMBERS: TeamMember[] = [
  { id: "1", name: "You", email: "you@architect.dev", role: "Owner", joined: "Jan 12, 2026" },
  { id: "2", name: "Maya Chen", email: "maya@architect.dev", role: "Admin", joined: "Feb 3, 2026" },
  { id: "3", name: "Diego Alvarez", email: "diego@architect.dev", role: "Member", joined: "Mar 21, 2026" },
];

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function TeamSection() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Member");

  function handleInvite() {
    const email = inviteEmail.trim();
    if (!email) {
      toast.error("Enter an email address to invite");
      return;
    }

    const name = email.split("@")[0].replace(/[._-]/g, " ");
    const newMember: TeamMember = {
      id: crypto.randomUUID(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
      role: inviteRole,
      joined: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteOpen(false);
    setInviteEmail("");
    setInviteRole("Member");
    toast.success(`Invite sent to ${email}`);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Team</CardTitle>
          <CardDescription>
            Team workspaces are dummy in this demo — invites don&apos;t send real emails.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium">
                      <span className="flex size-6 items-center justify-center rounded-full bg-muted text-xs">
                        {initials(member.name)}
                      </span>
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.email}</TableCell>
                  <TableCell>
                    <Badge variant={ROLE_BADGE_VARIANT[member.role]}>{member.role}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{member.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => setInviteOpen(true)} className="gap-1.5">
          <UserPlus className="size-4" />
          Invite member
        </Button>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
            <DialogDescription>They&apos;ll get access to this workspace&apos;s projects.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="teammate@company.com"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as Role)}>
                <SelectTrigger id="invite-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
