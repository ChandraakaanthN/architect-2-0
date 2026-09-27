import Link from "next/link";
import { Logo } from "@/components/logo";

export function LandingFooter() {
  return (
    <footer className="border-t px-4 py-10 sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
        <Logo className="text-foreground" />
        <p>Built for the Architect 2.0 challenge — every flow on this site is a working or simulated demo.</p>
        <div className="flex gap-4">
          <Link href="/sign-in" className="hover:text-foreground">
            Sign in
          </Link>
          <Link href="/sign-up" className="hover:text-foreground">
            Get started
          </Link>
        </div>
      </div>
    </footer>
  );
}
