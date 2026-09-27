import { CheckIcon, CircleDashedIcon, Loader2Icon, XIcon } from "lucide-react";
import type { PlanStep } from "@/lib/types";

const STATUS_STYLE: Record<PlanStep["status"], string> = {
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  active: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  pending: "bg-muted text-muted-foreground",
  error: "bg-destructive/15 text-destructive",
};

function StatusIcon({ status }: { status: PlanStep["status"] }) {
  if (status === "done") return <CheckIcon className="size-3.5" />;
  if (status === "active") return <Loader2Icon className="size-3.5 animate-spin" />;
  if (status === "error") return <XIcon className="size-3.5" />;
  return <CircleDashedIcon className="size-3.5" />;
}

export function PlanTimeline({ steps }: { steps: PlanStep[] }) {
  return (
    <ol className="space-y-1">
      {steps.map((step, i) => (
        <li key={step.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <span className={`flex size-6 shrink-0 items-center justify-center rounded-full ${STATUS_STYLE[step.status]}`}>
              <StatusIcon status={step.status} />
            </span>
            {i < steps.length - 1 && <span className="mt-0.5 w-px flex-1 bg-border" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium">{step.title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{step.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
