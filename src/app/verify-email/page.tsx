
"use client";

import * as React from 'react';
import { useAuth } from '@/context/auth-context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Added CardFooter
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { MailCheck, LogOut, Send } from 'lucide-react';

export default function VerifyEmailPage() {
  const { user, loading, logOut, sendVerificationEmailAgain } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isResending, setIsResending] = React.useState(false);

  React.useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login'); // Not logged in, go to login
      } else if (user.emailVerified) {
        router.push('/'); // Already verified, go to app
      }
    }
  }, [user, loading, router]);

  const handleResendVerification = async () => {
    setIsResending(true);
    const success = await sendVerificationEmailAgain();
    if (success) {
      toast({
        title: "Verification Email Sent",
        description: "Please check your inbox (and spam folder) for the new verification link.",
      });
    } else {
      toast({
        title: "Error",
        description: "Could not resend verification email. Please try again later or contact support if the issue persists.",
        variant: "destructive",
      });
    }
    setIsResending(false);
  };

  if (loading || !user || (user && user.emailVerified)) {
    // Show loading or let useEffect redirect
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p>Loading or redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl text-center">
        <CardHeader>
          <MailCheck className="mx-auto h-16 w-16 text-primary mb-4" />
          <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          <CardDescription>
            A verification link has been sent to <strong>{user.email}</strong>.
            Please check your inbox (and spam folder) to complete your registration.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            If you haven't received the email, you can request another one.
          </p>
          <Button 
            onClick={handleResendVerification} 
            className="w-full" 
            disabled={isResending}
          >
            <Send className="mr-2 h-4 w-4" />
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <p className="text-xs text-muted-foreground pt-2">
            Once your email is verified, you may need to log out and log back in, or refresh the page.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button onClick={logOut} variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
