"use client";
import { useState, useEffect } from 'react';
import localFont from 'next/font/local'
import { getDailyCharacter, validateGuess } from '@/app/lib/characters';
import type { Character } from '@/app/types/characters';
import FailureCard from '@/app/components/FailureCard';
import SuccessCard from './components/SuccessCard';

const scFont = localFont({ src: '../public/font/FOT-ChiaroStd-B.otf' })

export default function Home() {
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
    const [guesses, setGuesses] = useState<Array<{ name: string; isCorrect: boolean }>>([]); 
    const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        setCurrentCharacter(getDailyCharacter());
    }, []);

    const handleGuess = (guessName: string) => {
        if (!currentCharacter || gameOver) return;

        const result = validateGuess(guessName, currentCharacter);
        setGuesses([...guesses, { name: guessName, isCorrect: result.isCorrect }]);
        
        if (!result.isCorrect) {
            const newIncorrectGuesses = incorrectGuesses + 1;
            setIncorrectGuesses(newIncorrectGuesses);
            
            // Check if player has used all 5 guesses
            if (newIncorrectGuesses >= 5) {
                setGameOver(true);
            }
        } else {
            // Player guessed correctly
            setGameOver(true);
        }
    };

    if (!currentCharacter) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-xl w-full">
                <h1 className={`${scFont.className} text-3xl font-bold mb-4 text-gray-600 whitespace-nowrap`}>Guess the Kill The Past Character</h1>
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
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            const input = e.target as HTMLInputElement;
                            if (input.value.trim()) {
                                handleGuess(input.value);
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

            {gameOver && incorrectGuesses < 5 && (
                <SuccessCard character={currentCharacter} />
            )}

            {/* Show failure card when game is over and player didn't guess correctly */}
            {gameOver && incorrectGuesses >= 5 && (
                <FailureCard character={currentCharacter} />
            )}
        </div>
    );
}