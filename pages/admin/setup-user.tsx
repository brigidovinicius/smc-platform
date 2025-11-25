/**
 * Página temporária para configurar usuário admin
 * REMOVER APÓS USO!
 */

import { useState } from 'react';

export default function SetupUserPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSetup = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/admin/setup-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'brigido254@gmail.com',
          password: 'admin123456',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Erro ao configurar usuário');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer requisição');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Configurar Usuário Admin
        </h1>

        <div className="mb-6">
          <p className="text-slate-600 mb-4">
            Esta página irá configurar o usuário admin no banco de dados de produção.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-slate-700">
              <strong>Email:</strong> brigido254@gmail.com
            </p>
            <p className="text-sm text-slate-700">
              <strong>Senha:</strong> admin123456
            </p>
          </div>
        </div>

        <button
          onClick={handleSetup}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Configurando...
            </span>
          ) : (
            'Configurar Usuário Admin'
          )}
        </button>

        {result && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm font-semibold mb-2">✅ Sucesso!</p>
            <pre className="text-xs text-emerald-600 overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
            <div className="mt-4">
              <a
                href="/auth/login"
                className="text-emerald-700 hover:text-emerald-800 underline text-sm"
              >
                → Fazer login agora
              </a>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm font-semibold mb-2">❌ Erro</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-slate-200">
          <p className="text-xs text-slate-500 text-center">
            ⚠️ Esta página deve ser removida após o uso por questões de segurança
          </p>
        </div>
      </div>
    </div>
  );
}

