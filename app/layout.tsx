import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'The Dickinson Sublime',
  description: 'A modern dark-themed Next.js application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="flex flex-col min-h-screen items-center justify-between">
          <header className="w-full">
          </header>
          <main className="w-full flex-1">
            <div className="mx-auto max-w-screen-xl px-4 py-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
