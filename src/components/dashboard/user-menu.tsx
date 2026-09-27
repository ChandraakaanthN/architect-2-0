"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { backend } from "@/lib/backend";
import type { AuthUser } from "@/lib/backend";

function getInitials(user: AuthUser) {
  const source = user.full_name?.trim() || user.email;
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function UserMenu({ user }: { user: AuthUser }) {
  const router = useRouter();

  async function handleSignOut() {
    await backend.signOut();
    router.push("/");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            <Avatar>
              <AvatarFallback>{getInitials(user)}</AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 font-normal">
          <span className="truncate text-sm font-medium">{user.full_name || "Your account"}</span>
          <span className="truncate text-xs text-muted-foreground">{user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/settings">
              <Settings className="size-4" />
              Settings
            </Link>
          }
        />
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
