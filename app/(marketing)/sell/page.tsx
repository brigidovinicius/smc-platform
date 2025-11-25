import { redirect } from 'next/navigation';
import { getSession } from 'next-auth/react';

/**
 * Sell page - redirects authenticated users to wizard, shows CTA for unauthenticated
 */
export default async function SellPage() {
  // For now, redirect to wizard
  // In the future, this could show a landing page with benefits before redirecting
  redirect('/wizard');
}

