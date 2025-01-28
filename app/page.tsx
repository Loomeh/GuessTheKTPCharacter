"use client";
import { useState, useEffect } from 'react';
import { getDailyCharacter, validateGuess } from '@/app/lib/characters';
import type { Character } from '@/app/types/characters';

export default function Home() {
    const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
    const [guesses, setGuesses] = useState<string[]>([]);
    const [feedback, setFeedback] = useState<string[]>([]);
    const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);

    useEffect(() => {
        setCurrentCharacter(getDailyCharacter());
    }, []);

    const handleGuess = (guessName: string) => {
        if (!currentCharacter) return;

        try {
            const result = validateGuess(guessName, currentCharacter);
            setGuesses([...guesses, guessName]);
            setFeedback([...feedback, JSON.stringify(result.matches)]);
            
            if (!result.isCorrect) {
                setIncorrectGuesses(incorrectGuesses + 1);
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error(`Error: ${error.message}`);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    if (!currentCharacter) return <div className="text-center p-4">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Guess the Kill The Past Character</h1>
                <div className="mb-4">
                    <p><strong>Debut Year:</strong> {currentCharacter.debutYear}</p>
                    {incorrectGuesses >= 1 && <p><strong>Gender:</strong> {currentCharacter.gender}</p>}
                    {incorrectGuesses >= 2 && <p><strong>Species:</strong> {currentCharacter.species}</p>}
                    {incorrectGuesses >= 3 && <p><strong>Debut Game:</strong> {currentCharacter.debutGame}</p>}
                    {incorrectGuesses >= 4 && <p><strong>Quote:</strong> "{currentCharacter.quote}"</p>}
                </div>
                <input
                    type="text"
                    placeholder="Enter your guess"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleGuess((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                />
                <div className="guesses">
                    {guesses.map((guess, index) => (
                        <div key={index} className="mb-2 flex justify-between items-center">
                            <span>{guess}</span>
                            <span className="text-sm text-gray-500">{feedback[index]}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}