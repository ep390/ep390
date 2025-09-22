import fs from "fs";
import path from "path";
import Link from "next/link";

type HomeworkLink = {
  href: string;
  label: string;
  number: number;
};

type StudentHomeworks = Record<string, HomeworkLink[]>;

const APP_DIR = path.join(process.cwd(), "app");
const STUDENTS_DIR = path.join(APP_DIR, "students");

function directoryExists(absolutePath: string): boolean {
  try {
    return fs.statSync(absolutePath).isDirectory();
  } catch {
    return false;
  }
}

function fileExists(absolutePath: string): boolean {
  try {
    return fs.statSync(absolutePath).isFile();
  } catch {
    return false;
  }
}

function hasRoutePage(dir: string): boolean {
  const candidateFiles = [
    "page.tsx",
    "page.ts",
    "page.jsx",
    "page.js",
    "page.mdx",
    "page.md",
  ];
  return candidateFiles.some((file) => fileExists(path.join(dir, file)));
}

function findStudentHomeworks(): StudentHomeworks {
  if (!directoryExists(STUDENTS_DIR)) return {};

  const studentEntries = fs
    .readdirSync(STUDENTS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const result: StudentHomeworks = {};

  for (const studentDirent of studentEntries) {
    const studentName = studentDirent.name;
    if (studentName.startsWith(".")) continue;

    const studentPath = path.join(STUDENTS_DIR, studentName);
    const subdirs = fs
      .readdirSync(studentPath, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    const links: HomeworkLink[] = [];

    for (const subdir of subdirs) {
      const childName = subdir.name;
      if (childName.startsWith(".")) continue;

      const childPath = path.join(studentPath, childName);
      if (!hasRoutePage(childPath)) continue;

      const numMatch = childName.match(/^hw(\d+)$/i);
      const hwNumber = numMatch ? parseInt(numMatch[1], 10) : Number.NaN;
      const href = `/students/${studentName}/${childName}`;
      const label = Number.isFinite(hwNumber)
        ? `HW ${hwNumber}`
        : childName;

      links.push({ href, label, number: hwNumber });
    }

    if (links.length > 0) {
      // Sort numerically by homework number, then by name as fallback
      links.sort((a, b) => {
        if (Number.isFinite(a.number) && Number.isFinite(b.number)) {
          return a.number - b.number;
        }
        return a.label.localeCompare(b.label);
      });
      result[studentName] = links;
    }
  }

  return Object.fromEntries(
    Object.entries(result).sort(([a], [b]) => a.localeCompare(b))
  );
}

export default async function Page() {
  const grouped = findStudentHomeworks();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-6">Student Homeworks</h1>
      <p className="text-gray-600 mb-8">
        Links to all homework pages, organized by student.
      </p>

      <div className="space-y-8">
        {Object.entries(grouped).map(([student, links]) => (
          <section key={student}>
            <h2 className="text-2xl font-semibold mb-3">{student}</h2>
            <ul className="list-disc pl-6 space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Student Homeworks | EP-390",
  description: "Browse homework pages grouped by student.",
};


