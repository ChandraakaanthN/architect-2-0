import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { OAuthButtons } from "@/components/auth/oauth-buttons";
import { Separator } from "@/components/ui/separator";

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create your account"
      subtitle="Start building in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-foreground underline underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <div className="space-y-4">
        <OAuthButtons mode="sign-up" />
        <div className="relative">
          <Separator />
          <span className="absolute inset-x-0 -top-2.5 mx-auto w-fit bg-card px-2 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>
        <SignUpForm />
      </div>
    </AuthCard>
  );
}
