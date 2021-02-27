// Função que engloba todas as páginas. O que for para todas as páginas, pode ser adicionado aqui.
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
