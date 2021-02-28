// Função que engloba todas as páginas. O que for para todas as páginas, pode ser adicionado aqui.
import { ChallengesProvider } from '../contexts/ChallengesContext';
import '../styles/global.css';

function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
      <Component {...pageProps} />
    </ChallengesProvider>
  ) 
}

export default MyApp
