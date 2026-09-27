"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GithubMark } from "@/components/icons/github-mark";
import { backend } from "@/lib/backend";
import { completeAuthAndRedirect } from "@/lib/auth-redirect";

function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.46c-.28 1.5-1.13 2.78-2.4 3.63v3.02h3.88c2.27-2.09 3.58-5.17 3.58-8.84Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.9l-3.88-3.02c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.11A12 12 0 0 0 12 24Z"
      />
      <path fill="#FBBC05" d="M5.29 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.28a12 12 0 0 0 0 10.8l4.01-3.11Z" />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.28 6.6l4.01 3.11C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function OAuthButtons({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter();
  const [githubOpen, setGithubOpen] = useState(false);
  const [authorizing, setAuthorizing] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function demoSignIn(email: string, fullName: string) {
    const { error } = await backend.signIn(email, "demo-oauth-pass");
    if (error) {
      await backend.signUp(email, "demo-oauth-pass", fullName);
    }
    await completeAuthAndRedirect(router);
  }

  async function handleAuthorizeGithub() {
    setAuthorizing(true);
    await new Promise((r) => setTimeout(r, 900));
    await demoSignIn("you@github-demo.dev", "GitHub Demo User");
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="gap-2"
          disabled={loadingGoogle}
          onClick={async () => {
            setLoadingGoogle(true);
            await demoSignIn("you@google-demo.dev", "Google Demo User");
          }}
        >
          {loadingGoogle ? <Loader2 className="size-4 animate-spin" /> : <GoogleMark className="size-4" />}
          Google
        </Button>
        <Button variant="outline" className="gap-2" onClick={() => setGithubOpen(true)}>
          <GithubMark className="size-4" />
          GitHub
        </Button>
      </div>

      <Dialog open={githubOpen} onOpenChange={setGithubOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mb-1 flex items-center gap-2">
              <GithubMark className="size-5" />
              <span className="text-sm text-muted-foreground">github.com</span>
            </div>
            <DialogTitle>Authorize Architect</DialogTitle>
            <DialogDescription>
              Architect wants to access your GitHub account to {mode === "sign-up" ? "create your account and " : ""}
              read your repositories, create branches, and open pull requests.
            </DialogDescription>
          </DialogHeader>

          <ul className="my-2 space-y-1.5 text-sm text-muted-foreground">
            <li>· Read access to code and metadata</li>
            <li>· Read and write access to pull requests</li>
            <li>· Read access to your email address</li>
          </ul>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button variant="outline" onClick={() => setGithubOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAuthorizeGithub} disabled={authorizing} className="gap-2">
              {authorizing && <Loader2 className="size-4 animate-spin" />}
              Authorize Architect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
