import { notFound } from "next/navigation";
import StoryLayout from "../story-layout";
import { getProject, hasStory } from "../../lib/portfolio";

export default function Page() {
  const entry = getProject("discovery-world");
  if (!entry || !hasStory(entry.project)) notFound();
  return <StoryLayout project={entry.project} />;
}
