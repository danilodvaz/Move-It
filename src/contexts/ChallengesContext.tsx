// Cria um contexto que facilita a troca de informações entre os componentes
// Deve ser realizada a importação do contexto onde for necessário. Neste caso
// foi importado no _app.tsx
// Todo componente que estiver dentro do contexto, terá acesso aos dados, bastar utilizar o 
// useContext e importar este arquivo de contexto.
import { createContext, ReactNode, useState } from 'react';

export const ChallengesContext = createContext({});

interface ChallengesProviderProps {
    // Como o children é um componente react, pode ser tipado como ReactNode, que aceita qualquer elemento filho
    children: ReactNode
}

export function ChallengesProvider({children}: ChallengesProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    function levelUp() {
        setLevel(level + 1);
    }

    return (
        // Todo componente que ficar dentro do contexto, poderá acessar as informações.
        // Foi adicionado neste arquivo, pois praticamente todos os componentes irão compartilhar
        <ChallengesContext.Provider value={{ level, currentExperience, challengesCompleted, levelUp }}>
            {children}
        </ChallengesContext.Provider>
    );
}