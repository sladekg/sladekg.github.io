"use client";

import Link from "next/link";
import { useState } from "react";
import { projectSlug, type Project } from "../lib/portfolio";

type CaseStudyCardProps = {
  project: Project;
};

export default function CaseStudyCard({ project }: CaseStudyCardProps) {
  const cover = project.images.find((image) =>
    /\.(png|jpe?g|webp|avif)$/i.test(image.src),
  );
  const [showCover, setShowCover] = useState(Boolean(cover));
  const impact = `${project.impact.value ? `${project.impact.value} ` : ""}${project.impact.description}`;

  return (
    <Link
      className="case-study-card"
      href={`/projects/${projectSlug(project.title)}`}
      aria-label={`Read the ${project.title} project story. ${impact}.`}
    >
      <span className="card-frame">
        {showCover && cover ? (
          // next/image does not call onError when the file is missing.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover.src} alt="" onError={() => setShowCover(false)} />
        ) : (
          <span className="card-initials" aria-hidden="true">
            {project.title.slice(0, 2).toUpperCase()}
          </span>
        )}
      </span>
      <span className="card-caption">
        <strong>{project.title}</strong>
        <span>{impact}</span>
      </span>
    </Link>
  );
}
