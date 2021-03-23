// Cria um contexto que facilita a troca de informações entre os componentes
// Deve ser realizada a importação do contexto onde for necessário. Neste caso
// foi importado no _app.tsx
// Todo componente que estiver dentro do contexto, terá acesso aos dados, bastar utilizar o 
// useContext e importar este arquivo de contexto.
import { createContext, ReactNode, useEffect, useState } from 'react';
// Biblioteca que facilita trabalhar com Cookies
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

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
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    // Como o children é um componente react, pode ser tipado como ReactNode, que aceita qualquer elemento filho
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

// Cria o contexto e define o formato
export const ChallengesContext = createContext({} as ChallengesContextData);

// Desestrutura o objeto pegando o children e colocando o resto na variável rest
export function ChallengesProvider({children, ...rest}: ChallengesProviderProps) {
    // Utiliza como default o que vem dos cookies. Caso não exista, utiliza os valores padrões
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);

    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    // Solicitar permissão para o usuário
    // Para acessar a resposta, pode ser utilizado o Notification.permission
    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
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
                completeChallenge,
                closeLevelUpModal
            }}
        >
            {children}

            { isLevelUpModalOpen && <LevelUpModal /> }
        </ChallengesContext.Provider>
    );
}