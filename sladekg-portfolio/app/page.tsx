"use client";

import { useEffect, useState } from "react";
import CaseStudyCard from "./components/case-study-card";

const categories = [
  { id: "product_design", label: "Product design", number: "01" },
  { id: "product_strategy", label: "Product strategy", number: "02" },
  { id: "project_management", label: "Project management", number: "03" },
  { id: "seo", label: "SEO", number: "04" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

type CaseStudy = {
  topic: string;
  context: string;
  my_role: string;
  action: string;
  result: string;
};

type Project = {
  title: string;
  topics: string[];
  case_studies: CaseStudy[];
  images: { src: string; alt: string }[];
  presentation: string;
};

type PortfolioContent = {
  projects: Project[];
};

export default function Home() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryId>("product_design");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadContent() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/content.json", {
          cache: "no-store",
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `The case studies could not be loaded (${response.status}).`,
          );
        }

        const content = (await response.json()) as PortfolioContent;
        if (!Array.isArray(content.projects)) {
          throw new Error("The portfolio content has an unexpected format.");
        }

        setProjects(content.projects);
      } catch (loadError) {
        if (controller.signal.aborted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "The case studies could not be loaded.",
        );
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadContent();
    return () => controller.abort();
  }, [retryCount]);

  const selectedCategory = categories.find(
    (category) => category.id === activeCategory,
  );
  const caseStudies = projects.flatMap((project) =>
    project.case_studies
      .filter((caseStudy) => caseStudy.topic === activeCategory)
      .map((caseStudy) => ({ project, caseStudy })),
  );

  return (
    <main>
      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-meta">
          <a className="wordmark" href="#top" aria-label="Gabrielle Sladek, home">
            GMS<span>.</span>
          </a>
          <span className="hero-location">Milwaukee, WI · Working everywhere</span>
        </div>

        <div className="hero-intro">
          <h1 id="hero-title" className="hero-name">
            Gabrielle Sladek
          </h1>
          <div className="hero-roles" aria-label="Product designer and strategist">
            <span>Product Designer</span>
            <span className="role-ampersand" aria-hidden="true">
              &
            </span>
            <span className="role-script">Strategist</span>
          </div>
        </div>

        <a className="scroll-cue" href="#work">
          <span>Scroll to explore</span>
          <span className="scroll-cue-line" aria-hidden="true" />
        </a>
      </section>

      <nav className="folder-nav" aria-label="Main navigation">
        <div className="folder-nav-inner">
          <button
            className="nav-button"
            type="button"
            onClick={() =>
              document.getElementById("work")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }
          >
            Case studies
          </button>
          <button className="nav-button" type="button">
            About me
          </button>
          <button className="nav-button" type="button">
            Contact
          </button>
        </div>
      </nav>

      <section className="work-section" id="work" aria-labelledby="work-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">A collection of good questions</p>
            <h2 id="work-title">
              The work<span className="heading-period">.</span>
            </h2>
          </div>
          <p className="section-aside">
            A few ways I turn tangled challenges into thoughtful, useful
            experiences.
          </p>
        </div>

        <div className="active-folder" key={activeCategory} aria-live="polite">
          <div className="folder-tabs" role="group" aria-label="Choose a category">
            {categories.map((category) => (
              <button
                className={`folder-tab${activeCategory === category.id ? " is-active" : ""}`}
                key={category.id}
                type="button"
                aria-pressed={activeCategory === category.id}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="folder-number">{category.number}</span>
                <span>{category.label}</span>
              </button>
            ))}
          </div>
          <div className="active-folder-content">
            {loading ? (
              <p className="status-message">Gathering the good stuff…</p>
            ) : error ? (
              <div className="status-message status-error" role="alert">
                <p>{error}</p>
                <button
                  className="retry-button"
                  type="button"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  Try again <span aria-hidden="true">↗</span>
                </button>
              </div>
            ) : caseStudies.length === 0 ? (
              <p className="status-message">
                New stories are in the works. Check back soon.
              </p>
            ) : (
              <div className="case-study-grid">
                {caseStudies.map(({ project, caseStudy }, index) => (
                  <CaseStudyCard
                    key={`${project.title}-${caseStudy.topic}`}
                    project={project}
                    caseStudy={caseStudy}
                    categoryLabel={selectedCategory?.label ?? activeCategory}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#top">
          Gabrielle Sladek<span>.</span>
        </a>
        <p>Good work happens when we make it together.</p>
        <a className="footer-top" href="#top">
          Back to the beginning ↑
        </a>
      </footer>
    </main>
  );
}
