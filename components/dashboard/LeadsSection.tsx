'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState';
import { Mail, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  buyerType?: string;
  budgetRange?: string;
  createdAt: string;
  asset?: {
    id: string;
    title: string;
    slug: string;
  };
}

interface LeadsSectionProps {
  userId: string;
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: any }> = {
  NEW: { label: 'New', variant: 'default', icon: Clock },
  IN_CONTACT: { label: 'In Contact', variant: 'secondary', icon: MessageSquare },
  PROPOSAL_SENT: { label: 'Proposal Sent', variant: 'secondary', icon: Mail },
  WON: { label: 'Won', variant: 'default', icon: CheckCircle },
  LOST: { label: 'Lost', variant: 'destructive', icon: XCircle },
};

export default function LeadsSection({ userId }: LeadsSectionProps) {
  const [leadsReceived, setLeadsReceived] = useState<Lead[]>([]);
  const [leadsSent, setLeadsSent] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  useEffect(() => {
    fetchLeads();
  }, [userId]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/me/leads', {
        credentials: 'include',
        cache: 'no-store',
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setLeadsReceived(data.data.received || []);
          setLeadsSent(data.data.sent || []);
        }
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const leadsToShow = activeTab === 'received' ? leadsReceived : leadsSent;
  const StatusIcon = (status: string) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.NEW;
    return config.icon;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#0044CC] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-foreground">My Leads</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Manage leads for your assets and track your inquiries
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'received'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Received ({leadsReceived.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'sent'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sent ({leadsSent.length})
        </button>
      </div>

      {/* Leads List */}
      {leadsToShow.length > 0 ? (
        <div className="space-y-4">
          {leadsToShow.map((lead) => {
            const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG.NEW;
            const Icon = StatusIcon(lead.status);
            
            return (
              <div
                key={lead.id}
                className="rounded-lg border bg-card p-4 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{lead.name}</h4>
                      <Badge variant={statusConfig.variant}>
                        <Icon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{lead.email}</p>
                    {lead.asset && (
                      <Link
                        href={`/assets/${lead.asset.slug}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {lead.asset.title}
                      </Link>
                    )}
                    <p className="text-sm">{lead.message}</p>
                    {lead.budgetRange && (
                      <p className="text-xs text-muted-foreground">
                        Budget: {lead.budgetRange}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title={`No ${activeTab === 'received' ? 'received' : 'sent'} leads`}
          description={
            activeTab === 'received'
              ? 'Leads from interested buyers will appear here.'
              : 'Leads you submit will appear here.'
          }
        />
      )}
    </section>
  );
}

