'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calculator, TrendingUp, DollarSign, AlertCircle, Users, Globe, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { HelpTooltip } from '@/components/ui/HelpTooltip';

interface ValuationResult {
  arr: number;
  multiple: number;
  valuation: number;
  breakdown: {
    revenueScore: number;
    growthScore: number;
    churnScore: number;
    profitabilityScore: number;
    efficiencyScore: number;
  };
}

export default function ValuationCalculator() {
  // Revenue Metrics
  const [mrr, setMrr] = useState('');
  const [ttmRevenue, setTtmRevenue] = useState('');
  const [lastMonthRevenue, setLastMonthRevenue] = useState('');

  // Profit Metrics
  const [ttmProfit, setTtmProfit] = useState('');
  const [lastMonthProfit, setLastMonthProfit] = useState('');

  // Growth & Efficiency
  const [annualGrowthRate, setAnnualGrowthRate] = useState('');
  const [churnRate, setChurnRate] = useState('');
  const [customers, setCustomers] = useState('');
  const [cac, setCac] = useState('');
  const [ltv, setLtv] = useState('');
  const [webTraffic, setWebTraffic] = useState('');

  // Auto-calculate ARR from MRR
  const arr = useMemo(() => {
    const mrrValue = parseFloat(mrr) || 0;
    return mrrValue * 12;
  }, [mrr]);

  // Auto-calculate ARR from TTM Revenue if MRR not provided
  const calculatedArr = useMemo(() => {
    if (arr > 0) return arr;
    const ttmValue = parseFloat(ttmRevenue) || 0;
    return ttmValue;
  }, [arr, ttmRevenue]);

  const calculateValuation = (): ValuationResult | null => {
    const mrrValue = parseFloat(mrr) || 0;
    const ttmRevValue = parseFloat(ttmRevenue) || 0;
    const ttmProfitValue = parseFloat(ttmProfit) || 0;
    const growthValue = parseFloat(annualGrowthRate) || 0;
    const churnValue = parseFloat(churnRate) || 0;
    const customersValue = parseFloat(customers) || 0;
    const cacValue = parseFloat(cac) || 0;
    const ltvValue = parseFloat(ltv) || 0;

    // Use MRR-based ARR or TTM Revenue
    const baseArr = arr > 0 ? arr : ttmRevValue;
    
    if (baseArr === 0) return null;

    // Base multiple starts at 3.0x
    let multiple = 3.0;

    // Revenue Score (0-1.5x adjustment)
    const revenueScore = baseArr > 1000000 ? 1.5 : baseArr > 500000 ? 1.0 : baseArr > 100000 ? 0.5 : 0;
    multiple += revenueScore * 0.5;

    // Growth Score (0-2.0x adjustment)
    let growthScore = 0;
    if (growthValue > 100) growthScore = 2.0;
    else if (growthValue > 50) growthScore = 1.5;
    else if (growthValue > 30) growthScore = 1.0;
    else if (growthValue > 20) growthScore = 0.5;
    multiple += growthScore * 0.5;

    // Churn Score (0-1.5x adjustment)
    let churnScore = 0;
    if (churnValue === 0) churnScore = 1.5;
    else if (churnValue < 2) churnScore = 1.0;
    else if (churnValue < 5) churnScore = 0.5;
    else if (churnValue > 10) churnScore = -0.5;
    else if (churnValue > 15) churnScore = -1.0;
    multiple += churnScore * 0.5;

    // Profitability Score (0-1.0x adjustment)
    let profitabilityScore = 0;
    if (ttmProfitValue > 0 && ttmRevValue > 0) {
      const profitMargin = (ttmProfitValue / ttmRevValue) * 100;
      if (profitMargin > 30) profitabilityScore = 1.0;
      else if (profitMargin > 20) profitabilityScore = 0.7;
      else if (profitMargin > 10) profitabilityScore = 0.4;
      else if (profitMargin < 0) profitabilityScore = -0.5;
    }
    multiple += profitabilityScore * 0.5;

    // Efficiency Score (LTV/CAC ratio) (0-1.0x adjustment)
    let efficiencyScore = 0;
    if (ltvValue > 0 && cacValue > 0) {
      const ltvCacRatio = ltvValue / cacValue;
      if (ltvCacRatio > 5) efficiencyScore = 1.0;
      else if (ltvCacRatio > 3) efficiencyScore = 0.7;
      else if (ltvCacRatio > 2) efficiencyScore = 0.4;
      else if (ltvCacRatio < 1) efficiencyScore = -0.5;
    }
    multiple += efficiencyScore * 0.5;

    // Ensure multiple is within reasonable bounds (1.0x to 15.0x)
    multiple = Math.max(1.0, Math.min(15.0, multiple));

    const valuation = baseArr * multiple;

    return {
      arr: baseArr,
      multiple,
      valuation,
      breakdown: {
        revenueScore,
        growthScore,
        churnScore,
        profitabilityScore,
        efficiencyScore,
      },
    };
  };

  const result = calculateValuation();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Revenue Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mrr">MRR (Monthly Recurring Revenue)</Label>
                  <HelpTooltip content="MRR is your SaaS&apos;s monthly recurring revenue. It&apos;s the sum of all active monthly subscriptions. If you have annual revenue, divide by 12 to get MRR." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="mrr"
                    type="number"
                    value={mrr}
                    onChange={(e) => setMrr(e.target.value)}
                    placeholder="Ex: 10000"
                    className="pl-10"
                  />
                </div>
                {arr > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Calculated ARR: {arr.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 })}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ttmRevenue">TTM Revenue (Last 12 months)</Label>
                  <HelpTooltip content="TTM (Trailing Twelve Months) is the total revenue from the last 12 months. Use this metric if you don&apos;t have constant monthly MRR or want to use annual revenue." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ttmRevenue"
                    type="number"
                    value={ttmRevenue}
                    onChange={(e) => setTtmRevenue(e.target.value)}
                    placeholder="Ex: 120000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="lastMonthRevenue">Last Month Revenue</Label>
                  <HelpTooltip content="Total revenue from the most recent month. Useful for understanding recent growth trends." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastMonthRevenue"
                    type="number"
                    value={lastMonthRevenue}
                    onChange={(e) => setLastMonthRevenue(e.target.value)}
                    placeholder="Ex: 12000"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profit Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Profitability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ttmProfit">TTM Profit (Last 12 months)</Label>
                  <HelpTooltip content="Net profit from the last 12 months (revenue minus all costs). A high profit margin increases valuation." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ttmProfit"
                    type="number"
                    value={ttmProfit}
                    onChange={(e) => setTtmProfit(e.target.value)}
                    placeholder="Ex: 30000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="lastMonthProfit">Last Month Profit</Label>
                  <HelpTooltip content="Net profit from the most recent month. Shows current profitability trends." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="lastMonthProfit"
                    type="number"
                    value={lastMonthProfit}
                    onChange={(e) => setLastMonthProfit(e.target.value)}
                    placeholder="Ex: 3000"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Growth & Metrics Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Growth & Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="growth">Annual Growth Rate (%)</Label>
                  <HelpTooltip content="Annual revenue growth percentage. SaaS with growth above 50% per year receive higher multiples in valuation." />
                </div>
                <div className="relative mt-2">
                  <TrendingUp className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="growth"
                    type="number"
                    value={annualGrowthRate}
                    onChange={(e) => setAnnualGrowthRate(e.target.value)}
                    placeholder="Ex: 50"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="churn">Monthly Churn Rate (%)</Label>
                  <HelpTooltip content="Percentage of customers who cancel their subscription per month. Low churn (less than 5%) increases valuation, while high churn (above 10%) reduces it." />
                </div>
                <div className="relative mt-2">
                  <AlertCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="churn"
                    type="number"
                    value={churnRate}
                    onChange={(e) => setChurnRate(e.target.value)}
                    placeholder="Ex: 5"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="customers">Number of Customers</Label>
                  <HelpTooltip content="Total active paying customers. Useful for calculating metrics like average revenue per user (ARPU)." />
                </div>
                <div className="relative mt-2">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="customers"
                    type="number"
                    value={customers}
                    onChange={(e) => setCustomers(e.target.value)}
                    placeholder="Ex: 150"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="cac">CAC (Customer Acquisition Cost)</Label>
                  <HelpTooltip content="Total marketing and sales costs divided by the number of new customers acquired. Ideally, LTV should be at least 3x higher than CAC." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="cac"
                    type="number"
                    value={cac}
                    onChange={(e) => setCac(e.target.value)}
                    placeholder="Ex: 500"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ltv">LTV (Lifetime Value)</Label>
                  <HelpTooltip content="Total expected revenue from a customer during their entire active period. Calculated as average monthly revenue divided by churn rate. An LTV/CAC above 3x is considered healthy." />
                </div>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="ltv"
                    type="number"
                    value={ltv}
                    onChange={(e) => setLtv(e.target.value)}
                    placeholder="Ex: 2000"
                    className="pl-10"
                  />
                </div>
                {ltv && cac && parseFloat(ltv) > 0 && parseFloat(cac) > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    LTV/CAC: {(parseFloat(ltv) / parseFloat(cac)).toFixed(2)}x
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="traffic">Monthly Web Traffic (optional)</Label>
                  <HelpTooltip content="Number of unique visitors per month on your site. Useful for understanding growth potential and organic marketing." />
                </div>
                <div className="relative mt-2">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="traffic"
                    type="number"
                    value={webTraffic}
                    onChange={(e) => setWebTraffic(e.target.value)}
                    placeholder="Ex: 50000"
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Estimated Valuation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Main Valuation */}
                  <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Estimated Valuation</p>
                    <p className="text-4xl font-bold text-foreground">
                      {result.valuation.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* ARR */}
                  <div className="bg-muted/50 rounded-xl p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">ARR</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {result.arr.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* Multiple */}
                  <div className="bg-muted/50 rounded-xl p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">Applied Multiple</p>
                    <p className="text-2xl font-semibold text-primary">
                      {result.multiple.toFixed(1)}x ARR
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-semibold text-foreground">Adjustment Factors:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Revenue</span>
                        <Badge variant={result.breakdown.revenueScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.revenueScore > 0 ? '+' : ''}
                          {(result.breakdown.revenueScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Growth</span>
                        <Badge variant={result.breakdown.growthScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.growthScore > 0 ? '+' : ''}
                          {(result.breakdown.growthScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Churn</span>
                        <Badge variant={result.breakdown.churnScore > 0 ? 'default' : 'destructive'}>
                          {result.breakdown.churnScore > 0 ? '+' : ''}
                          {(result.breakdown.churnScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Profitability</span>
                        <Badge variant={result.breakdown.profitabilityScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.profitabilityScore > 0 ? '+' : ''}
                          {(result.breakdown.profitabilityScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded col-span-2">
                        <span className="text-muted-foreground">Efficiency (LTV/CAC)</span>
                        <Badge variant={result.breakdown.efficiencyScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.efficiencyScore > 0 ? '+' : ''}
                          {(result.breakdown.efficiencyScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-4 border-t">
                    * This is an estimate based on market multiples. For a complete and accurate assessment, list your asset on the platform.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Fill in at least MRR or TTM Revenue to calculate
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

