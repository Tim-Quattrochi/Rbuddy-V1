import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Chrome, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const error = searchParams.get('error');

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Full page redirect to backend OAuth endpoint
    window.location.href = '/api/auth/google';
  };

  // Get user-friendly error message
  const getErrorMessage = (errorCode: string | null): string => {
    switch (errorCode) {
      case 'auth_failed':
        return 'Authentication failed. Please try again.';
      case 'no_email':
        return 'Your Google account must have an email address.';
      case 'cancelled':
        return 'Sign in was cancelled. Please try again when you\'re ready.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  // Clear error from URL after showing it
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        window.history.replaceState({}, '', '/login');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-8 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">
              Welcome to Next Moment
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to continue your recovery journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive" data-testid="alert-error">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign In Error</AlertTitle>
                <AlertDescription>
                  {getErrorMessage(error)}
                </AlertDescription>
              </Alert>
            )}
            
            <Button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full h-12 text-base"
              size="lg"
              aria-label="Sign in with Google"
              data-testid="button-google-signin"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Redirecting...
                </>
              ) : (
                <>
                  <Chrome className="mr-2 h-5 w-5" />
                  Sign in with Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <p>
                By signing in, you agree to our commitment to support your recovery journey with care and respect.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;