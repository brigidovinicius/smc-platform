import { useEffect } from 'react';
import { useRouter } from 'next/router';

const VerifyPage = () => {
  const router = useRouter();
  useEffect(() => {
    const token = router.query.token;
    if (!token) {
      router.replace('/auth/login?verified=0');
      return;
    }
    window.location.href = `/api/auth/verify?token=${token}`;
  }, [router]);

  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <p>Validando token...</p>
    </div>
  );
};

export default VerifyPage;
