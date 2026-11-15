import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BadgeCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PRODUCTS } from '@/data/products';
import { useAuth } from '@/hooks/useAuth';

const totalVerified = PRODUCTS.reduce((sum, p) => sum + p.verifiedReviewCount, 0);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-3 logo-mark">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to write reviews and verify purchases</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-10" />
            </div>
            <Button type="submit" className="w-full h-10" disabled={submitting}>
              {submitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            New to Pulso?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
          <p className="text-center text-[11px] text-muted-foreground/70 mt-4 flex items-center justify-center gap-1.5">
            <BadgeCheck size={12} className="text-emerald-500" />
            Join {totalVerified}+ verified reviewers on Pulso
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
