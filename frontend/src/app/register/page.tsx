'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const emailError =
    touched.email && email && !EMAIL_RE.test(email) ? 'Enter a valid email address' : undefined;
  const passwordError =
    touched.password && password && password.length < 8
      ? 'Password must be at least 8 characters'
      : undefined;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!EMAIL_RE.test(email) || password.length < 8) return;

    setLoading(true);
    setError('');

    try {
      await register(email, password);
      router.push('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Start managing your tasks today">
      <form className="space-y-5" onSubmit={handleRegister}>
        {error && <Alert message={error} onDismiss={() => setError('')} />}

        <Input
          label="Email address"
          type="email"
          required
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          error={emailError}
          autoComplete="email"
        />

        <PasswordInput
          label="Password"
          required
          minLength={8}
          placeholder="Minimum 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passwordError}
          hint={!passwordError ? 'Minimum 8 characters' : undefined}
          autoComplete="new-password"
        />

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>

        <p className="text-center text-sm text-[var(--foreground-muted)]">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-[var(--accent-cyan)] hover:opacity-80 transition">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
