import Link from "next/link";
import { notFound } from "next/navigation";
import portfolioContent from "../../../public/content.json";
import { formatTopic, projectSlug, type Project } from "../../lib/portfolio";

const projects: Project[] = portfolioContent.projects;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: projectSlug(project.title) }));
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const projectIndex = projects.findIndex(
    (item) => projectSlug(item.title) === slug,
  );
  const project = projects[projectIndex];

  if (projectIndex === -1 || !project) notFound();

  return (
    <main className="project-page">
      <div className="hero-meta">
        <Link
          className="wordmark"
          href="/"
          aria-label="Gabrielle Sladek, home"
        >
          GMS<span>.</span>
        </Link>
        <nav className="project-main-nav" aria-label="Main navigation">
          <div className="nav-actions">
            <Link className="nav-button" href="/#work">Work</Link>
            <Link className="nav-button" href="/#about">About</Link>
            <Link className="nav-button" href="/#contact">Contact</Link>
          </div>
        </nav>
        <span className="hero-location">Working everywhere</span>
      </div>

      <header className="project-hero">
        <div className="project-hero-inner">
          <div className="project-hero-topline">
            <Link className="back-to-projects" href="/#work">
              <span aria-hidden="true">←</span>
              All projects
            </Link>
            <span className="project-file-number">
              Case file {String(projectIndex + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="project-hero-grid">
            <div className="project-hero-copy">
              <p className="project-eyebrow">Selected work / Case study</p>
              <h1>{project.title}</h1>
              <p className="project-lede">{project.case_study.summary}</p>
              <div className="project-topic-list" aria-label="Project disciplines">
                {project.topics.map((topic) => (
                  <span key={topic}>{formatTopic(topic)}</span>
                ))}
              </div>
            </div>

            <div className="project-cover-art" aria-hidden="true">
              <span className="project-cover-orbit project-cover-orbit-one" />
              <span className="project-cover-orbit project-cover-orbit-two" />
              <svg
                className="project-cover-line"
                viewBox="0 0 360 260"
                fill="none"
                aria-hidden="true"
              >
                <path d="M12 190C73 18 115 236 183 122S289 18 348 70" />
                <path d="M20 220C91 91 135 258 201 165S284 80 339 116" />
              </svg>
              <span className="project-cover-initial">
                {project.title.slice(0, 1)}
              </span>
              <span className="project-cover-index">
                {String(projectIndex + 1).padStart(2, "0")}
              </span>
              <span className="project-cover-caption">
                <span>PROJECT FOCUS</span>
                <strong>
                  {project.topics[0] ? formatTopic(project.topics[0]) : "Design"}
                </strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      <section className="project-overview" aria-label="Project snapshot">
        <div className="project-overview-heading">
          <span>At a glance</span>
          <span aria-hidden="true">✳</span>
        </div>
        <div className="project-facts">
          <div>
            <span className="project-fact-label">Role</span>
            <span>{project.case_study.my_role}</span>
          </div>
          <div>
            <span className="project-fact-label">Disciplines</span>
            <span>{project.topics.map(formatTopic).join(", ")}</span>
          </div>
          <div>
            <span className="project-fact-label">Awards</span>
            <span>
              {project.awards} {project.awards === 1 ? "award" : "awards"}
            </span>
          </div>
        </div>
      </section>

      <section className="project-story" aria-label={`${project.title} case study`}>
        <div className="project-story-heading">
          <p>Inside the project</p>
          <h2>From the first question to the final outcome.</h2>
        </div>

        <div className="project-narrative">
          <section className="project-chapter project-chapter-context">
            <div className="project-chapter-heading">
              <span>01</span>
              <h3>The challenge</h3>
            </div>
            <p>{project.case_study.context}</p>
          </section>

          <section className="project-chapter project-chapter-approach">
            <div className="project-chapter-heading">
              <span>02</span>
              <h3>The approach</h3>
            </div>
            <p>{project.case_study.action}</p>
          </section>

          <section className="project-chapter project-chapter-outcome">
            <div className="project-chapter-heading">
              <span>03</span>
              <h3>The outcome</h3>
            </div>
            <div className="project-outcome-copy">
              <p>{project.case_study.result}</p>
              <div className="project-impact">
                <span className="project-fact-label">Impact</span>
                {project.impact.value && (
                  <strong className="project-impact-value">
                    {project.impact.value}
                  </strong>
                )}
                <p>{project.impact.description}</p>
              </div>
            </div>
          </section>

          {project.presentation && (
            <a
              className="project-presentation-link"
              href={project.presentation}
              target="_blank"
              rel="noreferrer"
            >
              <span>Explore the full presentation</span>
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>

      <footer className="project-page-footer">
        <p>More thoughtful work, one story at a time.</p>
        <Link href="/#work">Back to all projects</Link>
      </footer>
    </main>
  );
}
