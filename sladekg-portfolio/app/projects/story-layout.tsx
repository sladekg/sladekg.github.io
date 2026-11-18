"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type RefObject,
} from "react";
import {
  formatTopic,
  type Project,
  type ProjectStory,
  type StoryImage,
} from "../lib/portfolio";

type StoryLayoutProps = {
  project: Project & { story: ProjectStory };
};

function StoryLightbox({
  dialogRef,
  image,
  onClose,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  image: StoryImage | null;
  onClose: () => void;
}) {
  return (
    <dialog
      ref={dialogRef}
      className="story-lightbox"
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
    >
      {image && (
        <>
          <button
            type="button"
            className="story-lightbox-close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg className="story-icon" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M4 4 12 12" />
              <path d="M12 4 4 12" />
            </svg>
          </button>
          {/* The enlarged view uses the original file so it is not cropped by the thumbnail size. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image.src} alt={image.alt} />
        </>
      )}
    </dialog>
  );
}

function StoryFigure({
  image,
  sizes,
  onEnlarge,
}: {
  image: StoryImage;
  sizes: string;
  onEnlarge: (image: StoryImage) => void;
}) {
  return (
    <figure className="story-figure">
      <Image
        src={image.src}
        alt={image.alt}
        width={720}
        height={480}
        sizes={sizes}
      />
      <button
        type="button"
        className="story-enlarge"
        aria-label="Enlarge"
        onClick={() => onEnlarge(image)}
      >
        <svg className="story-icon" viewBox="0 0 16 16" aria-hidden="true">
          <circle cx="7" cy="7" r="4.25" />
          <path d="M7 5.15v3.7" />
          <path d="M5.15 7h3.7" />
          <path d="M10.2 10.2 13.25 13.25" />
        </svg>
      </button>
    </figure>
  );
}

const carouselDelayMs = 8000;

function StoryCarousel({ images }: { images: StoryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<StoryImage | null>(null);
  const [index, setIndex] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const [controlFocused, setControlFocused] = useState(false);
  const count = images.length;
  const image = images[index] ?? images[0];
  const autoplayPaused = pointerOver || controlFocused || open !== null;

  function show(nextIndex: number) {
    setIndex((nextIndex + count) % count);
  }

  useEffect(() => {
    if (autoplayPaused || count < 2) return;
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % count);
    }, carouselDelayMs);
    return () => window.clearTimeout(timer);
  }, [autoplayPaused, count, index]);

  function enlarge(nextImage: StoryImage) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setOpen(nextImage);
    dialog.showModal();
  }

  function close() {
    dialogRef.current?.close();
    setOpen(null);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (dialogRef.current?.open) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      show(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      show(index - 1);
    }
  }

  function onBlur(event: FocusEvent<HTMLDivElement>) {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
      return;
    }
    setControlFocused(false);
  }

  if (!image) return null;

  return (
    <div
      className="story-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Images"
      data-autoplay={carouselDelayMs}
      data-autoplay-state={autoplayPaused ? "paused" : "playing"}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setPointerOver(true)}
      onPointerLeave={() => setPointerOver(false)}
      onFocus={() => setControlFocused(true)}
      onBlur={onBlur}
    >
      <div className="story-carousel-stage">
        <button
          type="button"
          className="story-carousel-button is-previous"
          aria-label="Previous"
          onClick={() => show(index - 1)}
        >
          <svg className="story-carousel-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M14.5 5 7.5 12l7 7" />
          </svg>
        </button>
        <StoryFigure
          image={image}
          sizes="(max-width: 760px) 88vw, 720px"
          onEnlarge={enlarge}
        />
        <button
          type="button"
          className="story-carousel-button is-next"
          aria-label="Next"
          onClick={() => show(index + 1)}
        >
          <svg className="story-carousel-arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9.5 5 16.5 12l-7 7" />
          </svg>
        </button>
      </div>
      <p className="story-carousel-status" aria-live="polite">
        {index + 1} of {count}
      </p>
      <div className="story-carousel-dots">
        {images.map((dotImage, dotIndex) => (
          <button
            key={dotImage.src}
            type="button"
            className={
              dotIndex === index
                ? "story-carousel-dot is-active"
                : "story-carousel-dot"
            }
            aria-label={`Show image ${dotIndex + 1} of ${count}`}
            aria-current={dotIndex === index ? "true" : undefined}
            onClick={() => setIndex(dotIndex)}
          />
        ))}
      </div>
      <StoryLightbox dialogRef={dialogRef} image={open} onClose={close} />
    </div>
  );
}

function StoryGallery({ images }: { images: StoryImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<StoryImage | null>(null);

  function enlarge(image: StoryImage) {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setOpen(image);
    dialog.showModal();
  }

  function close() {
    dialogRef.current?.close();
    setOpen(null);
  }

  if (images.length >= 3) {
    return <StoryCarousel images={images} />;
  }

  return (
    <>
      <div className="story-gallery">
        {images.map((image) => (
          <StoryFigure
            key={image.src}
            image={image}
            sizes="(max-width: 760px) 340px, 460px"
            onEnlarge={enlarge}
          />
        ))}
      </div>
      <StoryLightbox dialogRef={dialogRef} image={open} onClose={close} />
    </>
  );
}

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
                {section.images && section.images.length > 0 && (
                  <StoryGallery images={section.images} />
                )}
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
