import { notFound } from "next/navigation";
import CaseStudyLayout from "../case-study-layout";
import { getProject } from "../../lib/portfolio";

export default function Page() {
  const entry = getProject("phos-tech");
  if (!entry) notFound();
  return <CaseStudyLayout project={entry.project} index={entry.index} />;
}
