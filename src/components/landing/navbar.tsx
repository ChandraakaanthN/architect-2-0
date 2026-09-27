import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#for-technical", label: "For developers" },
  { href: "#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/sign-in">Sign in</Link>} />
          <Button size="sm" nativeButton={false} render={<Link href="/sign-up">Get started</Link>} />
        </div>
      </div>
    </header>
  );
}
