import {
  Bot,
  FileCode,
  LayoutPanelLeft,
  Server,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  "layout-panel-left": LayoutPanelLeft,
  workflow: Workflow,
  users: Users,
  bot: Bot,
  server: Server,
  file: FileCode,
};

export function TemplateIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICON_MAP[icon] ?? FileCode;
  return <Icon className={className} />;
}
