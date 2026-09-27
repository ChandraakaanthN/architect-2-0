"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { GithubMark } from "@/components/icons/github-mark";

const CONNECTED_KEY = "architect2.github_connected";
const USERNAME_KEY = "architect2.github_username";
const FAKE_USERNAME = "architect-demo-user";

function readStoredConnected(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(CONNECTED_KEY) === "true";
}

function readStoredUsername(): string {
  if (typeof window === "undefined") return FAKE_USERNAME;
  return window.localStorage.getItem(USERNAME_KEY) ?? FAKE_USERNAME;
}

export function GithubSection() {
  const [connected, setConnected] = useState<boolean>(readStoredConnected);
  const [username, setUsername] = useState<string>(readStoredUsername);
  const [connecting, setConnecting] = useState(false);

  async function handleConnect() {
    setConnecting(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    window.localStorage.setItem(CONNECTED_KEY, "true");
    window.localStorage.setItem(USERNAME_KEY, FAKE_USERNAME);
    setUsername(FAKE_USERNAME);
    setConnected(true);
    setConnecting(false);
    toast.success("GitHub connected");
  }

  function handleDisconnect() {
    window.localStorage.setItem(CONNECTED_KEY, "false");
    setConnected(false);
    toast.success("GitHub disconnected");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>GitHub</CardTitle>
        <CardDescription>
          Connect GitHub to import repos, push commits from generated projects, and open pull requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="flex items-center gap-3 rounded-xl border p-4">
            <span className="flex size-9 items-center justify-center rounded-full bg-muted">
              <GithubMark className="size-5" />
            </span>
            <div className="flex-1">
              <div className="font-medium">@{username}</div>
              <div className="text-xs text-muted-foreground">Connected</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
            <GithubMark className="size-5" />
            Not connected yet — connect to import repos and push generated code.
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-end">
        {connected ? (
          <Button variant="outline" onClick={handleDisconnect}>
            Disconnect
          </Button>
        ) : (
          <Button onClick={handleConnect} disabled={connecting} className="gap-2">
            {connecting ? <Loader2 className="size-4 animate-spin" /> : <GithubMark className="size-4" />}
            Connect GitHub
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
