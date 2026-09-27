import type { useRouter } from "next/navigation";
import { backend } from "@/lib/backend";
import { TEMPLATES } from "@/lib/demo-data";
import { clearPendingPrompt, readPendingPrompt } from "@/lib/pending-prompt";

/** After a successful sign-in/sign-up: resume a pending landing-page prompt, or go to the dashboard. */
export async function completeAuthAndRedirect(router: ReturnType<typeof useRouter>) {
  const pending = readPendingPrompt();

  if (pending) {
    clearPendingPrompt();
    const template = TEMPLATES.find((t) => t.id === pending.templateId) ?? TEMPLATES[0];
    const project = await backend.createProject({
      name: pending.prompt.slice(0, 48),
      description: pending.prompt,
      framework: template.framework,
      template: template.id,
      model: pending.modelId,
    });
    await backend.addMessage(project.id, "user", pending.prompt);
    router.push(`/projects/${project.id}`);
    return;
  }

  router.push("/dashboard");
}
