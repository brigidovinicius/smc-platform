# ⚡ Quick Start - CounterX

**Comece a desenvolver em 5 minutos!**

---

## 🚀 Passo 1: Setup Inicial

```bash
# Clone o repositório (se ainda não fez)
git clone <repo-url>
cd saas-market-cap

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Inicie o servidor
npm run dev
```

Acesse: http://localhost:3000

---

## 📝 Passo 2: Criar Sua Primeira API

Crie `pages/api/test/route.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  return successResponse(res, { message: 'Hello World!' });
});
```

Teste: http://localhost:3000/api/test

---

## 🎨 Passo 3: Criar Seu Primeiro Componente

Crie `components/Hello.tsx`:

```typescript
import { cn } from '@/lib/utils/utils';

interface HelloProps {
  name: string;
  className?: string;
}

export function Hello({ name, className }: HelloProps) {
  return (
    <div className={cn("p-4 bg-blue-500 text-white rounded", className)}>
      Olá, {name}!
    </div>
  );
}
```

Use em qualquer página:

```typescript
import { Hello } from '@/components/Hello';

export default function Page() {
  return <Hello name="Mundo" />;
}
```

---

## 📚 Próximos Passos

1. ✅ Leia o [Guia Rápido](GUIA-RAPIDO-DESENVOLVEDOR.md)
2. ✅ Veja o [Exemplo de API Completa](EXEMPLO-API-COMPLETA.md)
3. ✅ Consulte as [Convenções](CONVENCOES-CODIGO.md)

---

## 🆘 Problemas?

- **Erro ao instalar?** → Verifique Node.js (v18+)
- **Erro de build?** → Execute `npm run lint`
- **Dúvidas?** → Consulte [README-DESENVOLVIMENTO.md](../README-DESENVOLVIMENTO.md)

---

**Pronto! Você está desenvolvendo! 🎉**



