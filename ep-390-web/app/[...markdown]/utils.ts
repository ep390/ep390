import fs from "fs";
import matter from "gray-matter";
import html from "remark-html";
import { Post } from "../../interfaces/post";
import { join } from "path";
import { remark } from "remark";

const APP_DIR = join(process.cwd(), 'app');

// Recursively find all page.md files and convert them to posts
function findMarkdownPosts(dir: string, basePath = ''): Post[] {
  if (!fs.existsSync(dir)) return [];

  const posts: Post[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      // Check if this directory contains a page.md file
      const pageMarkdownPath = join(fullPath, 'page.md');
      if (fs.existsSync(pageMarkdownPath)) {
        const fileContents = fs.readFileSync(pageMarkdownPath, "utf8");
        const { data, content } = matter(fileContents);
        const slug = relativePath; // Use the directory path as the slug
        posts.push({ ...data, slug, content } as Post);
      }
      
      // Continue recursing into subdirectories
      posts.push(...findMarkdownPosts(fullPath, relativePath));
    }
  }
  
  return posts;
}

export function getPostByPath(pathSegments: string[]): Post | null {
  const dirPath = join(APP_DIR, pathSegments.join('/'));
  const filePath = join(dirPath, 'page.md');
  
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const slug = pathSegments.join('/');
  
  return { ...data, slug, content } as Post;
}

export function getAllPosts(): Post[] {
  return findMarkdownPosts(APP_DIR)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getAllMarkdownPaths(): string[] {
  return getAllPosts().map(post => post.slug);
}

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
