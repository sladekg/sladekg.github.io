"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatTopic, type Project, type ProjectStory } from "../lib/portfolio";

type StoryLayoutProps = {
  project: Project & { story: ProjectStory };
};

export default function StoryLayout({ project }: StoryLayoutProps) {
  const { story } = project;
  const navItems = [
    { id: "tldr", label: "TL;DR" },
    ...story.sections.map((section) => ({
      id: section.id,
      label: section.label,
    })),
  ];
  const [activeId, setActiveId] = useState(navItems[0]?.id ?? "tldr");

  useEffect(() => {
    const ids = ["tldr", ...story.sections.map((section) => section.id)];

    const update = () => {
      const marker = window.scrollY + 340;
      let current = ids[0] ?? "tldr";

      for (const id of ids) {
        const section = document.getElementById(id);
        if (!section) continue;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= marker) current = id;
      }

      setActiveId(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("scrollend", update);
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("scrollend", update);
      window.removeEventListener("hashchange", update);
    };
  }, [story]);

  useEffect(() => {
    const sections = document.querySelectorAll(".story-column .story-section");
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.16 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [story]);

  return (
    <div className="story-shell">
      <aside className="story-nav" aria-label="Project sections">
        <Link className="back-to-projects story-back" href="/#work">
          <svg className="story-back-icon" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M10 3.25 5.25 8 10 12.75" />
          </svg>
          Back
        </Link>
        <nav className="story-nav-list">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={item.id === activeId ? "is-active" : undefined}
              aria-current={item.id === activeId ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      <article className="story-column">
        <header className="story-hero">
          {story.eyebrow && <p className="project-eyebrow">{story.eyebrow}</p>}
          <h1>{project.title}</h1>
          <div className="project-topic-list" aria-label="Project disciplines">
            {project.topics.map((topic) => (
              <span key={topic}>{formatTopic(topic)}</span>
            ))}
          </div>
          {project.images[0] && (
            <figure className="story-cover">
              <Image
                src={project.images[0].src}
                alt={project.images[0].alt}
                width={720}
                height={720}
                sizes="(max-width: 760px) 88vw, 720px"
                priority
              />
            </figure>
          )}
        </header>

        <section id="tldr" className="story-section story-tldr">
          <p className="story-kicker">TL;DR</p>
          {story.tldr.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>

        {story.facts.length > 0 && (
          <dl className="story-facts">
            {story.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {story.sections.map((section, sectionIndex) => (
          <section key={section.id} id={section.id} className="story-section">
            <p className="story-kicker">{section.label}</p>
            <div className="story-step">
              <span className="story-step-number" aria-hidden="true">
                {String(sectionIndex + 1).padStart(2, "0")}
              </span>
              <div className="story-step-body">
                <h2>{section.title}</h2>
                {section.images?.map((image) => (
                  <figure key={image.src} className="story-figure">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={720}
                      height={480}
                      sizes="(max-width: 760px) 88vw, 720px"
                    />
                  </figure>
                ))}
                {section.quote && <blockquote>{section.quote}</blockquote>}
                {section.paragraphs?.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="story-subsections">
                    {section.subsections.map((subsection, stepIndex) => (
                      <div className="story-step" key={subsection.title}>
                        <span className="story-step-number" aria-hidden="true">
                          {String(stepIndex + 1).padStart(2, "0")}
                        </span>
                        <div className="story-step-body">
                          <h3>{subsection.title}</h3>
                          <p>{subsection.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {section.stats && section.stats.length > 0 && (
                  <div className="story-stats">
                    {section.stats.map((stat) => (
                      <div key={`${stat.value}-${stat.label}`}>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                {section.id === "final-product" && project.presentation && (
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
            </div>
          </section>
        ))}
      </article>
    </div>
  );
}
