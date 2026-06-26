import './globals.css';

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import { ThemeProvider } from '@/components/providers/theme-provider';

const fontDisplay = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display'
});

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans'
});

const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata: Metadata = {
  title: 'Ekaar Merit Engine',
  description: 'Ekaar Merit Engine UI'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} min-h-full antialiased`}>
      <body className="min-h-full" suppressHydrationWarning>
        <ThemeProvider>
          <div className="overflow-x-hidden">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
