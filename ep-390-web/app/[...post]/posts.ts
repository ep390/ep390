import fs from "fs";
import matter from "gray-matter";
import html from "remark-html";
import { Post } from "../../interfaces/post";
import { join } from "path";
import { remark } from "remark";

const APP_DIR = join(process.cwd(), 'app');

// Recursively find all markdown files and convert them to posts
function findMarkdownPosts(dir: string, basePath = ''): Post[] {
  if (!fs.existsSync(dir)) return [];

  const posts: Post[] = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = join(dir, item.name);
    const relativePath = basePath ? `${basePath}/${item.name}` : item.name;
    
    if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
      posts.push(...findMarkdownPosts(fullPath, relativePath));
    } else if (item.isFile() && item.name.endsWith('.md')) {
      const slug = relativePath.replace(/\.md$/, '');
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      posts.push({ ...data, slug, content } as Post);
    }
  }
  
  return posts;
}

export function getPostByPath(pathSegments: string[]): Post | null {
  const filePath = join(APP_DIR, `${pathSegments.join('/')}.md`);
  
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
