import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from 'next/link';
import { getAllMarkdownPaths, getPostByPath } from "../../lib/api";
import markdownToHtml from "../../lib/markdownToHtml";

export default async function Post(props: Params) {
  const params = await props.params;
  const post = getPostByPath(params.post);

  if (!post) {
    return notFound();
  }

  const content = await markdownToHtml(post.content || "");

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        href="/posts"
        className="inline-block mb-6 text-blue-600 hover:text-blue-800"
      >
        ← Back to Blog
      </Link>
      
      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center text-gray-600 text-sm">
            <span>By {post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Path: /{params.post.join('/')}
          </div>
        </header>
        
        <div 
          className="prose prose-lg max-w-none"
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
    post: string[];
  }>;
};

export async function generateMetadata(props: Params): Promise<Metadata> {
  const params = await props.params;
  const post = getPostByPath(params.post);

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

  return paths.map((path) => ({
    post: path.split('/'),
  }));
}
