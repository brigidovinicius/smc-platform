'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LEAD_STATUS_OPTIONS } from '@/lib/leads/constants';

interface Lead {
  id: string;
  asset: {
    id: string;
    title: string;
    slug: string;
  };
  name: string;
  email: string;
  buyerType: string;
  budgetRange?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-600',
  IN_CONTACT: 'bg-indigo-600',
  PROPOSAL_SENT: 'bg-yellow-600',
  WON: 'bg-emerald-600',
  LOST: 'bg-rose-600',
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') {
        params.set('status', statusFilter);
      }

      const response = await fetch(`/api/leads?${params.toString()}`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Falha ao carregar leads');
      }

      setLeads(result.data.leads);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado');
      setLeads([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleStatusUpdate = async (leadId: string, newStatus: string) => {
    setUpdatingId(leadId);
    setError(null);

    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Não foi possível atualizar o lead.');
      }

      setLeads((prev) =>
        prev.map((lead) => (lead.id === leadId ? { ...lead, status: result.data.lead.status } : lead)),
      );
    } catch (err: any) {
      setError(err.message || 'Erro inesperado ao atualizar status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-text)]">Leads</h1>
          <p className="text-[var(--color-text-secondary)] mt-2">
            Acompanhe e atualize os leads vindos do marketplace público
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full border ${
                  statusFilter === 'ALL'
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'border-[var(--color-border)] text-[var(--color-text)]'
                }`}
                onClick={() => setStatusFilter('ALL')}
              >
                Todos
              </button>
              {LEAD_STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  className={`px-4 py-2 rounded-full border ${
                    statusFilter === option.value
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-[var(--color-border)] text-[var(--color-text)]'
                  }`}
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <Button variant="outline" onClick={loadLeads}>
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline de Leads ({leads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg border border-red-500 bg-red-900/20 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">Carregando leads...</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-12 text-[var(--color-text-secondary)]">Nenhum lead encontrado.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-left text-xs uppercase tracking-wide text-[var(--color-text-secondary)]">
                    <th className="py-3 px-4">Criado em</th>
                    <th className="py-3 px-4">Ativo</th>
                    <th className="py-3 px-4">Comprador</th>
                    <th className="py-3 px-4">E-mail</th>
                    <th className="py-3 px-4">Perfil</th>
                    <th className="py-3 px-4">Budget</th>
                    <th className="py-3 px-4">Mensagem</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-[var(--color-border)]">
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/assets/${lead.asset.slug}`}
                          className="text-[var(--color-primary)] hover:underline font-medium"
                        >
                          {lead.asset.title}
                        </Link>
                      </td>
                      <td className="py-3 px-4">{lead.name}</td>
                      <td className="py-3 px-4">
                        <a href={`mailto:${lead.email}`} className="text-[var(--color-primary)] hover:underline">
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">{lead.buyerType}</td>
                      <td className="py-3 px-4 text-[var(--color-text-secondary)]">
                        {lead.budgetRange || 'N/D'}
                      </td>
                      <td className="py-3 px-4 max-w-xs">
                        <details>
                          <summary className="cursor-pointer text-[var(--color-primary)]">Ver</summary>
                          <p className="mt-2 text-[var(--color-text-secondary)] whitespace-pre-wrap">{lead.message}</p>
                        </details>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-2">
                          <Badge className={STATUS_COLORS[lead.status] || 'bg-slate-600'}>
                            {lead.status.replace('_', ' ')}
                          </Badge>
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                            disabled={updatingId === lead.id}
                            className="rounded-lg border border-[var(--color-border)] bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                          >
                            {LEAD_STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
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

