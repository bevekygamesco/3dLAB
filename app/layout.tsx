import type { Metadata } from 'next';
import './globals.css';
import './refinements.css';
import './precision.css';
import './scroll-scenes.css';
import './interaction-polish.css';
import './cursor.css';
export const metadata: Metadata = { title: '3D CONFIG LAB — Possibilities, made personal.', description: 'Cinematic 3D websites, immersive product stories and interactive configurators for architecture, automotive, furniture and fashion.' };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
