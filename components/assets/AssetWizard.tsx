'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ASSET_TYPE_OPTIONS, AssetType } from '@/lib/assetTypes';
import { calculateValuation, formatValuationRange } from '@/lib/valuation';
import { z } from 'zod';
import { AssetBasicsSchema, AssetBusinessSchema, AssetPricingSchema } from '@/lib/schemas/asset';

const STEPS = [
  { id: 'basics', title: 'Basics', description: 'Type, title, and description' },
  { id: 'business', title: 'Business & Performance', description: 'Financial metrics and KPIs' },
  { id: 'pricing', title: 'Pricing', description: 'Set your asking price' },
  { id: 'media', title: 'Media & Proof', description: 'Screenshots and documentation' },
  { id: 'review', title: 'Review & Submit', description: 'Review all information' },
];

interface WizardData {
  // Basics
  type?: AssetType;
  title?: string;
  shortDescription?: string;
  fullDescription?: string;
  primaryLanguage?: string;
  websiteUrl?: string;
  
  // Business
  monthlyRevenue?: number;
  monthlyProfit?: number;
  mrr?: number;
  arr?: number;
  churnRate?: number;
  cac?: number;
  ltv?: number;
  monthlyVisitors?: number;
  emailSubscribers?: number;
  socialFollowers?: number;
  
  // Pricing
  askingPrice?: number;
  currency?: string;
  
  // Media (will be handled separately)
  media?: any[];
}

