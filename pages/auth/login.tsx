import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [verifiedMessage, setVerifiedMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  useEffect(() => {
    if (router.query.verified === '1') {
      setVerifiedMessage('E-mail verificado com sucesso. Faça login para continuar.');
    }
    if (router.query.registered === '1') {
      setVerifiedMessage('Conta criada com sucesso! Faça login para continuar.');
    }
    if (router.query.passwordReset === '1') {
      setVerifiedMessage('Senha redefinida com sucesso! Faça login com sua nova senha.');
    }
  }, [router.query]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });

      if (result?.error) {
        // Traduzir mensagens de erro para português
        const errorMessages: Record<string, string> = {
          'CredentialsSignin': 'E-mail ou senha incorretos',
          'E-mail não verificado': 'E-mail não verificado. Verifique sua caixa de entrada.',
          'Usuário não encontrado': 'E-mail ou senha incorretos',
          'Senha incorreta': 'E-mail ou senha incorretos',
          'Credenciais inválidas': 'Por favor, preencha todos os campos',
          'Serviço temporariamente indisponível': 'Serviço temporariamente indisponível. Por favor, tente novamente em alguns instantes.',
          'Erro ao acessar o banco de dados': 'Erro ao acessar o banco de dados. Verifique a configuração do servidor.'
        };
        setError(errorMessages[result.error] || result.error || 'Erro ao fazer login. Tente novamente.');
      } else if (result?.ok) {
        const callbackUrl = router.query.callbackUrl as string || '/dashboard';
        router.push(callbackUrl);
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    const callbackUrl = router.query.callbackUrl as string || '/dashboard';
    await signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Entrar</h1>
          <p className="text-slate-600">Acesse sua conta para continuar</p>
        </div>

        {verifiedMessage && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              {verifiedMessage}
            </p>
          </div>
        )}

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
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">ou</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className={`w-full py-3 rounded-lg font-medium border-2 transition-all ${
            isGoogleLoading
              ? 'border-slate-300 bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:border-indigo-300'
          }`}
        >
          {isGoogleLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
              Conectando...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Entrar com Google
            </span>
          )}
        </button>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-slate-600">
            Não tem conta?{' '}
            <Link href="/auth/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Cadastre-se
            </Link>
          </p>
          <p>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Esqueci minha senha
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
