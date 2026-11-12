import Link from "next/link";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="project-page">
      <div className="hero-meta">
        <Link className="wordmark" href="/" aria-label="Gabrielle Sladek, home">
          GMS<span>.</span>
        </Link>
        <nav className="project-main-nav" aria-label="Main navigation">
          <div className="nav-actions">
            <Link className="nav-button" href="/#work">
              Work
            </Link>
            <Link className="nav-button" href="/#about">
              About
            </Link>
            <Link className="nav-button" href="/#contact">
              Contact
            </Link>
          </div>
        </nav>
        <span className="hero-location">Working everywhere</span>
      </div>
      {children}
      <footer className="project-page-footer">
        <p>More thoughtful work, one story at a time.</p>
        <Link href="/#work">Back to all projects</Link>
      </footer>
    </main>
  );
}
