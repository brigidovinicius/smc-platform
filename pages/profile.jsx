import Image from 'next/image';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import CardWrapper from '@/components/ui/CardWrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const { t } = useTranslation();

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
        <CardWrapper title={t('auth.accessRequired')} description={t('auth.mustBeLoggedIn')}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
              {t('auth.signInWithGoogle')}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">{t('common.backToHome')}</Link>
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
          <h1 className="text-3xl font-bold text-foreground">{t('profile.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('profile.description')}</p>
        </div>
      </div>

      <CardWrapper
        title={t('profile.personalInfo')}
        description={t('profile.description')}
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
                <span>{t('profile.fullName')}</span>
              </div>
              <p className="text-lg font-semibold text-foreground">
                {session.user?.name ?? t('profile.notProvided')}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{t('auth.email')}</span>
              </div>
              <p className="text-lg text-foreground">
                {session.user?.email ?? t('profile.notProvided')}
              </p>
            </div>

            {session.user?.role && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>{t('profile.role')}</span>
                </div>
                <Badge variant="secondary">{session.user.role}</Badge>
              </div>
            )}

            {session.user?.id && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{t('profile.profileId')}</span>
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
        title={t('profile.quickActions')}
        description={t('profile.description')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/dashboard">
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Dashboard</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.description')}</div>
                </div>
              </div>
            </Link>
          </Button>

          <Button variant="outline" className="justify-start h-auto py-4" asChild>
            <Link href="/wizard">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">New Asset</div>
                  <div className="text-xs text-muted-foreground">{t('dashboard.myAssetsDescription')}</div>
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
              {t('profile.signOutQuestion')}
            </p>
          </div>
          <Button 
            variant="destructive" 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full sm:w-auto"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('auth.signOut')}
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
