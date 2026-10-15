import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Gestão de Contatos',
  description: 'Gestão de contatos com normalização, tags e resumos gerados por IA',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b">
          <nav className="mx-auto flex max-w-5xl gap-6 p-4 text-sm font-medium">
            <Link href="/" className="hover:text-blue-700">
              Contatos
            </Link>
            <Link href="/import" className="hover:text-blue-700">
              Importar
            </Link>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}