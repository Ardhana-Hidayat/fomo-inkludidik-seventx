import type { Metadata } from 'next';
import { Lexend, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AccessibilityProvider } from '@/components/accessibility/AccessibilityContext';

const lexend = Lexend({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InkluDidik - Web Pendidikan Inklusif SLB',
  description:
    'Platform pembelajaran inklusif adaptif untuk guru senior dan siswa berkebutuhan khusus berbasis Next.js, Supabase, dan Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      data-contrast="standard"
      data-text-scale="normal"
      className={`${lexend.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-canvas text-ink font-sans antialiased">
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </body>
    </html>
  );
}
