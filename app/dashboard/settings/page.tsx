'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const user = session?.user;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // TODO: Implementar atualização de perfil
    setTimeout(() => {
      setLoading(false);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    }, 1000);
  };

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader 
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isSidebarOpen={sidebarOpen}
      />
      <DashboardSidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : ''}`}>
        <div className="container mx-auto px-4 py-8 space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your preferences and account information
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    defaultValue={user?.name || ''}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    placeholder="seu@email.com"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Configure your notification and display preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your offers and assets
                    </p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark theme by default
                    </p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {message && (
              <div className={`rounded-lg border p-4 ${
                message.type === 'success'
                  ? 'border-green-500/50 bg-green-500/10 text-green-400'
                  : 'border-red-500/50 bg-red-500/10 text-red-400'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

