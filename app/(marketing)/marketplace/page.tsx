import { redirect } from 'next/navigation';

/**
 * Marketplace page - redireciona para feed
 * Mantido para compatibilidade com links existentes
 */
export default function MarketplacePage() {
  redirect('/feed');
}

