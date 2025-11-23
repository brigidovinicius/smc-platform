import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // Verificar se o token é válido ao carregar a página
  useEffect(() => {
    if (token && typeof token === 'string') {
      // Validar token básico
      if (token.length < 32) {
        setTokenValid(false);
        setError('Token inválido ou expirado.');
      } else {
        setTokenValid(true);
      }
    } else if (router.isReady && !token) {
      setTokenValid(false);
      setError('Token não fornecido.');
    }
  }, [token, router.isReady]);

  // Validação de senha em tempo real
  const validatePasswordInput = (value: string) => {
    setPasswordError(null);
    if (!value) {
      return;
    }
    
    if (value.length < 8) {
      setPasswordError('A senha deve ter pelo menos 8 caracteres');
    } else if (value.length > 128) {
      setPasswordError('A senha deve ter no máximo 128 caracteres');
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setPasswordError(null);

    // Validação final
    if (passwordError) {
      setError('Por favor, corrija os erros no formulário');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (!token || typeof token !== 'string') {
      setError('Token inválido');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Redirecionar para login após 3 segundos
        setTimeout(() => {
          router.push('/auth/login?passwordReset=1');
        }, 3000);
      } else {
        setError(data.error || 'Erro ao redefinir senha. Tente novamente.');
      }
    } catch (err) {
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Token inválido</h1>
            <p className="text-slate-600">
              O link de redefinição de senha é inválido ou expirou. Por favor, solicite um novo link.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm flex items-center gap-2">
                <span>⚠</span>
                {error}
              </p>
            </div>
          )}

          <Link
            href="/auth/forgot-password"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-center block mb-4"
          >
            Solicitar novo link
          </Link>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-lg font-medium border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-300 transition-all text-center block"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Senha redefinida!</h1>
            <p className="text-slate-600">
              Sua senha foi redefinida com sucesso. Você será redirecionado para a página de login.
            </p>
          </div>

          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              Senha alterada com sucesso. Você já pode fazer login com sua nova senha.
            </p>
          </div>

          <Link
            href="/auth/login"
            className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all text-center block"
          >
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center">
            <span className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Redefinir senha</h1>
          <p className="text-slate-600">Digite sua nova senha abaixo</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Nova senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                validatePasswordInput(e.target.value);
              }}
              onBlur={(e) => validatePasswordInput(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 outline-none transition-all ${
                passwordError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              placeholder="••••••••"
            />
            {passwordError ? (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span>
                {passwordError}
              </p>
            ) : (
              <p className="mt-1 text-xs text-slate-500">Mínimo de 8 caracteres</p>
            )}
            {!passwordError && password && password.length >= 8 && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <span>✓</span>
                Senha válida
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Confirmar senha
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 outline-none transition-all ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              placeholder="••••••••"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span>
                As senhas não coincidem
              </p>
            )}
            {confirmPassword && password === confirmPassword && password.length >= 8 && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <span>✓</span>
                Senhas coincidem
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !tokenValid}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              loading || !tokenValid
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Redefinindo...
              </span>
            ) : (
              'Redefinir senha'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Voltar para login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;


