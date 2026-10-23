type CaseStudyCardProps = {
  project: {
    title: string;
    awards: number;
    presentation: string;
  };
  caseStudy: {
    summary: string;
    context: string;
    my_role: string;
    action: string;
    result: string;
  };
  categoryLabel: string;
  index: number;
};

export default function CaseStudyCard({
  project,
  caseStudy,
  categoryLabel,
  index,
}: CaseStudyCardProps) {
  return (
    <article
      className="case-study-card"
      style={{ animationDelay: `${index * 90 + 100}ms` }}
    >
      <div className="card-art" aria-hidden="true">
        <span className="art-orbit art-orbit-one" />
        <span className="art-orbit art-orbit-two" />
        <span className="art-spark">✳</span>
        <span className="art-label">
          {project.title.slice(0, 2).toUpperCase()}
        </span>
        <span className="art-caption">A case study</span>
      </div>
      <div className="card-copy">
        <div className="card-meta">
          <span>{categoryLabel}</span>
          <span>{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>{project.title}</h3>
        <div className="card-awards" aria-label={`Award count for ${project.title}`}>
          <span className="card-award-label">Awards</span>
          <strong>{project.awards ?? 0}</strong>
        </div>
        {caseStudy.summary && (
          <p className="card-summary card-context">{caseStudy.summary}</p>
        )}
        <p className="card-context">{caseStudy.context}</p>
        <dl className="card-details">
          <div>
            <dt>My role</dt>
            <dd>{caseStudy.my_role}</dd>
          </div>
          <div>
            <dt>The approach</dt>
            <dd>{caseStudy.action}</dd>
          </div>
          <div>
            <dt>The outcome</dt>
            <dd>{caseStudy.result}</dd>
          </div>
        </dl>
        {project.presentation && (
          <a
            className="presentation-link"
            href={project.presentation}
            target="_blank"
            rel="noreferrer"
          >
            View presentation
          </a>
        )}
      </div>
    </article>
  );
}
