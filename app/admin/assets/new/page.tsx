'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ASSET_TYPE_OPTIONS } from '@/lib/assetTypes';
import { Loader2 } from 'lucide-react';

export default function AdminCreateAssetPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    type: 'SAAS',
    askingPrice: '',
    currency: 'USD',
    ownerId: '',
    autoPublish: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/assets/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          askingPrice: parseFloat(formData.askingPrice)
        })
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/admin/assets/${result.data.id}`);
      } else {
        alert(result.error || 'Erro ao criar asset');
      }
    } catch (error) {
      console.error('Error creating asset:', error);
      alert('Erro ao criar asset');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Criar Asset Manualmente</h1>
        <p className="text-muted-foreground mt-2">
          Crie um asset para um founder ou novo usuário
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Asset</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Owner ID (ID do usuário proprietário)
              </label>
              <input
                type="text"
                required
                value={formData.ownerId}
                onChange={(e) => setFormData(prev => ({ ...prev, ownerId: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="cuid..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Título *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Slug *</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="meu-asset-unico"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo *</label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {ASSET_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição Curta *</label>
              <textarea
                required
                value={formData.shortDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Descrição Completa *</label>
              <textarea
                required
                value={formData.fullDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, fullDescription: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg"
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Preço *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  value={formData.askingPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, askingPrice: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Moeda</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="USD">USD</option>
                  <option value="BRL">BRL</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="autoPublish"
                checked={formData.autoPublish}
                onChange={(e) => setFormData(prev => ({ ...prev, autoPublish: e.target.checked }))}
                className="w-4 h-4"
              />
              <label htmlFor="autoPublish" className="text-sm">
                Publicar automaticamente (status: PUBLISHED)
              </label>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Criar Asset
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

