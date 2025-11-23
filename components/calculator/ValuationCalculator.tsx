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
                Receita
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="mrr">MRR (Receita Recorrente Mensal)</Label>
                  <HelpTooltip content="MRR é a receita recorrente mensal do seu SaaS. É a soma de todas as assinaturas mensais ativas. Se você tem receita anual, divida por 12 para obter o MRR." />
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
                    ARR calculado: {arr.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ttmRevenue">Receita TTM (Últimos 12 meses)</Label>
                  <HelpTooltip content="TTM (Trailing Twelve Months) é a receita total dos últimos 12 meses. Use esta métrica se não tiver MRR mensal constante ou se quiser usar receita anual." />
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
                  <Label htmlFor="lastMonthRevenue">Receita do Último Mês</Label>
                  <HelpTooltip content="Receita total do mês mais recente. Útil para entender a tendência de crescimento recente." />
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
                Lucratividade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="ttmProfit">Lucro TTM (Últimos 12 meses)</Label>
                  <HelpTooltip content="Lucro líquido dos últimos 12 meses (receita menos todos os custos). Uma margem de lucro alta aumenta o valuation." />
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
                  <Label htmlFor="lastMonthProfit">Lucro do Último Mês</Label>
                  <HelpTooltip content="Lucro líquido do mês mais recente. Mostra a tendência de lucratividade atual." />
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
                Crescimento e Métricas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="growth">Taxa de Crescimento Anual (%)</Label>
                  <HelpTooltip content="Percentual de crescimento anual da receita. SaaS com crescimento acima de 50% ao ano recebem múltiplos maiores no valuation." />
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
                  <Label htmlFor="churn">Taxa de Churn Mensal (%)</Label>
                  <HelpTooltip content="Percentual de clientes que cancelam a assinatura por mês. Churn baixo (menos de 5%) aumenta o valuation, enquanto churn alto (acima de 10%) reduz." />
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
                  <Label htmlFor="customers">Número de Clientes</Label>
                  <HelpTooltip content="Total de clientes ativos pagantes. Útil para calcular métricas como receita média por cliente (ARPU)." />
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
                  <Label htmlFor="cac">CAC (Custo de Aquisição de Cliente)</Label>
                  <HelpTooltip content="Custo total de marketing e vendas dividido pelo número de novos clientes adquiridos. Idealmente, o LTV deve ser pelo menos 3x maior que o CAC." />
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
                  <Label htmlFor="ltv">LTV (Valor do Cliente ao Longo da Vida)</Label>
                  <HelpTooltip content="Receita total esperada de um cliente durante todo o tempo que permanece ativo. Calculado como receita média mensal dividida pela taxa de churn. Um LTV/CAC acima de 3x é considerado saudável." />
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
                  <Label htmlFor="traffic">Tráfego Web Mensal (opcional)</Label>
                  <HelpTooltip content="Número de visitantes únicos por mês no seu site. Útil para entender o potencial de crescimento e marketing orgânico." />
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
                Valuation Estimado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  {/* Main Valuation */}
                  <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl p-6 border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-2">Valuation Estimado</p>
                    <p className="text-4xl font-bold text-foreground">
                      {result.valuation.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* ARR */}
                  <div className="bg-muted/50 rounded-xl p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">ARR</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {result.arr.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        minimumFractionDigits: 0,
                      })}
                    </p>
                  </div>

                  {/* Multiple */}
                  <div className="bg-muted/50 rounded-xl p-4 border">
                    <p className="text-sm text-muted-foreground mb-1">Múltiplo Aplicado</p>
                    <p className="text-2xl font-semibold text-primary">
                      {result.multiple.toFixed(1)}x ARR
                    </p>
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-3 pt-4 border-t">
                    <p className="text-sm font-semibold text-foreground">Fatores de Ajuste:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Receita</span>
                        <Badge variant={result.breakdown.revenueScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.revenueScore > 0 ? '+' : ''}
                          {(result.breakdown.revenueScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded">
                        <span className="text-muted-foreground">Crescimento</span>
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
                        <span className="text-muted-foreground">Lucratividade</span>
                        <Badge variant={result.breakdown.profitabilityScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.profitabilityScore > 0 ? '+' : ''}
                          {(result.breakdown.profitabilityScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-muted/50 rounded col-span-2">
                        <span className="text-muted-foreground">Eficiência (LTV/CAC)</span>
                        <Badge variant={result.breakdown.efficiencyScore > 0 ? 'default' : 'outline'}>
                          {result.breakdown.efficiencyScore > 0 ? '+' : ''}
                          {(result.breakdown.efficiencyScore * 0.5).toFixed(1)}x
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground text-center pt-4 border-t">
                    * Esta é uma estimativa baseada em múltiplos de mercado. Para uma avaliação completa e precisa, cadastre seu ativo na plataforma.
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">
                    Preencha pelo menos o MRR ou Receita TTM para calcular
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

