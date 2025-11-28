'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save } from 'lucide-react';

interface PlatformSettings {
  commissionPercentage: number;
  premiumPlans: {
    titanium: number;
    neodymium: number;
    graphene: number;
  };
  stealthModeEnabled: boolean;
  valuationAutoEnabled: boolean;
  seo: {
    title: string;
    description: string;
  };
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  featureFlags: {
    [key: string]: boolean;
  };
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<PlatformSettings>({
    commissionPercentage: 5,
    premiumPlans: {
      titanium: 29,
      neodymium: 99,
      graphene: 299,
    },
    stealthModeEnabled: false,
    valuationAutoEnabled: true,
    seo: {
      title: 'CounterX - Marketplace de Assets Digitais',
      description: 'Compre e venda assets digitais prontos para escalar',
    },
    socialLinks: {},
    featureFlags: {},
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/settings', {
        credentials: 'include',
      });
      const result = await response.json();
      if (result.success && result.data) {
        setSettings({ ...settings, ...result.data });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(settings),
      });

      const result = await response.json();
      if (result.success) {
        alert('Configurações salvas com sucesso!');
      } else {
        alert(result.error || 'Erro ao salvar configurações');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configurações da Plataforma</h1>
          <p className="text-muted-foreground mt-2">
            Configure regras, comissões e recursos da plataforma
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Salvar
        </Button>
      </div>

      {/* Commission */}
      <Card>
        <CardHeader>
          <CardTitle>Comissão</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Percentual de Comissão (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={settings.commissionPercentage}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                commissionPercentage: parseFloat(e.target.value) || 0
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Premium Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Planos Premium</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Titanium (USD)</label>
              <input
                type="number"
                value={settings.premiumPlans.titanium}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  premiumPlans: {
                    ...prev.premiumPlans,
                    titanium: parseFloat(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Neodymium (USD)</label>
              <input
                type="number"
                value={settings.premiumPlans.neodymium}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  premiumPlans: {
                    ...prev.premiumPlans,
                    neodymium: parseFloat(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graphene (USD)</label>
              <input
                type="number"
                value={settings.premiumPlans.graphene}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  premiumPlans: {
                    ...prev.premiumPlans,
                    graphene: parseFloat(e.target.value) || 0
                  }
                }))}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle>Recursos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Stealth Mode</label>
              <p className="text-xs text-muted-foreground">
                Permite que assets sejam listados sem revelar informações sensíveis
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.stealthModeEnabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                stealthModeEnabled: e.target.checked
              }))}
              className="w-4 h-4"
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium">Valuation Automático</label>
              <p className="text-xs text-muted-foreground">
                Calcula valuation automaticamente baseado em métricas
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.valuationAutoEnabled}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                valuationAutoEnabled: e.target.checked
              }))}
              className="w-4 h-4"
            />
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              type="text"
              value={settings.seo.title}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                seo: { ...prev.seo, title: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={settings.seo.description}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                seo: { ...prev.seo, description: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle>Links Sociais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Twitter</label>
            <input
              type="url"
              value={settings.socialLinks.twitter || ''}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, twitter: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://twitter.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">LinkedIn</label>
            <input
              type="url"
              value={settings.socialLinks.linkedin || ''}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, linkedin: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://linkedin.com/company/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Instagram</label>
            <input
              type="url"
              value={settings.socialLinks.instagram || ''}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                socialLinks: { ...prev.socialLinks, instagram: e.target.value }
              }))}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="https://instagram.com/..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

