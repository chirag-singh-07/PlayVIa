import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

interface Props {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  toc?: { id: string; label: string }[];
  children: React.ReactNode;
}

export function LegalLayout({ title, subtitle, lastUpdated, toc, children }: Props) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-28 md:pt-36 pb-12 md:pb-16 border-b border-border">
          <div className="absolute inset-0 bg-gradient-hero pointer-events-none" />
          <div className="container relative max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>}
            {lastUpdated && (
              <p className="mt-4 text-sm text-muted-foreground">
                Last updated: <span className="font-medium text-foreground">{lastUpdated}</span>
              </p>
            )}
          </div>
        </section>

        {/* Content with optional TOC */}
        <section className="py-12 md:py-16">
          <div className="container max-w-6xl">
            <div className={toc ? "grid lg:grid-cols-[220px_1fr] gap-10" : ""}>
              {toc && (
                <aside className="hidden lg:block">
                  <div className="sticky top-24">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                      On this page
                    </div>
                    <nav className="space-y-1.5 text-sm border-l border-border">
                      {toc.map((t) => (
                        <a
                          key={t.id}
                          href={`#${t.id}`}
                          className="block pl-4 -ml-px border-l-2 border-transparent hover:border-primary text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                          {t.label}
                        </a>
                      ))}
                    </nav>
                  </div>
                </aside>
              )}
              <article className="max-w-[800px] mx-auto prose-content">{children}</article>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
