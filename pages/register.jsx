import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Redirect page for /register -> /auth/register
 * This ensures backward compatibility with old links
 */
const RegisterRedirect = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/register');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <p>Redirecionando para registro...</p>
        </div>
    );
};

export default RegisterRedirect;
