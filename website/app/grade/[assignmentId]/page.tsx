import fs from "fs/promises";
import path from "path";
import { Grader } from "../Grader";
import { extractRubricSection } from "../utils";

export default async function GradeAssignmentPage({
  params
}: {
  params: Promise<{ assignmentId: string }>;
}) {
  const { assignmentId } = await params;
  const mdPath = path.join(process.cwd(), "app", "assignments", assignmentId, "page.md");

  let rubricMarkdown = "";
  try {
    const file = await fs.readFile(mdPath, "utf8");
    rubricMarkdown = extractRubricSection(file);
  } catch {
    rubricMarkdown = "";
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">Grading: Assignment {assignmentId}</h1>
      <Grader rubricTextInitial={rubricMarkdown} showPasteArea={false} />
      {rubricMarkdown.trim().length === 0 && (
        <p className="mt-4 text-sm text-gray-500">No rubric found in this assignment&apos;s markdown.</p>
      )}
    </div>
  );
}


