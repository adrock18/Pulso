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

function PasswordStrength({ password }) {
  if (!password) return null;
  const len = password.length;
  let level = 'weak';
  let color = 'bg-red-400';
  let width = '33%';
  if (len >= 10) { level = 'strong'; color = 'bg-emerald-500'; width = '100%'; }
  else if (len >= 6) { level = 'medium'; color = 'bg-amber-400'; width = '66%'; }
  return (
    <div className="space-y-1">
      <div className="h-1 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width }} />
      </div>
      <p className={`text-[10px] ${level === 'strong' ? 'text-emerald-600' : level === 'medium' ? 'text-amber-600' : 'text-red-500'}`}>
        Password strength: {level}
      </p>
    </div>
  );
}

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await registerUser(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
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
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>Join to write reviews and verify your purchases</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">Name</Label>
              <Input id="name" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-10" />
              <PasswordStrength password={password} />
            </div>
            <Button type="submit" className="w-full h-10" disabled={submitting}>
              {submitting ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
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
