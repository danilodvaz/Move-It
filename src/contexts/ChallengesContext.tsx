// Cria um contexto que facilita a troca de informações entre os componentes
// Deve ser realizada a importação do contexto onde for necessário. Neste caso
// foi importado no _app.tsx
// Todo componente que estiver dentro do contexto, terá acesso aos dados, bastar utilizar o 
// useContext e importar este arquivo de contexto.
import { createContext, ReactNode, useEffect, useState } from 'react';
import challenges from '../../challenges.json';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface ChallengesProviderProps {
    // Como o children é um componente react, pode ser tipado como ReactNode, que aceita qualquer elemento filho
    children: ReactNode
}

// Cria o contexto e define o formato
export const ChallengesContext = createContext({} as ChallengesContextData);

export function ChallengesProvider({children}: ChallengesProviderProps) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [challengesCompleted, setChallengesCompleted] = useState(0);

    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    // Solicitar permissão para o usuário
    // Para acessar a resposta, pode ser utilizado o Notification.permission
    useEffect(() => {
        Notification.requestPermission();
    }, [])

    function levelUp() {
        setLevel(level + 1);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        // Verifica se o usuário liberou a notificação
        if (Notification.permission === 'granted') {
            // Cria uma nova notificação
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`
            });

            // Toca o áudio
            new Audio('/notification.mp3').play();
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        // Todo componente que ficar dentro do contexto, poderá acessar as informações.
        // Foi adicionado neste arquivo, pois praticamente todos os componentes irão compartilhar
        <ChallengesContext.Provider
            value={{
                level,
                currentExperience,
                challengesCompleted,
                experienceToNextLevel,
                levelUp,
                startNewChallenge,
                activeChallenge,
                resetChallenge,
                completeChallenge
            }}
        >
            {children}
        </ChallengesContext.Provider>
    );
}