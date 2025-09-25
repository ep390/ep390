"use client";

import { Grader } from "./Grader";

export default function GraderPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">Grading Helper</h1>
      <Grader rubricTextInitial={""} showPasteArea={true} />
    </div>
  );
}

