import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Redirect page for /login -> /auth/login
 * This ensures backward compatibility with old links
 */
const LoginRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/login');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <p>Redirecting to login...</p>
        </div>
    );
};

export default LoginRedirect;
