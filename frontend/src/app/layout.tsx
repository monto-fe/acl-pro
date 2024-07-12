'use client'
import { ReactNode } from 'react';
import GlobalContext from '@/utils/globalContext';

interface Props {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return <GlobalContext.Provider value={{ a: 123 }}>
    {children}
  </GlobalContext.Provider>;
}