import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  // Temporarily disable reCAPTCHA due to React 19 compatibility issue
  // const { executeRecaptcha } = useGoogleReCaptcha();
  const executeRecaptcha = null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Execute reCAPTCHA verification
    let recaptchaToken = '';
    if (executeRecaptcha) {
      recaptchaToken = await executeRecaptcha('register');
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
          recaptchaToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Redirect to dashboard on success
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'medium' : 'weak';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Big Partner and start investing today</p>
        </div>

        {/* Registration Card */}
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                    minLength={8}
                  />
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="show-password-register"
                    checked={showPassword}
                    onCheckedChange={(checked) => setShowPassword(checked as boolean)}
                  />
                  <label
                    htmlFor="show-password-register"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Show password
                  </label>
                </div>
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="flex items-center gap-2 text-xs">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength === 'strong'
                            ? 'w-full bg-green-500'
                            : passwordStrength === 'medium'
                            ? 'w-2/3 bg-yellow-500'
                            : 'w-1/3 bg-red-500'
                        }`}
                      />
                    </div>
                    <span
                      className={
                        passwordStrength === 'strong'
                          ? 'text-green-600'
                          : passwordStrength === 'medium'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                      }
                    >
                      {passwordStrength === 'strong' ? 'Strong' : passwordStrength === 'medium' ? 'Medium' : 'Weak'}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    className="pl-10"
                    required
                    disabled={loading}
                  />
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Checkbox
                    id="show-confirm-password"
                    checked={showConfirmPassword}
                    onCheckedChange={(checked) => setShowConfirmPassword(checked as boolean)}
                  />
                  <label
                    htmlFor="show-confirm-password"
                    className="text-sm text-muted-foreground cursor-pointer select-none"
                  >
                    Show confirm password
                  </label>
                </div>
              </div>

              {/* Terms Agreement */}
              <div className="text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Additional Links */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
