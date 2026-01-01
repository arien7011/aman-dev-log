'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button, Card } from '@/components/ui';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);
  
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Something went wrong!
        </h1>
        
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          An unexpected error occurred. Don&apos;t worry, our team has been notified and 
          we&apos;re working on it.
        </p>
        
        {error.digest && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={reset}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
