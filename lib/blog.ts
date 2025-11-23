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
  if (!fs.existsSync(BLOG_DIR)) {
    return null;
  }

  // Try to find by filename first
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  let raw = readFileSafe(filePath);
  
  if (raw) {
    const { data, content } = matter(raw);
    return {
      slug: data.slug ?? slug,
      title: data.title ?? 'Untitled',
      excerpt: data.excerpt ?? '',
      date: data.date ?? new Date().toISOString(),
      category: data.category,
      author: data.author,
      tags: data.tags ?? [],
      content
    };
  }

  // If not found by filename, search by slug in frontmatter
  const files = fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));
  
  for (const file of files) {
    const fileRaw = readFileSafe(path.join(BLOG_DIR, file));
    if (!fileRaw) continue;
    
    const { data, content } = matter(fileRaw);
    const postSlug = data.slug ?? file.replace(/\.mdx$/, '');
    
    if (postSlug === slug) {
      return {
        slug: postSlug,
        title: data.title ?? 'Untitled',
        excerpt: data.excerpt ?? '',
        date: data.date ?? new Date().toISOString(),
        category: data.category,
        author: data.author,
        tags: data.tags ?? [],
        content
      };
    }
  }

  return null;
};

export const getAllCategories = (): string[] => {
  const posts = getAllPosts();
  const categories = new Set<string>();
  posts.forEach((post) => {
    if (post.category) {
      categories.add(post.category);
    }
  });
  return Array.from(categories).sort();
};

export const getCategoriesWithCount = () => {
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

export const getRelatedPosts = (currentSlug: string, category?: string, limit: number = 3): BlogPost[] => {
  const posts = getAllPosts();
  return posts
    .filter((post) => {
      if (post.slug === currentSlug) return false;
      if (category && post.category === category) return true;
      return false;
    })
    .slice(0, limit);
};
