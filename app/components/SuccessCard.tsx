import type { Character } from '@/app/types/characters';
import localFont from 'next/font/local';
import CountdownTimer from './CountdownTimer';

const scFont = localFont({ src: '../../public/font/FOT-ChiaroStd-B.otf' })

interface FailureCardProps {
    character: Character;
}

export default function FailureCard({ character }: FailureCardProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 text-center">
                <h2 className={`${scFont.className} text-2xl font-bold text-green-600 mb-4`}>You Won!</h2>
                <p className="text-lg text-gray-800 mb-4">
                    The character was <span className="font-bold">{character.name}</span>
                </p>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600">A new character to guess will be available in</p>
                    <CountdownTimer/>
                </div>
            </div>
        </div>
    );
}