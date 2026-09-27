"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { backend } from "@/lib/backend";
import { completeAuthAndRedirect } from "@/lib/auth-redirect";

export function SignUpForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await backend.signUp(email, password, fullName);
    if (error) {
      setError(error);
      setLoading(false);
      return;
    }

    const user = await backend.getUser();
    if (!user) {
      // Supabase project has email confirmation enabled — no session yet.
      setNeedsConfirmation(true);
      setLoading(false);
      return;
    }

    await completeAuthAndRedirect(router);
  }

  if (needsConfirmation) {
    return (
      <Alert>
        <MailCheck className="size-4" />
        <AlertTitle>Check your inbox</AlertTitle>
        <AlertDescription>
          We sent a confirmation link to {email}. Click it, then come back and sign in.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ada Lovelace"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full gap-2" disabled={loading}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        Create account
      </Button>
    </form>
  );
}
