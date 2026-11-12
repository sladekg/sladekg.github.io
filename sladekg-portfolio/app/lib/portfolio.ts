import portfolioContent from "../../public/content.json";

export type CaseStudy = {
  summary: string;
  context: string;
  my_role: string;
  action: {
    action_title: string;
    action_description: string;
  }[];
  result: string;
};

export type StoryFact = {
  label: string;
  value: string;
};

export type StorySubsection = {
  title: string;
  body: string;
};

export type StoryStat = {
  value: string;
  label: string;
};

export type StoryImage = {
  src: string;
  alt: string;
};

export type StorySection = {
  id: string;
  label: string;
  title: string;
  paragraphs?: string[];
  quote?: string;
  images?: StoryImage[];
  subsections?: StorySubsection[];
  stats?: StoryStat[];
};

export type ProjectStory = {
  eyebrow?: string;
  tldr: string[];
  facts: StoryFact[];
  sections: StorySection[];
};

export type Project = {
  title: string;
  topics: string[];
  awards: number;
  impact: {
    value: string | null;
    description: string;
  };
  case_study: CaseStudy;
  images: { src: string; alt: string }[];
  presentation: string;
  story?: ProjectStory;
};

export type ProjectEntry = {
  project: Project;
  index: number;
};

const projects = portfolioContent.projects as Project[];

export function projectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatTopic(topic: string) {
  return topic.replaceAll("_", " ");
}

export function getProject(slug: string): ProjectEntry | null {
  const index = projects.findIndex((project) => projectSlug(project.title) === slug);
  const project = projects[index];
  if (!project) return null;
  return { project, index };
}

export function hasStory(
  project: Project,
): project is Project & { story: ProjectStory } {
  return Boolean(project.story && project.story.sections.length > 0);
}
