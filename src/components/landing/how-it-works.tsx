const STEPS = [
  {
    step: "01",
    title: "Prompt",
    description: "Describe the app or agent you want, or import an existing GitHub repo.",
  },
  {
    step: "02",
    title: "Watch it get built",
    description: "The agent plans, writes files, installs packages, and runs commands — visibly.",
  },
  {
    step: "03",
    title: "Preview & iterate",
    description: "Click around the live preview, then just tell it what to change next.",
  },
  {
    step: "04",
    title: "Push & deploy",
    description: "Commit to GitHub and deploy to production, all without leaving the chat.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-12 text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          How it works
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.step} className="relative">
              <div className="text-sm font-mono text-muted-foreground">{s.step}</div>
              <h3 className="mt-2 font-medium">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
