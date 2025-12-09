import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { SEO } from '@/components/SEO';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Forgot Password - Big Partner"
        description="Reset your Big Partner account password. Enter your email to receive a password reset link."
        keywords="forgot password, reset password, account recovery, Big Partner"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <CardDescription>
              {success
                ? "Check your email for reset instructions"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {success ? (
              <div className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    If an account exists with that email, a password reset link has been sent.
                    Please check your inbox and spam folder.
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    The reset link will expire in 1 hour for security reasons.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSuccess(false);
                      setEmail('');
                    }}
                    className="w-full"
                  >
                    Send Another Email
                  </Button>
                  <Link to="/login" className="w-full">
                    <Button variant="default" className="w-full">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-sm text-primary hover:underline inline-flex items-center"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
