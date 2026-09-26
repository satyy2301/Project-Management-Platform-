interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center ambient-bg dot-grid-bg bg-[var(--background)] py-12 px-4 sm:px-6">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="text-center">
          <h1
            className="text-4xl font-bold brand-text mb-2"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            TaskFlow
          </h1>
          <h2 className="text-2xl font-semibold text-[var(--foreground)]">{title}</h2>
          <p className="mt-2 text-[var(--foreground-muted)]">{subtitle}</p>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
