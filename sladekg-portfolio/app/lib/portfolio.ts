export type CaseStudy = {
  summary: string;
  context: string;
  my_role: string;
  action: string;
  result: string;
};

export type Project = {
  title: string;
  topics: string[];
  awards: number;
  case_study: CaseStudy;
  images: { src: string; alt: string }[];
  presentation: string;
};

export function projectSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatTopic(topic: string) {
  return topic.replaceAll("_", " ");
}
