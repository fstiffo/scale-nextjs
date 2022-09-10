import '../styles/globals.css';
import { Theme } from 'react-daisyui'

export default function MyApp({ Component, pageProps }) {
  return <Theme dataTheme='pastel'><Component {...pageProps} /></Theme>;
}
