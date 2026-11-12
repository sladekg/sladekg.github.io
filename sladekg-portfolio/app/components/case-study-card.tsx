"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { formatTopic, projectSlug, type Project } from "../lib/portfolio";

type CaseStudyCardProps = {
  project: Project;
  index: number;
};

export default function CaseStudyCard({
  project,
  index,
}: CaseStudyCardProps) {
  const cover = project.images.find((image) =>
    /\.(jpe?g|webp|avif)$/i.test(image.src),
  );
  const [showCover, setShowCover] = useState(Boolean(cover));

  return (
    <Link
      className="case-study-card"
      href={`/projects/${projectSlug(project.title)}`}
      style={{ animationDelay: `${index * 90 + 100}ms` }}
      aria-label={`Read the ${project.title} project story. ${
        project.impact.value !== null ? `${project.impact.value} ` : ""
      }${project.impact.description}.`}
    >
      <div
        className={showCover && cover ? "card-art card-art-photo" : "card-art"}
        style={
          showCover && cover
            ? { aspectRatio: "1", minHeight: 0, background: "#2a2a2a" }
            : undefined
        }
        aria-hidden="true"
      >
        {showCover && cover ? (
          <Image
            className="card-photo"
            src={cover.src}
            alt=""
            fill
            sizes="(max-width: 760px) 88vw, 485px"
            style={{ objectFit: "contain" }}
            onError={() => setShowCover(false)}
          />
        ) : (
          <>
            <span className="art-shape art-shape-one" />
            <span className="art-shape art-shape-two" />
            <svg className="art-doodle" viewBox="0 0 220 120" fill="none">
              <path d="M8 80C40 22 63 109 100 57S163 15 212 43" />
              <path d="M24 98C62 76 77 115 114 85S171 60 198 78" />
            </svg>
            <span className="art-label">
              {project.title.slice(0, 2).toUpperCase()}
            </span>
          </>
        )}
      </div>
      <div className="card-copy">
        <div className="card-meta">
          <span className="card-count">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3>{project.title}</h3>
        <div className="card-topics" aria-label="Project disciplines">
          {project.topics.map((topic) => (
            <span key={topic}>{formatTopic(topic)}</span>
          ))}
        </div>
        <p className="card-context">{project.case_study.summary}</p>
        <div className="card-impact">
          <div className="card-impact-result">
            {project.impact.value !== null && (
              <strong className="card-impact-value">
                {project.impact.value}
              </strong>
            )}
            <p className="card-impact-description">
              {project.impact.description}
            </p>
          </div>
        </div>
        <span className="project-card-link">Read project story</span>
      </div>
    </Link>
  );
}
