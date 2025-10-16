import { Funnel_Sans, Londrina_Solid } from 'next/font/google';

export const funnel = Funnel_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-funnel', 
});

export const londrina = Londrina_Solid({
  subsets: ['latin'],
  weight: ['400', '900'],
  variable: '--font-londrina',
});