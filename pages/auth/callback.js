import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function AuthCallback() {
  const router = useRouter();
  const [status, setStatus] = useState('Επεξεργασία...');

  useEffect(() => {
    const { code } = router.query;
    if (!code) return;

    fetch('/api/auth/callback?code=' + code)
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('✅ Η σύνδεση με το Zoho WorkDrive ολοκληρώθηκε! Μπορείτε να κλείσετε αυτή τη σελίδα.');
        } else {
          setStatus('❌ Σφάλμα: ' + data.error);
        }
      });
  }, [router.query]);

  return (
    <div style={{ fontFamily: 'Arial', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f0f7ec' }}>
      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', maxWidth: '400px', textAlign: 'center', border: '1px solid #c8dfc0' }}>
        <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🌱</div>
        <h2 style={{ color: '#1a3d2b', marginBottom: '1rem' }}>Roots of Carbon</h2>
        <p style={{ color: '#555' }}>{status}</p>
      </div>
    </div>
  );
}
