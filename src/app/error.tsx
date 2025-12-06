'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error caught:', error);
  }, [error]);

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="size-6" />
        <h2 className="text-lg font-semibold">Something went wrong</h2>
      </div>
      <p className="max-w-md text-center text-muted-foreground">
        An unexpected error occurred. Please try again or refresh the page.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </div>
  );
}
