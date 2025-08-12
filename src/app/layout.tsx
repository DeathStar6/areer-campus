import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/use-auth';
import { Navigation } from '@/components/layout/navigation';
import { Providers } from '@/components/providers';
import { PageTransition } from '@/components/ui/page-transition';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Career Compass - AI-Powered Career Guidance',
  description: 'Discover your perfect career path with personalized AI recommendations for future studies, career opportunities, and college choices.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Navigation />
            <PageTransition>
              {children}
            </PageTransition>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
