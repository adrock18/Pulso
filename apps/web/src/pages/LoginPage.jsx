import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PRODUCTS } from '@/data/products';

const totalVerified = PRODUCTS.reduce((sum, p) => sum + p.verifiedReviewCount, 0);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    alert('Login will be connected once the backend is live.');
  }

  return (
    <div className="flex justify-center py-12">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center mx-auto mb-3">
            <span className="text-primary-foreground font-bold">P</span>
          </div>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to write reviews and verify purchases</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-10" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-10" />
            </div>
            <Button type="submit" className="w-full h-10">Sign in</Button>
          </form>
          <Separator className="my-6" />
          <p className="text-center text-sm text-muted-foreground">
            New to Pulso?{' '}
            <Link to="/register" className="font-medium text-primary hover:underline">Create an account</Link>
          </p>
          <p className="text-center text-[11px] text-muted-foreground/70 mt-4">
            Join {totalVerified}+ verified reviewers on Pulso
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
