import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';


export const metadata = {
  title: 'AmpSkill',
  description: 'Online Assessment Platform',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
