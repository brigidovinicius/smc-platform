import { NextResponse } from 'next/server';
import { generateRssFeed } from '@/lib/rss';

export const revalidate = 3600;

export function GET() {
  const feed = generateRssFeed();
  return new NextResponse(feed, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8'
    }
  });
}
