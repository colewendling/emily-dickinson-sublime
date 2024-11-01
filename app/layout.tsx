// app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'The Dickinson Sublime',
  description: 'A modern dark-themed Next.js application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex justify-center items-center min-h-screen">
        <div className="container">
          <header className="bordered p-4">
            <h1 className="header">The Dickinson Sublime</h1>
            <h2 className="subheader">mapping eternity</h2>
          </header>
          <main className="">{children}</main>
          <footer className="bordered p-4 text-center">
            <p className="paragraph">&copy; 2024 The Dickinson Sublime</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
