import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}>
      <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M12 3 L21 20 H3 Z" strokeLinejoin="round" strokeLinecap="round" />
          <path d="M12 9 L16.5 18 H7.5 Z" fill="currentColor" stroke="none" />
        </svg>
      </span>
      Architect
    </div>
  );
}
