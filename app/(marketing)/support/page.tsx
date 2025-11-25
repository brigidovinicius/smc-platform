import { MarketingPageLayout } from '@/app/(marketing)/_components/MarketingPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, MessageSquare, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <MarketingPageLayout>
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Suporte</h1>
            <p className="text-lg text-slate-600">
              Estamos aqui para ajudar. Entre em contato conosco através dos canais abaixo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle>Email</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Envie-nos um email e responderemos o mais rápido possível.
                </p>
                <a href="mailto:suporte@counterx.io" className="text-primary hover:underline font-medium">
                  suporte@counterx.io
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle>FAQ</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Consulte nossas perguntas frequentes para respostas rápidas.
                </p>
                <Button variant="outline" asChild>
                  <Link href="/faq">Ver FAQ</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Horário de Atendimento</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">
                Nosso time de suporte está disponível de segunda a sexta, das 9h às 18h (horário de Brasília).
                Respondemos emails em até 24 horas úteis.
              </p>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild>
              <Link href="/">Voltar para início</Link>
            </Button>
          </div>
        </div>
      </div>
    </MarketingPageLayout>
  );
}
