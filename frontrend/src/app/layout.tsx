// app/layout.tsx
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'FOODIE',
  description: 'Your App Description',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
