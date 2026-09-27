import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue to your projects."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-2">
            Create one
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <OAuthButtons mode="sign-in" />
        <div className="relative">
          <Separator />
          <span className="absolute inset-x-0 -top-2.5 mx-auto w-fit bg-card px-2 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>
        <SignInForm />
      </div>
    </AuthCard>
  );
}
