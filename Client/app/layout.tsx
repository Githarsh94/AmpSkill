import React from 'react';
import '../styles/globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ProfileProvider } from '../context/ProfileContext'; // Import the ProfileProvider

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
          <ProfileProvider>
            {children}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
