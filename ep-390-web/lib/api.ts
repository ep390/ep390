import { Post } from "../interfaces/post";
import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

// Recursively find all markdown files in a directory
function findMarkdownFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    
    if (item.isDirectory()) {
      // Skip node_modules, .next, and other build directories
      if (!item.name.startsWith('.') && item.name !== 'node_modules') {
        files.push(...findMarkdownFiles(fullPath, baseDir));
      }
    } else if (item.isFile() && item.name.endsWith('.md')) {
      // Get relative path from base directory and remove .md extension
      const relativePath = fullPath.replace(baseDir + '/', '').replace(/\.md$/, '');
      files.push(relativePath);
    }
  }
  
  return files;
}

export function getAllMarkdownPaths(): string[] {
  const appDir = join(process.cwd(), 'app');
  const postsDir = join(process.cwd(), '_posts');
  
  const paths: string[] = [];
  
  // Scan _posts directory (legacy support)
  if (fs.existsSync(postsDir)) {
    const postFiles = fs.readdirSync(postsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
    paths.push(...postFiles);
  }
  
  // Scan app directory
  if (fs.existsSync(appDir)) {
    paths.push(...findMarkdownFiles(appDir));
  }
  
  return paths;
}

export function getPostByPath(pathSegments: string[]): Post | null {
  const slug = pathSegments.join('/');
  
  // Try _posts directory first (legacy support)
  const postsPath = join(process.cwd(), '_posts', `${slug}.md`);
  if (fs.existsSync(postsPath)) {
    const fileContents = fs.readFileSync(postsPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, slug, content } as Post;
  }
  
  // Try app directory
  const appPath = join(process.cwd(), 'app', `${slug}.md`);
  if (fs.existsSync(appPath)) {
    const fileContents = fs.readFileSync(appPath, "utf8");
    const { data, content } = matter(fileContents);
    return { ...data, slug, content } as Post;
  }
  
  return null;
}

// Legacy function for backward compatibility
export function getPostBySlug(slug: string): Post | null {
  return getPostByPath([slug]);
}

export function getAllPosts(): Post[] {
  const paths = getAllMarkdownPaths();
  const posts = paths
    .map((path) => getPostByPath(path.split('/')))
    .filter((post): post is Post => post !== null)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}
