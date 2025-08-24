import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllMarkdownPaths, getPostByPath, markdownToHtml } from "./utils";
import Link from "next/link";
import styles from "@/styles/markdown.module.css";
import Markdown from "./markdown";

export default async function Post(props: Params) {
  const params = await props.params;
  if (params.markdown[0] === "markdown") return <Markdown />;

  const post = getPostByPath(params.markdown);
  if (!post) return notFound();

  const content = await markdownToHtml(post.content || "");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            {post.author && (
              <>
                <span>{post.author.name}</span>
                <span className="mx-2">•</span>
              </>
            )}
            {post.date && (
              <time dateTime={post.date.toISOString()}>
                {post.date.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        </header>

        <div
          className={`${styles.markdownContent} prose prose-lg max-w-none`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </article>

      <div className="mt-12 pt-8 border-t border-gray-200">
        <Link
          href="/"
          className="inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}

type Params = {
  params: Promise<{
    markdown: string[];
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;

  // Handle special markdown listing page
  if (params.markdown[0] === "markdown") {
    return {
      title: "All Content | EP-390",
      description:
        "Browse all content from markdown files throughout the application.",
    };
  }

  const post = getPostByPath(params.markdown);

  if (!post) {
    return notFound();
  }

  const title = `${post.title} | EP-390 Blog`;

  return {
    title,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const paths = getAllMarkdownPaths();
  const allParams = paths.map((path) => ({
    markdown: path.split("/"),
  }));
  return [{ markdown: ["markdown"] }, ...allParams];
}
