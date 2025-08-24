import Link from "next/link";
import { getAllPosts } from "./utils";

export default function PostsIndex() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Content</h1>
      <p className="text-gray-600 mb-8">
        Content discovered from markdown files throughout the application
      </p>

      {posts.length === 0 ? (
        <p className="text-gray-600">No content found.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="border-b border-gray-200 pb-6">
              <h2 className="text-2xl font-semibold mb-2">
                <Link href={`/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              <div className="text-sm text-gray-500 mb-3">
                {post.author && (
                  <>
                    <span>By {post.author.name}</span>
                    <span className="mx-2">•</span>
                  </>
                )}
                <span>{post.date?.toLocaleDateString() || "Unknown Date"}</span>
                <span className="mx-2">•</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  /{post.slug}
                </span>
              </div>
              {post.excerpt && (
                <p className="text-gray-700 mb-3">{post.excerpt}</p>
              )}
              <Link
                href={`/${post.slug}`}
                className="inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-8">
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

export const metadata = {
  title: "All Content | EP-390",
  description:
    "Browse all content from markdown files throughout the application.",
};
