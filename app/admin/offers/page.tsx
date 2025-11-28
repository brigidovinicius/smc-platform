'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import Link from 'next/link';

interface Offer {
  id: string;
  price: number;
  status: string;
  createdAt: string;
  seller: {
    id: string;
    name: string | null;
    email: string | null;
  };
  buyer: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
  asset: {
    id: string;
    title: string;
  };
}

const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  UNDER_NEGOTIATION: 'bg-yellow-500',
  SOLD: 'bg-blue-500',
  ARCHIVED: 'bg-gray-500',
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const loadOffers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      
      const response = await fetch(`/api/admin/offers?${params.toString()}`, {
        credentials: 'include',
      });
      const result = await response.json();
      
      if (result.success) {
        setOffers(result.data.items || result.data.offers || []);
      } else {
        console.error('Error loading offers:', result.error);
      }
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters.status]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ofertas</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie todas as ofertas da plataforma
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar ofertas..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Todos os Status</option>
              <option value="ACTIVE">Ativa</option>
              <option value="UNDER_NEGOTIATION">Em Negociação</option>
              <option value="SOLD">Vendida</option>
              <option value="ARCHIVED">Arquivada</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Offers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todas as Ofertas ({offers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : offers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma oferta encontrada.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-semibold">Asset</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Vendedor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Comprador</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Valor</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold">Criada em</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id} className="border-b hover:bg-accent">
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/assets/${offer.asset.id}`}
                          className="text-primary hover:underline font-medium"
                        >
                          {offer.asset.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {offer.seller.name || offer.seller.email}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {offer.buyer ? (offer.buyer.name || offer.buyer.email) : '-'}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        ${offer.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={STATUS_COLORS[offer.status] || 'bg-gray-500'}>
                          {offer.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">
                        {new Date(offer.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

