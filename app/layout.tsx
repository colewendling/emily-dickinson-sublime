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
        {/* 
          1) Use min-h-screen to ensure body takes up full height.
          2) Wrap content in a <div> that uses max-w-screen-xl or similar 
             to keep everything in a nice centered box.
        */}
        <div className="flex flex-col min-h-screen items-center justify-between">
          <header className="w-full">
            {/* If you want a separate header, you can place it here */}
          </header>

          <main className="w-full flex-1">
            <div className="mx-auto max-w-screen-xl px-4 py-8">{children}</div>
          </main>

          <footer className="w-full bg-black text-center py-6 mt-6">
            <p className="text-sm text-gray-400">
              &copy; 2024 The Dickinson Sublime
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
}
