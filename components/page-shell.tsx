export function PageShell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
      <div className="mb-6">
        {eyebrow ? <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-moss">{eyebrow}</p> : null}
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
      </div>
      {children}
    </main>
  );
}