export default function AssetWizard({ assetId }: { assetId?: string }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [valuation, setValuation] = useState<any>(null);

  // Load existing asset if editing
  useEffect(() => {
    if (assetId) {
      fetch(`/api/assets/${assetId}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && result.data.asset) {
            setData(result.data.asset);
          }
        })
        .catch(console.error);
    }
  }, [assetId]);

  // Auto-save draft
  useEffect(() => {
    const saveDraft = async () => {
      try {
        const url = assetId ? `/api/assets/${assetId}` : '/api/assets';
        const method = assetId ? 'PUT' : 'POST';
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...data,
            status: 'DRAFT',
          }),
        });
      } catch (error) {
        // Silently fail for auto-save
        console.error('Auto-save failed:', error);
      }
    };

    const timer = setTimeout(() => {
      if (data.title || data.type) {
        saveDraft();
      }
    }, 30000); // Auto-save every 30 seconds
    return () => clearTimeout(timer);
  }, [data, assetId]);

  const saveDraft = async () => {
    try {
      const url = assetId ? `/api/assets/${assetId}` : '/api/assets';
      const method = assetId ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'DRAFT',
        }),
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
    }
  };

  // Calculate valuation when business data changes
  useEffect(() => {
    if (data.type && (data.monthlyProfit || data.mrr || data.arr || data.monthlyRevenue)) {
      const result = calculateValuation({
        type: data.type!,
        monthlyProfit: data.monthlyProfit,
        monthlyRevenue: data.monthlyRevenue,
        mrr: data.mrr,
        arr: data.arr,
      });
      setValuation(result);
    }
  }, [data.type, data.monthlyProfit, data.monthlyRevenue, data.mrr, data.arr]);

  const validateStep = (stepIndex: number): boolean => {
    const step = STEPS[stepIndex];
    setErrors({});

    if (step.id === 'basics') {
      const result = AssetBasicsSchema.safeParse(data);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
          newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
    } else if (step.id === 'business') {
      // Business step is optional, but if provided, validate
      if (data.churnRate !== undefined && (data.churnRate < 0 || data.churnRate > 100)) {
        setErrors({ churnRate: 'Churn rate must be between 0 and 100' });
        return false;
      }
    } else if (step.id === 'pricing') {
      const result = AssetPricingSchema.safeParse(data);
      if (!result.success) {
        const newErrors: Record<string, string> = {};
        result.error.issues.forEach((err: any) => {
          newErrors[err.path[0] as string] = err.message;
        });
        setErrors(newErrors);
        return false;
      }
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    setIsSubmitting(true);
    try {
      const url = assetId ? `/api/assets/${assetId}` : '/api/assets';
      const method = assetId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          status: 'SUBMITTED',
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        router.push(`/dashboard/assets/${result.data.asset.id}`);
      } else {
        alert(result.error || 'Failed to submit asset');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit asset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateData = (field: string, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const renderStep = () => {
    switch (STEPS[currentStep].id) {
      case 'basics':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Asset Type *</label>
              <select
                value={data.type || ''}
                onChange={(e) => updateData('type', e.target.value)}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
              >
                <option value="">Select type...</option>
                {ASSET_TYPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.type && <p className="text-red-400 text-sm mt-1">{errors.type}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={data.title || ''}
                onChange={(e) => updateData('title', e.target.value)}
                placeholder="e.g., Profitable SaaS with 1000+ users"
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
              />
              {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Short Description *</label>
              <textarea
                value={data.shortDescription || ''}
                onChange={(e) => updateData('shortDescription', e.target.value)}
                placeholder="Brief summary (10-500 characters)"
                rows={3}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
              />
              {errors.shortDescription && <p className="text-red-400 text-sm mt-1">{errors.shortDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Description *</label>
              <textarea
                value={data.fullDescription || ''}
                onChange={(e) => updateData('fullDescription', e.target.value)}
                placeholder="Detailed description (50-10000 characters)"
                rows={8}
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
              />
              {errors.fullDescription && <p className="text-red-400 text-sm mt-1">{errors.fullDescription}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website URL (optional)</label>
              <input
                type="url"
                value={data.websiteUrl || ''}
                onChange={(e) => updateData('websiteUrl', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
              />
            </div>
          </div>
        );

      case 'business':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Monthly Revenue</label>
                <input
                  type="number"
                  value={data.monthlyRevenue || ''}
                  onChange={(e) => updateData('monthlyRevenue', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Profit</label>
                <input
                  type="number"
                  value={data.monthlyProfit || ''}
                  onChange={(e) => updateData('monthlyProfit', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">MRR (for SaaS)</label>
                <input
                  type="number"
                  value={data.mrr || ''}
                  onChange={(e) => updateData('mrr', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ARR</label>
                <input
                  type="number"
                  value={data.arr || ''}
                  onChange={(e) => updateData('arr', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Churn Rate (%)</label>
                <input
                  type="number"
                  value={data.churnRate || ''}
                  onChange={(e) => updateData('churnRate', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Visitors</label>
                <input
                  type="number"
                  value={data.monthlyVisitors || ''}
                  onChange={(e) => updateData('monthlyVisitors', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-6">
            {valuation && valuation.suggestedMin && valuation.suggestedMax && (
              <div className="p-4 bg-blue-900/20 border border-blue-700 rounded-lg">
                <h3 className="font-semibold mb-2">Advisory Valuation</h3>
                <p className="text-sm text-slate-300 mb-2">
                  Based on your numbers, similar deals are usually listed between{' '}
                  <strong className="text-white">${valuation.suggestedMin.toLocaleString()}</strong> –{' '}
                  <strong className="text-white">${valuation.suggestedMax.toLocaleString()}</strong>.
                </p>
                <p className="text-xs text-slate-400 italic">
                  This is only a suggestion. You are free to set any price you want.
                </p>
                {valuation.explanation && (
                  <p className="text-xs text-slate-400 mt-2">{valuation.explanation}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Asking Price *</label>
              <div className="flex gap-2">
                <select
                  value={data.currency || 'USD'}
                  onChange={(e) => updateData('currency', e.target.value)}
                  className="px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="BRL">BRL</option>
                </select>
                <input
                  type="number"
                  value={data.askingPrice || ''}
                  onChange={(e) => updateData('askingPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="flex-1 px-4 py-2 border border-slate-700 rounded-lg bg-slate-900 text-white"
                />
              </div>
              {errors.askingPrice && <p className="text-red-400 text-sm mt-1">{errors.askingPrice}</p>}
              <p className="text-xs text-slate-400 mt-1">
                You control the price. Set any amount you believe is fair for your asset.
              </p>
            </div>
          </div>
        );

      case 'media':
        return (
          <div className="space-y-6">
            <p className="text-slate-400">
              Media upload functionality will be implemented separately. For now, you can proceed to review and submit.
            </p>
            <div className="p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-300">
                Note: Adding proof documents (screenshots, revenue reports, etc.) increases buyer confidence.
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Type</h3>
                <p className="text-slate-300">{data.type}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Title</h3>
                <p className="text-slate-300">{data.title}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Asking Price</h3>
                <p className="text-slate-300">
                  {data.currency || 'USD'} {data.askingPrice?.toLocaleString()}
                </p>
              </div>
              {/* Add more review fields as needed */}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    index === currentStep
                      ? 'bg-[#0044CC] text-white'
                      : index < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center hidden sm:block">{step.title}</p>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${index < currentStep ? 'bg-green-600' : 'bg-slate-700'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card className="bg-slate-900 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">{STEPS[currentStep].title}</CardTitle>
          <p className="text-slate-400 text-sm">{STEPS[currentStep].description}</p>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        {currentStep === STEPS.length - 1 ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#0044CC] hover:bg-[#0033AA]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="bg-[#0044CC] hover:bg-[#0033AA]"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

