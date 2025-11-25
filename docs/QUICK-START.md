# ⚡ Quick Start - CounterX

**Start building in under 5 minutes.**

---

## 🚀 Step 1: Initial setup

```bash
# Clone the repository
git clone <repo-url>
cd saas-market-cap

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start the dev server
npm run dev
```

Visit http://localhost:3000 (or the port shown in the console).

---

## 📝 Step 2: Create your first API route

Create `pages/api/test.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler, successResponse } from '@/lib/api';
import type { ApiResponse } from '@/lib/api';

export default apiHandler(async (req: NextApiRequest, res: NextApiResponse<ApiResponse>) => {
  return successResponse(res, { message: 'Hello World!' });
});
```

Test at http://localhost:3000/api/test

---

## 🎨 Step 3: Create your first component

Create `components/Hello.tsx`:

```typescript
import { cn } from '@/lib/utils/utils';

interface HelloProps {
  name: string;
  className?: string;
}

export function Hello({ name, className }: HelloProps) {
  return (
    <div className={cn("p-4 bg-blue-500 text-white rounded", className)}>
      Hello, {name}!
    </div>
  );
}
```

Use it anywhere:

```typescript
import { Hello } from '@/components/Hello';

export default function Page() {
  return <Hello name="CounterX" />;
}
```

---

## 📚 Next steps

1. ✅ Read the [Developer Quick Guide](GUIA-RAPIDO-DESENVOLVEDOR.md)
2. ✅ Review the [Complete API Example](EXEMPLO-API-COMPLETA.md)
3. ✅ Follow the [Code Conventions](CONVENCOES-CODIGO.md)

---

## 🆘 Need help?

- **Install errors?** → Check your Node.js version (v18+)
- **Build errors?** → Run `npm run lint`
- **Questions?** → See [README-DESENVOLVIMENTO.md](../README-DESENVOLVIMENTO.md)

---

**You're ready to build with CounterX! 🎉**



