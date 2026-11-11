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
    <main className="project-page case-study-page">
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

      <Link className="back-to-projects" href="/#work">
        <span aria-hidden="true">←</span>
        All projects
      </Link>

      <header className="case-study-hero">
        <div className="case-study-hero-inner">
          <div className="case-study-cover">
            <span className="case-study-cover-index">
              Story {String(projectIndex + 1).padStart(2, "0")}
            </span>
            <span className="case-study-cover-initial" aria-hidden="true">
              {project.title.slice(0, 1)}
            </span>
            <span className="case-study-cover-caption">
              {project.topics[0]
                ? formatTopic(project.topics[0])
                : "Selected work"}
            </span>
          </div>

          <div className="case-study-hero-copy">
            <p className="case-study-eyebrow">Selected work / Case study</p>
            <h1>{project.title}</h1>
            <div className="case-study-tldr">
              <span>TL;DR</span>
              <p>{project.case_study.summary}</p>
            </div>
            <dl className="case-study-meta">
              <div>
                <dt>My role</dt>
                <dd>{project.case_study.my_role}</dd>
              </div>
              <div>
                <dt>Focus</dt>
                <dd>{project.topics.map(formatTopic).join(" · ")}</dd>
              </div>
            </dl>
          </div>
        </div>
      </header>

      <article
        className="case-study-story"
        aria-label={`${project.title} case study`}
      >
        <section className="story-opening">
          <div className="story-section-label">
            <span>01</span>
            <p>Background</p>
          </div>
          <div className="story-opening-copy">
            <p className="story-overline">The challenge</p>
            <h2>First, understand the problem.</h2>
            <p className="story-body">{project.case_study.context}</p>
          </div>
        </section>

        <section className="story-process" aria-labelledby="process-title">
          <div className="story-process-heading">
            <div className="story-section-label">
              <span>02</span>
              <p>Process</p>
            </div>
            <div>
              <p className="story-overline">From insight to action</p>
              <h2 id="process-title">Designing a way forward.</h2>
            </div>
          </div>

          <ol className="story-chapters">
            {project.case_study.action.map((action, index) => (
              <li className="story-chapter" key={action.action_title}>
                <span className="story-chapter-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{action.action_title}</h3>
                  <p>{action.action_description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="story-outcome">
          <div className="story-section-label">
            <span>03</span>
            <p>Outcome</p>
          </div>
          <div className="story-outcome-copy">
            <p className="story-overline">Where the work led</p>
            <h2>What changed.</h2>
            <p className="story-body">{project.case_study.result}</p>

            <div className="story-impact">
              <span className="story-impact-label">Impact</span>
              {project.impact.value && (
                <strong>{project.impact.value}</strong>
              )}
              <p>{project.impact.description}</p>
            </div>

            {project.presentation && (
              <a
                className="story-presentation-link"
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
      </article>

      <footer className="project-page-footer case-study-footer">
        <p>More thoughtful work, one story at a time.</p>
        <Link href="/#work">Back to all projects</Link>
      </footer>
    </main>
  );
}
