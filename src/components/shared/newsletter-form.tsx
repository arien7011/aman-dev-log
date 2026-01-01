'use client';

import { useState } from 'react';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

interface NewsletterFormProps {
  className?: string;
  variant?: 'default' | 'inline';
}

export function NewsletterForm({ className, variant = 'default' }: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    setStatus('loading');

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div
        className={cn(
          'rounded-lg bg-teal-50 p-4 dark:bg-teal-900/20',
          className
        )}
      >
        <div className="flex items-center gap-3 text-teal-700 dark:text-teal-300">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Thanks for subscribing! Check your inbox to confirm.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        variant === 'inline' ? 'flex gap-2' : 'space-y-3',
        className
      )}
    >
      <div className={variant === 'inline' ? 'flex-1' : ''}>
        <Input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          disabled={status === 'loading'}
          aria-label="Email address"
          className={status === 'error' ? 'border-red-500' : ''}
        />
        {status === 'error' && variant !== 'inline' && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={status === 'loading'}
        className={variant === 'inline' ? '' : 'w-full'}
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Subscribing...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Subscribe
          </>
        )}
      </Button>
    </form>
  );
}
