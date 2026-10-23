"use client";

import { useEffect, useState, type FormEvent } from "react";
import CaseStudyCard from "./components/case-study-card";
import type { Project } from "./lib/portfolio";

const contactEmail = "gabriellemsladek@gmail.com";

const categories = [
  { id: "product_design", label: "Product design", number: "01" },
  { id: "product_strategy", label: "Product strategy", number: "02" },
  { id: "project_management", label: "Project management", number: "03" },
  { id: "seo", label: "SEO", number: "04" },
] as const;

type CategoryId = (typeof categories)[number]["id"];

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
  const [isHeroScrolled, setIsHeroScrolled] = useState(false);
  const filteredProjects = projects.filter((project) =>
    project.topics.includes(activeCategory),
  );

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

  useEffect(() => {
    const updateHeroState = () => {
      setIsHeroScrolled(window.scrollY > 80);
    };

    updateHeroState();
    window.addEventListener("scroll", updateHeroState, { passive: true });
    window.addEventListener("resize", updateHeroState);

    return () => {
      window.removeEventListener("scroll", updateHeroState);
      window.removeEventListener("resize", updateHeroState);
    };
  }, []);

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();
    const subject = `Portfolio inquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <main>
      <div className="hero-meta">
        <a
          className="wordmark"
          href="#top"
          aria-label="Gabrielle Sladek, home"
        >
          GMS<span>.</span>
        </a>
        <span className="hero-location">Working everywhere</span>
      </div>

      <div className={`landing-shell${isHeroScrolled ? " is-scrolled" : ""}`}>
        <section className="hero" id="top" aria-labelledby="hero-title">
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
        </section>
      </div>

      <nav className="folder-nav" aria-label="Main navigation">
        <div className="folder-nav-inner">
          <div className="nav-actions">
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
              My Work
            </button>
            <button
              className="nav-button"
              type="button"
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              About Me
            </button>
            <button
              className="nav-button"
              type="button"
              onClick={() =>
                document.getElementById("contact")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                })
              }
            >
              Contact Me
            </button>
          </div>
        </div>
      </nav>

      <section className="work-section" aria-labelledby="work-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker" id="work">Selected work</p>
            <h2 id="work-title">
              A few things I&apos;ve made<span className="heading-period">.</span>
            </h2>
            <p className="work-intro">
              Product design, strategy, research, and the details that bring
              each project together.
            </p>
          </div>
        </div>

        <div className="project-index">
          <div className="active-folder" key={activeCategory} aria-live="polite">
            <div className="folder-tabs" role="group" aria-label="Filter projects by discipline">
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
                    Try again
                  </button>
                </div>
              ) : filteredProjects.length === 0 ? (
                <p className="status-message">
                  New stories are in the works. Check back soon.
                </p>
              ) : (
                <div className="case-study-grid">
                  {filteredProjects.map((project, index) => (
                    <CaseStudyCard
                      key={project.title}
                      project={project}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="about-section"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="about-layout">
          <div className="about-copy">
            <p className="section-kicker">About Me</p>
            <h2 id="about-title">
              Lorem ipsum dolor sit amet
              <span className="heading-period">.</span>
            </h2>
            <p className="about-intro">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p className="about-detail">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
            <a className="about-contact-link" href="#contact">
              Let&apos;s connect
            </a>
          </div>

          <aside className="about-card" aria-label="Areas of focus">
            <span className="about-card-mark" aria-hidden="true">
              GMS<span>.</span>
            </span>
            <p className="about-card-kicker">Lorem ipsum dolor sit amet</p>
            <ul className="about-focus-list">
              <li>Product design</li>
              <li>Product strategy</li>
              <li>Project management</li>
              <li>SEO</li>
            </ul>
            <p className="about-card-location">
              Milwaukee, WI <span aria-hidden="true">·</span> Working
              everywhere
            </p>
          </aside>
        </div>
      </section>

      <section
        className="contact-section"
        id="contact"
        aria-labelledby="contact-title"
      >
        <div className="contact-heading">
          <p className="section-kicker">Contact me</p>
          <h2 id="contact-title">
            Let&apos;s make something meaningful
            <span className="heading-period">.</span>
          </h2>
          <p className="contact-intro">
            Have a project, a question, or just want to say hello? I&apos;d love
            to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-form-panel">
            <h3>Send me a note</h3>
            <p className="contact-panel-copy">
              Fill out the form and your email app will open with your message
              ready to send.
            </p>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label htmlFor="contact-name">Your name</label>
              <input
                autoComplete="name"
                id="contact-name"
                name="name"
                placeholder="Jane Smith"
                required
              />

              <label htmlFor="contact-email">Your email</label>
              <input
                autoComplete="email"
                id="contact-email"
                name="email"
                placeholder="jane@example.com"
                required
                type="email"
              />

              <label htmlFor="contact-message">Your message</label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="Tell me a little about what you have in mind..."
                required
                rows={5}
              />

              <button className="contact-submit" type="submit">
                Send me a note
              </button>
            </form>
            <a className="contact-email" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
          </div>

          <div className="resume-panel">
            <div className="resume-panel-heading">
              <div>
                <p className="section-kicker">A little more about me</p>
                <h3>Resume</h3>
              </div>
              <span className="resume-format">PDF</span>
            </div>
            <div
              className="resume-preview"
              role="img"
              aria-label="Preview placeholder for Gabrielle Sladek's resume PDF"
            >
              <div className="resume-paper" aria-hidden="true">
                <span className="resume-paper-name">Gabrielle Sladek</span>
                <span className="resume-paper-role">
                  Product Designer &amp; Strategist
                </span>
                <span className="resume-paper-rule" />
                <span className="resume-paper-label">EXPERIENCE</span>
                <span className="resume-paper-lines" />
                <span className="resume-paper-lines resume-paper-lines-short" />
                <span className="resume-paper-label">EDUCATION</span>
                <span className="resume-paper-lines" />
                <span className="resume-paper-lines resume-paper-lines-short" />
              </div>
              <span className="resume-placeholder-label">
                Resume PDF coming soon
              </span>
            </div>
            <p className="resume-note">
              The PDF will be available here soon. In the meantime, feel free
              to get in touch.
            </p>
            <button className="resume-button" type="button" disabled>
              Resume PDF coming soon
            </button>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#top">
          Gabrielle Sladek<span>.</span>
        </a>
        <p>Good work happens when we make it together.</p>
        <a className="footer-top" href="#top">
          Back to the beginning
        </a>
      </footer>
    </main>
  );
}
