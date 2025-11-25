import type { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const metadata: Metadata = {
  title: 'Platform Settings | Admin | CounterX',
  description: 'Admin panel for platform settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Platform Settings</h1>
        <p className="text-[var(--color-text-secondary)] mt-2">Configure site-wide settings, branding, and SEO defaults</p>
      </div>

      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="siteName">Site Name</Label>
            <Input id="siteName" defaultValue="CounterX" />
          </div>
          <div>
            <Label htmlFor="siteDescription">Site Description</Label>
            <Input id="siteDescription" defaultValue="The modern platform for digital asset M&A" />
          </div>
          <div>
            <Label htmlFor="siteUrl">Site URL</Label>
            <Input id="siteUrl" defaultValue="https://counterx.io" />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Defaults</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="defaultTitle">Default Meta Title</Label>
            <Input id="defaultTitle" defaultValue="CounterX – The Digital Deal Desk" />
          </div>
          <div>
            <Label htmlFor="defaultDescription">Default Meta Description</Label>
            <Input id="defaultDescription" defaultValue="CounterX is the modern platform for buying, selling, and valuing SaaS and digital assets." />
          </div>
          <Button>Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
}

