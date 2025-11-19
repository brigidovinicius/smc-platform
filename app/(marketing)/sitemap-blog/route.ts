import { NextResponse } from 'next/server';
import { generateBlogSitemap } from '@/lib/sitemap-blog';

export const revalidate = 3600;

export function GET() {
  const xml = generateBlogSitemap();
  return new NextResponse(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
