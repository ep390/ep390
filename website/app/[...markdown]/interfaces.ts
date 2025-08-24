export type Author = {
  name: string;
  picture: string;
};

export type Post = {
  slug: string;
  title: string;
  date: Date | undefined;
  author: Author;
  excerpt: string;
  content: string;
  preview?: boolean;
};
