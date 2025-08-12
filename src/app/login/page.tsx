
'use client';

import { Compass, BrainCircuit } from 'lucide-react';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <Compass className="mx-auto h-12 w-12 text-primary" />
            <h1 className="text-3xl font-bold mt-4 font-headline text-foreground">Career Compass</h1>
            <p className="text-muted-foreground mt-2">Your AI guide to a brilliant career.</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
