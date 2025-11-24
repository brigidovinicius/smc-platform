import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Validação de email em tempo real
  const validateEmailInput = (value: string) => {
    setEmailError(null);
    if (!value) {
      return;
    }
    
    // Importar validação dinamicamente (client-side)
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailRegex.test(value.trim().toLowerCase())) {
      setEmailError('Invalid email format');
      return;
    }

    // Check common temporary domains
    const domain = value.split('@')[1]?.toLowerCase();
    const disposableDomains = [
      '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
      'tempmail.com', 'throwaway.email', 'trashmail.com', 'yopmail.com',
      'getnada.com', 'mohmal.com', 'maildrop.cc', 'temp-mail.org'
    ];
    
    if (domain && disposableDomains.some(d => domain.includes(d))) {
      setEmailError('Temporary emails are not allowed. Use a personal or corporate email.');
    }
  };

  // Validação de senha em tempo real
  const validatePasswordInput = (value: string) => {
    setPasswordError(null);
    if (!value) {
      return;
    }
    
    if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else if (value.length > 128) {
      setPasswordError('Password must be at most 128 characters');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setEmailError(null);
    setPasswordError(null);
    
    // Final validation before submitting
    if (emailError || passwordError) {
      setError('Please fix the errors in the form');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        // Translate server error messages
        const errorMessages: Record<string, string> = {
          'DATABASE_CONNECTION_ERROR': 'Service temporarily unavailable. Please check database configuration.',
          'DATABASE_ERROR': 'Error connecting to database. Check configuration.',
          'EMAIL_EXISTS': 'Email already registered. Try signing in or use another email.',
          'VALIDATION_ERROR': data.error || 'Invalid data. Check the fields and try again.'
        };
        setError(errorMessages[data.code] || data.error || 'Error creating account. Please try again.');
        return;
      }

      const data = await response.json();
      // Success message based on whether email was automatically verified
      if (data.data?.emailVerified) {
        setSuccess('Account created successfully! Redirecting to login...');
        // Redirect to login after 2 seconds if email is already verified
        setTimeout(() => {
          router.push('/auth/login?registered=1');
        }, 2000);
      } else {
        setSuccess('Account created successfully! Check your email to activate your account.');
        setName('');
        setEmail('');
        setPassword('');
        setEmailError(null);
        setPasswordError(null);
      }
    } catch (err) {
      setError('Error creating account. Please try again.');
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
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create account</h1>
          <p className="text-slate-600">Start your journey on SMC Platform</p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm flex items-center gap-2">
              <span>⚠</span>
              {error}
            </p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-emerald-700 text-sm flex items-center gap-2">
              <span className="text-emerald-500">✓</span>
              {success}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
              Name <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmailInput(e.target.value);
              }}
              onBlur={(e) => validateEmailInput(e.target.value)}
              required
              className={`w-full px-4 py-3 rounded-lg border-2 focus:ring-2 outline-none transition-all ${
                emailError
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
              }`}
              placeholder="seu@email.com"
            />
            {emailError && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <span>⚠</span>
                {emailError}
              </p>
            )}
            {!emailError && email && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <span>✓</span>
                Valid email
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
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
              <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
            )}
            {!passwordError && password && password.length >= 8 && (
              <p className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
                <span>✓</span>
                Valid password
              </p>
            )}
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
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">or</span>
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
              Connecting...
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
              Sign up with Google
            </span>
          )}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
