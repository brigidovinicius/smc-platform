'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface BadgeDefinition {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: 'USER_BADGE' | 'ASSET_BADGE';
  automatic: boolean;
  criteria: string | null;
  icon: string | null;
  color: string | null;
}

export default function AdminBadgesPage() {
  const [badges, setBadges] = useState<BadgeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBadge, setEditingBadge] = useState<BadgeDefinition | null>(null);

  useEffect(() => {
    loadBadges();
  }, []);

  const loadBadges = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/badges', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        setBadges(result.data.badges || []);
      } else {
        console.error('Error loading badges:', result.error);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este badge?')) return;

    try {
      const response = await fetch(`/api/admin/badges/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success) {
        loadBadges();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Failed to delete badge:', error);
      alert('Erro ao excluir badge');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sistema de Badges</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie badges de usuários e assets
          </p>
        </div>
        <Button onClick={() => { setEditingBadge(null); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Criar Badge
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badges Definidos ({badges.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : badges.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhum badge definido ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{badge.name}</h3>
                      <Badge variant="outline">{badge.type}</Badge>
                      {badge.automatic && (
                        <Badge variant="secondary">Automático</Badge>
                      )}
                    </div>
                    {badge.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {badge.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Slug: {badge.slug}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setEditingBadge(badge); setShowForm(true); }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(badge.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {showForm && (
        <BadgeForm
          badge={editingBadge}
          onClose={() => { setShowForm(false); setEditingBadge(null); }}
          onSuccess={() => { setShowForm(false); setEditingBadge(null); loadBadges(); }}
        />
      )}
    </div>
  );
}

function BadgeForm({ badge, onClose, onSuccess }: { badge: BadgeDefinition | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: badge?.name || '',
    slug: badge?.slug || '',
    description: badge?.description || '',
    type: badge?.type || 'USER_BADGE',
    automatic: badge?.automatic || false,
    criteria: badge?.criteria || '',
    icon: badge?.icon || '',
    color: badge?.color || '#3b82f6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = badge ? `/api/admin/badges/${badge.id}` : '/api/admin/badges';
      const method = badge ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (result.success) {
        onSuccess();
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error('Failed to save badge:', error);
      alert('Erro ao salvar badge');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{badge ? 'Editar Badge' : 'Criar Badge'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipo *</label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="USER_BADGE">Badge de Usuário</option>
              <option value="ASSET_BADGE">Badge de Asset</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="automatic"
              checked={formData.automatic}
              onChange={(e) => setFormData(prev => ({ ...prev, automatic: e.target.checked }))}
              className="w-4 h-4"
            />
            <label htmlFor="automatic" className="text-sm">
              Badge automático (atribuído por regras)
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Critérios (JSON)</label>
            <textarea
              value={formData.criteria}
              onChange={(e) => setFormData(prev => ({ ...prev, criteria: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
              rows={4}
              placeholder='{"minAssets": 5, "minRevenue": 1000}'
            />
          </div>
          <div className="flex gap-3">
            <Button type="submit">Salvar</Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

