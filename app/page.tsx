"use client";
import { useState, useEffect } from 'react';
import localFont from 'next/font/local'
import { getDailyCharacter, validateGuess } from '@/app/lib/characters';
import type { Character } from '@/app/types/characters';
import FailureCard from '@/app/components/FailureCard';
import SuccessCard from './components/SuccessCard';
import InfoCard from './components/InfoCard';

const scFont = localFont({ src: '../public/font/FOT-ChiaroStd-B.otf' })

export default function Home() {
    const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
    const [guesses, setGuesses] = useState<Array<{ name: string; isCorrect: boolean }>>([]); 
    const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showInfoCard, setShowInfoCard] = useState(false);

    useEffect(() => {
        const fetchCharacter = async () => {
            try {
                const character = await getDailyCharacter();
                setCurrentCharacter(character);
                
                // Check localStorage for existing game state
                const savedState = localStorage.getItem('gameState');
                if (savedState) {
                    const { date, guesses, incorrectGuesses, gameOver } = JSON.parse(savedState);
                    const today = new Date().toISOString().split('T')[0];
                    
                    if (date === today) {
                        setGuesses(guesses);
                        setIncorrectGuesses(incorrectGuesses);
                        setGameOver(gameOver);
                        setHasPlayedToday(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching daily character:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCharacter();
    }, []);

    const handleGuess = async (guessName: string) => {
        if (!currentCharacter || gameOver) return;
    
        try {
            const result = await validateGuess(guessName, currentCharacter);
            
            // Create new state values
            const newGuesses = [...guesses, { name: guessName, isCorrect: result.isCorrect }];
            const newIncorrectGuesses = result.isCorrect ? incorrectGuesses : incorrectGuesses + 1;
            const newGameOver = result.isCorrect || newIncorrectGuesses >= 6;
    
            // Update state
            setGuesses(newGuesses);
            setIncorrectGuesses(newIncorrectGuesses);
            setGameOver(newGameOver);
    
            // Save to localStorage
            const today = new Date().toISOString().split('T')[0];
            localStorage.setItem('gameState', JSON.stringify({
                date: today,
                guesses: newGuesses,
                incorrectGuesses: newIncorrectGuesses,
                gameOver: newGameOver
            }));
    
            // If game is over, set hasPlayedToday
            if (newGameOver) {
                setHasPlayedToday(true);
            }
    
        } catch (error) {
            console.error('Error validating guess:', error);
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4">Loading...</div>
        </div>
    );

    if (!currentCharacter) return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center p-4 text-red-600">Error loading character</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            {/* Only render the cards once, at the top */}
            {hasPlayedToday && gameOver && (
                incorrectGuesses < 6 ? (
                    <SuccessCard character={currentCharacter} />
                ) : (
                    <FailureCard character={currentCharacter} />
                )
            )}

            {/* Info Button */}
            <button
                onClick={() => setShowInfoCard(true)}
                className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center shadow-md"
            >
                <span className="text-gray-700 font-bold">i</span>
            </button>

            {/* Info Card Modal */}
            {showInfoCard && <InfoCard onClose={() => setShowInfoCard(false)} />}
            
            <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
                <h1 className={`${scFont.className} text-3xl font-bold mb-4 text-gray-600 whitespace-nowrap`}>
                    Guess the Kill The Past Character
                </h1>
                <div className="mb-4 text-black text-xl">
                    <p><strong>Debut Year:</strong> {currentCharacter.debutYear}</p>
                    {incorrectGuesses >= 1 && <p><strong>Gender:</strong> {currentCharacter.gender}</p>}
                    {incorrectGuesses >= 2 && <p><strong>Species:</strong> {currentCharacter.species}</p>}
                    {incorrectGuesses >= 3 && <p><strong>Ethnicity:</strong> {currentCharacter.ethnicity}</p>}
                    {incorrectGuesses >= 4 && <p><strong>Debut Game:</strong> {currentCharacter.debutGame}</p>}
                    {incorrectGuesses >= 5 && <p><strong>Quote:</strong> &ldquo;{currentCharacter.quote}&rdquo;</p>}
                </div>
                <input
                    type="text"
                    placeholder="Enter your guess"
                    className="w-full p-2 border border-gray-300 rounded mb-4 text-black"
                    disabled={gameOver}
                    onKeyDown={async (e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                                await handleGuess(input.value);
                                input.value = '';
                            }
                        }
                    }}
                />
                <div className="guesses">
                    {guesses.map((guess, index) => (
                        <div key={index} className="mb-2 flex justify-between items-center text-black">
                            <span>{guess.name}</span>
                            <span>{guess.isCorrect ? '✅' : '❌'}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}