'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { LEAD_BUYER_TYPES } from '@/lib/leads/constants';
import { Button } from '@/components/ui/button';

const BUDGET_OPTIONS = [
  { value: '<5k', label: 'Até $5k' },
  { value: '5k-20k', label: '$5k – $20k' },
  { value: '20k-100k', label: '$20k – $100k' },
  { value: '100k+', label: 'Acima de $100k' },
];

interface LeadInterestFormProps {
  assetId: string;
  assetTitle: string;
  assetSlug: string;
}

export function LeadInterestForm({ assetId, assetTitle, assetSlug }: LeadInterestFormProps) {
  const [formVisible, setFormVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    buyerType: LEAD_BUYER_TYPES[0].value,
    budgetRange: '',
    message: '',
  });

  const handleChange =
    (field: string) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          name: formData.name,
          email: formData.email,
          buyerType: formData.buyerType,
          budgetRange: formData.budgetRange,
          message: formData.message,
          source: 'marketplace',
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Não foi possível enviar seu interesse.');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        buyerType: LEAD_BUYER_TYPES[0].value,
        budgetRange: '',
        message: '',
      });
    } catch (err: any) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setFormVisible(false);
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">Interessado neste ativo?</h2>
        <p className="text-slate-600 text-sm">
          Envie seus dados e nosso time retornará com materiais adicionais sobre <strong>{assetTitle}</strong>.
        </p>
      </div>

      {!formVisible && !success && (
        <Button
          size="lg"
          className="px-6 py-3 rounded-full bg-[#0044CC] text-white font-medium hover:bg-[#0033AA] transition-colors"
          onClick={() => setFormVisible(true)}
        >
          Quero saber mais
        </Button>
      )}

      {formVisible && !success && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Nome completo *</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0044CC]"
                placeholder="Seu nome"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">E-mail *</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0044CC]"
                placeholder="voce@empresa.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Perfil do comprador</label>
              <select
                value={formData.buyerType}
                onChange={handleChange('buyerType')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0044CC]"
              >
                {LEAD_BUYER_TYPES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Faixa de orçamento</label>
              <select
                value={formData.budgetRange}
                onChange={handleChange('budgetRange')}
                className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#0044CC]"
              >
                <option value="">Selecione</option>
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Mensagem *</label>
            <textarea
              required
              value={formData.message}
              onChange={handleChange('message')}
              rows={4}
              placeholder="Conte um pouco sobre você/empresa e o que busca."
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0044CC]"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="px-6 py-3 rounded-full bg-[#0044CC] text-white font-semibold hover:bg-[#0033AA] transition-colors disabled:opacity-70"
            >
              {submitting ? 'Enviando...' : 'Enviar interesse'}
            </Button>
            <button
              type="button"
              className="text-sm text-slate-500 hover:text-slate-700"
              onClick={() => setFormVisible(false)}
              disabled={submitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {success && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
          <p className="text-emerald-800 font-semibold">Recebemos seu interesse!</p>
          <p className="text-sm text-emerald-700">
            Nossa equipe entrará em contato em breve para compartilhar detalhes adicionais sobre {assetTitle}.
          </p>
          <div className="flex gap-4">
            <Button
              variant="secondary"
              className="bg-white text-[#0044CC] border border-[#0044CC]"
              onClick={handleReset}
            >
              Enviar novo interesse
            </Button>
            <a
              href={`/assets/${assetSlug}`}
              className="text-sm text-slate-600 hover:text-slate-900 underline"
            >
              Voltar para o ativo
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

