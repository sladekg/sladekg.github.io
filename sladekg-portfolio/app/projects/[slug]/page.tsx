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
  const project = projects.find(
    (item) => projectSlug(item.title) === slug,
  );

  if (!project) notFound();

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
        <Link className="project-home-link" href="/#work">
          All projects <span aria-hidden="true">↗</span>
        </Link>
      </div>

      <header className="project-hero">
        <div className="project-hero-inner">
          <Link className="back-to-projects" href="/#work">
            <span aria-hidden="true">←</span> Selected work
          </Link>
          <p className="section-kicker">Project story</p>
          <h1>{project.title}</h1>
          <p className="project-lede">{project.case_study.summary}</p>
          <div className="project-topic-list" aria-label="Project disciplines">
            {project.topics.map((topic) => (
              <span key={topic}>{formatTopic(topic)}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="project-story" aria-label={`${project.title} case study`}>
        <div className="project-facts">
          <div>
            <span className="project-fact-label">My role</span>
            <span>{project.case_study.my_role}</span>
          </div>
          <div>
            <span className="project-fact-label">Disciplines</span>
            <span>{project.topics.map(formatTopic).join(", ")}</span>
          </div>
          <div>
            <span className="project-fact-label">Awards</span>
            <span>{project.awards}</span>
          </div>
        </div>

        <div className="project-narrative">
          <section className="project-chapter">
            <div className="project-chapter-heading">
              <span>01</span>
              <h2>The context</h2>
            </div>
            <p>{project.case_study.context}</p>
          </section>

          <section className="project-chapter project-chapter-accent">
            <div className="project-chapter-heading">
              <span>02</span>
              <h2>The approach</h2>
            </div>
            <p>{project.case_study.action}</p>
          </section>

          <section className="project-chapter">
            <div className="project-chapter-heading">
              <span>03</span>
              <h2>The outcome</h2>
            </div>
            <p>{project.case_study.result}</p>
          </section>

          {project.presentation && (
            <a
              className="project-presentation-link"
              href={project.presentation}
              target="_blank"
              rel="noreferrer"
            >
              View project presentation <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>

      <footer className="project-page-footer">
        <p>More thoughtful work, one story at a time.</p>
        <Link href="/#work">Back to all projects <span aria-hidden="true">↑</span></Link>
      </footer>
    </main>
  );
}
