import Image from 'next/image';
import { useState } from 'react';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import CardWrapper from '@/components/ui/CardWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, LogOut, Settings, Lock, Edit2, Check, X } from 'lucide-react';
import Link from 'next/link';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [emailData, setEmailData] = useState({ newEmail: '' });
  const [passwordError, setPasswordError] = useState(null);
  const [passwordSuccess, setPasswordSuccess] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <CardWrapper
          title="Acesso necessário"
          description="Você precisa estar logado para acessar seu perfil."
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
              Entrar com Google
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Voltar para início</Link>
            </Button>
          </div>
        </CardWrapper>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">Gerencie suas informações e configurações</p>
        </div>
      </div>

      <CardWrapper
        title="Informações pessoais"
        description="Suas informações de conta e perfil"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          {session.user?.image && (
            <div className="flex-shrink-0">
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'Avatar'}
                width={120}
                height={120}
                className="rounded-full border-4 border-primary/20"
                priority
              />
            </div>
          )}
          
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Nome completo</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {session.user?.name ?? 'Não informado'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>Email</span>
              </div>
              <p className="text-lg text-foreground">
                {session.user?.email ?? 'Não informado'}
              </p>
            </div>

            {session.user?.role && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Função</span>
                </div>
                <Badge variant="secondary">{session.user.role}</Badge>
              </div>
            )}

            {session.user?.id && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>ID do perfil</span>
                </div>
                <p className="text-sm font-mono text-muted-foreground bg-muted p-2 rounded">
                  {session.user.id}
                </p>
              </div>
            )}
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        title="Segurança"
        description="Gerencie sua senha e email"
      >
        <div className="space-y-6">
          {/* Alterar Email */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Email atual: {session.user?.email}
                </p>
              </div>
              {!showEmailForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowEmailForm(true);
                    setShowPasswordForm(false);
                    setEmailError(null);
                    setEmailSuccess(null);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Alterar Email
                </Button>
              )}
            </div>

            {showEmailForm && (
              <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                {emailError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {emailError}
                  </div>
                )}
                {emailSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {emailSuccess}
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Novo Email</label>
                  <input
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ newEmail: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="novo@email.com"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      setEmailError(null);
                      setEmailSuccess(null);

                      try {
                        const res = await fetch('/api/user/update-email', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ newEmail: emailData.newEmail }),
                        });

                        const data = await res.json();

                        if (res.ok) {
                          setEmailSuccess(data.message || 'Email atualizado com sucesso!');
                          setEmailData({ newEmail: '' });
                          setTimeout(() => {
                            setShowEmailForm(false);
                            window.location.reload();
                          }, 2000);
                        } else {
                          setEmailError(data.error || 'Erro ao atualizar email');
                        }
                      } catch (error) {
                        setEmailError('Erro ao atualizar email. Tente novamente.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !emailData.newEmail}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEmailForm(false);
                      setEmailData({ newEmail: '' });
                      setEmailError(null);
                      setEmailSuccess(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Alterar Senha */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Senha
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Altere sua senha para manter sua conta segura
                </p>
              </div>
              {!showPasswordForm && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowPasswordForm(true);
                    setShowEmailForm(false);
                    setPasswordError(null);
                    setPasswordSuccess(null);
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Alterar Senha
                </Button>
              )}
            </div>

            {showPasswordForm && (
              <div className="border rounded-lg p-4 space-y-4 bg-muted/50">
                {passwordError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
                    <X className="h-4 w-4" />
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    {passwordSuccess}
                  </div>
                )}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Senha Atual</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Confirme sua nova senha"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={async () => {
                      setLoading(true);
                      setPasswordError(null);
                      setPasswordSuccess(null);

                      // Validações
                      if (passwordData.newPassword.length < 8) {
                        setPasswordError('A nova senha deve ter no mínimo 8 caracteres');
                        setLoading(false);
                        return;
                      }

                      if (passwordData.newPassword !== passwordData.confirmPassword) {
                        setPasswordError('As senhas não coincidem');
                        setLoading(false);
                        return;
                      }

                      try {
                        const res = await fetch('/api/user/update-password', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            currentPassword: passwordData.currentPassword,
                            newPassword: passwordData.newPassword,
                          }),
                        });

                        const data = await res.json();

                        if (res.ok) {
                          setPasswordSuccess('Senha alterada com sucesso!');
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                          setTimeout(() => {
                            setShowPasswordForm(false);
                          }, 2000);
                        } else {
                          setPasswordError(data.error || 'Erro ao alterar senha');
                        }
                      } catch (error) {
                        setPasswordError('Erro ao alterar senha. Tente novamente.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      setPasswordError(null);
                      setPasswordSuccess(null);
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardWrapper>

      <CardWrapper
        title="Ações rápidas"
        description="Acesse rapidamente as principais funcionalidades"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/dashboard">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-xs text-muted-foreground">Acompanhe seus ativos</div>
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/wizard">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Novo Ativo</div>
                  <div className="text-xs text-muted-foreground">Cadastre um novo ativo</div>
                </div>
              </div>
            </Link>
          </Button>
        </div>
      </CardWrapper>

      <CardWrapper>
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">
              Deseja sair da sua conta?
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair da conta
          </Button>
        </div>
      </CardWrapper>
    </div>
  );
};

export default ProfilePage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false
      }
    };
  }

  return { props: { session } };
};
