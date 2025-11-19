import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const AUTHORS_DIR = path.join(process.cwd(), 'content', 'authors');

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  author?: string;
  tags?: string[];
  content: string;
}

export interface BlogAuthor {
  slug: string;
  name: string;
  role?: string;
  bio?: string;
  avatar?: string;
}

const readFileSafe = (filePath: string) => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    return null;
  }
};

export const getAllPosts = (): BlogPost[] => {
  if (!fs.existsSync(BLOG_DIR)) {
    return [];
  }

  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const raw = readFileSafe(path.join(BLOG_DIR, file));
      if (!raw) {
        return null;
      }
      const { data, content } = matter(raw);
      return {
        slug: data.slug ?? file.replace(/\.mdx$/, ''),
        title: data.title ?? 'Untitled',
        excerpt: data.excerpt ?? '',
        date: data.date ?? new Date().toISOString(),
        category: data.category,
        author: data.author,
        tags: data.tags ?? [],
        content
      } as BlogPost;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime()) as BlogPost[];
};

export const getPostBySlug = (slug: string): BlogPost | null => {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = readFileSafe(filePath);
  if (!raw) {
    return null;
  }
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? 'Untitled',
    excerpt: data.excerpt ?? '',
    date: data.date ?? new Date().toISOString(),
    category: data.category,
    author: data.author,
    tags: data.tags ?? [],
    content
  };
};

export const getAllCategories = () => {
  const posts = getAllPosts();
  const counts: Record<string, number> = {};
  posts.forEach((post) => {
    if (!post.category) return;
    counts[post.category] = (counts[post.category] ?? 0) + 1;
  });
  return Object.entries(counts).map(([category, count]) => ({ category, count }));
};

export const getPostsByCategory = (category: string) =>
  getAllPosts().filter((post) => post.category === category);

const getAuthorFilePath = (slug: string) => path.join(AUTHORS_DIR, `${slug}.json`);

export const getAllAuthors = (): BlogAuthor[] => {
  if (!fs.existsSync(AUTHORS_DIR)) {
    return [];
  }
  return fs
    .readdirSync(AUTHORS_DIR)
    .filter((file) => file.endsWith('.json'))
    .map((file) => {
      const raw = readFileSafe(path.join(AUTHORS_DIR, file));
      if (!raw) return null;
      const data = JSON.parse(raw);
      return data as BlogAuthor;
    })
    .filter(Boolean) as BlogAuthor[];
};

export const getAuthorBySlug = (slug: string): BlogAuthor | null => {
  const raw = readFileSafe(getAuthorFilePath(slug));
  return raw ? (JSON.parse(raw) as BlogAuthor) : null;
};

export const getPostsByAuthor = (authorSlug: string) =>
  getAllPosts().filter((post) => post.author === authorSlug);
