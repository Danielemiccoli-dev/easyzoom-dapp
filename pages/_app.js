import '../styles/globals.css'

// function MyApp({ Component, pageProps }) {
//
//   return <Component {...pageProps} />
// }

import { useState, useEffect } from 'react'
const numbers = [500, 1000, 1500, 2000, 2500];
const randomIndex = Math.floor(Math.random() * numbers.length);
function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, numbers[randomIndex]);

    return () => clearTimeout(timeout);
  }, []);

  return isLoading ? (
    // qui puoi mostrare un loader o un'animazione in attesa del timeout
    <div>Loading...</div>
  ) : (
    <Component {...pageProps} />
  );
}


export default MyApp
