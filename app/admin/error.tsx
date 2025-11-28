'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Admin Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Erro ao Carregar</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Ocorreu um erro ao carregar a página admin. Isso pode acontecer se:
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
            <li>As migrations do Prisma não foram executadas</li>
            <li>O banco de dados não está configurado</li>
            <li>Há um problema de conexão com o banco</li>
          </ul>
          <div className="space-y-2">
            <p className="text-xs font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
              npx prisma migrate dev
            </p>
            <p className="text-xs text-muted-foreground">
              Execute este comando para criar as tabelas necessárias
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={reset} variant="default">
              Tentar Novamente
            </Button>
            <Button onClick={() => window.location.href = '/admin'} variant="outline">
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

