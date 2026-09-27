import { PlanTimeline } from "@/components/workspace/plan-timeline";
import { ToolCallLog } from "@/components/workspace/tool-call-log";
import type { PlanStep, ToolCall } from "@/lib/types";

export function AgentPanel({ plan, toolCalls }: { plan: PlanStep[]; toolCalls: ToolCall[] }) {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 divide-y overflow-y-auto md:grid-cols-2 md:divide-x md:divide-y-0">
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">Plan</h3>
        <PlanTimeline steps={plan} />
      </div>
      <div className="p-4">
        <h3 className="mb-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Tool calls
        </h3>
        <ToolCallLog calls={toolCalls} />
      </div>
    </div>
  );
}
