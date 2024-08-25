import React from 'react';
import '../styles/globals.css';

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
        {children}
      </body>
    </html>
  );
}
