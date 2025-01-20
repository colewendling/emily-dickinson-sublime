import type { Metadata } from 'next';
import './globals.css';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'The Dickinson Sublime',
  description: '3D data visualization of selected works from Emily Dickinson’s 1,775 poems rendered as relational nodes using Three.js, exploring thematic links, keywords, and meaning.',
  authors: [{ name: 'Cole Wendling' }],
  openGraph: {
    title: 'The Dickinson Sublime',
    description: '3D data visualization of selected works from Emily Dickinson’s 1,775 poems rendered as relational nodes using Three.js, exploring thematic links, keywords, and meaning.',
    url: 'https://emilypoems.com/',
    images: [
      {
        url: '/meta/social-share.gif',
        width: 1200,
        height: 630,
        alt: 'The Dickinson Sublime - 3D Emily Dickinson Poem Visualization',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Dickinson Sublime',
    description: '3D data visualization of selected works from Emily Dickinson’s 1,775 poems rendered as relational nodes using Three.js, exploring thematic links, keywords, and meaning.',
    images: ['/meta/social-share.gif'],
  },
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
