import fs from "fs";
import matter from "gray-matter";
import { Post } from "../../interfaces/post";
import { join } from "path";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const APP_DIR = join(process.cwd(), 'app');

// Helper function to parse date strings into Date objects
function parseDate(dateStr: string | undefined): Date | undefined {
  if (!dateStr) return undefined;
  
  // Handle both simple dates (2025-08-14) and full ISO strings (2024-01-22T14:30:00.000Z)
  const normalizedStr = dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00';
  return new Date(normalizedStr);
}

// Helper function to load and parse a markdown file into a Post
function loadMarkdownFile(filePath: string, slug: string): Post | null {
  if (!fs.existsSync(filePath)) return null;
  
  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  
  return { 
    ...data, 
    slug,
    content,
    date: parseDate(data.date)
  } as Post;
}

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
      const post = loadMarkdownFile(pageMarkdownPath, relativePath);
      if (post) {
        posts.push(post);
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
  const slug = pathSegments.join('/');
  
  return loadMarkdownFile(filePath, slug);
}

export function getAllPosts(): Post[] {
  return findMarkdownPosts(APP_DIR)
    .sort((a, b) => (a.date && b.date ? b.date.getTime() - a.date.getTime() : 0));
}

export function getAllMarkdownPaths(): string[] {
  return getAllPosts().map(post => post.slug);
}

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);
  return result.toString();
}
