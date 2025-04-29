import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { AppProvider } from '../context/AppContext';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <Component {...pageProps} />
    </AppProvider>
  );
}
