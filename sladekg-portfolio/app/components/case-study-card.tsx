import Link from "next/link";
import { formatTopic, projectSlug, type Project } from "../lib/portfolio";

type CaseStudyCardProps = {
  project: Project;
  index: number;
};

export default function CaseStudyCard({
  project,
  index,
}: CaseStudyCardProps) {
  return (
    <Link
      className="case-study-card"
      href={`/projects/${projectSlug(project.title)}`}
      style={{ animationDelay: `${index * 90 + 100}ms` }}
      aria-label={`Read the ${project.title} project story`}
    >
      <div className="card-art" aria-hidden="true">
        <span className="art-shape art-shape-one" />
        <span className="art-shape art-shape-two" />
        <svg className="art-doodle" viewBox="0 0 220 120" fill="none">
          <path d="M8 80C40 22 63 109 100 57S163 15 212 43" />
          <path d="M24 98C62 76 77 115 114 85S171 60 198 78" />
        </svg>
        <span className="art-label">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
        <span className="art-caption">Project notes</span>
      </div>
      <div className="card-copy">
        <div className="card-meta">
          <span className="card-category">Selected work</span>
          <span className="card-count">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>{project.title}</h3>
        <div className="card-topics" aria-label="Project disciplines">
          {project.topics.map((topic) => (
            <span key={topic}>{formatTopic(topic)}</span>
          ))}
        </div>
        <p className="card-context">{project.case_study.summary}</p>
        <span className="project-card-link">Read project story <span aria-hidden="true">↗</span></span>
      </div>
    </Link>
  );
}
