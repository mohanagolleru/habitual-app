
import type { Metadata } from 'next';
import { Space_Grotesk, Fira_Code } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'], // Common weights for Fira Code
});

export const metadata: Metadata = {
  title: 'Habitual - Track Your Habits',
  description: 'Track your habits with ease and view your daily progress in a clear, intuitive way.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${spaceGrotesk.variable} ${firaCode.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
