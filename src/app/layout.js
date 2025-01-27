import Providers from './providers'; // This is a client component
import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className='p-2'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
