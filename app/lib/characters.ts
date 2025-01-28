import charactersData from '@/app/data/characters.json'
import type { Character } from '@/app/types/characters';

export function getAllCharacters(): Character[] {
    return charactersData.characters;
}

export function getRandomCharacter(): Character {
    const characters = getAllCharacters();
    return characters[Math.floor(Math.random() * characters.length)];
}

export function getDailyCharacter(): Character {
    const characters = getAllCharacters();

    // Use the current date to select a character (TEMP!)
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return characters[dayOfYear % characters.length]
}

export function validateGuess(guess: string, character: Character): {
    isCorrect: boolean;
    matches: {
      debutYear: boolean;
      gender: boolean;
      species: boolean;
      debutGame: boolean;
    };
  } {
    const guessCharacter = charactersData.characters.find(c => 
      c.name.toLowerCase() === guess.toLowerCase()
    );
  
    if (!guessCharacter) {
      console.log('Invalid character guess');
    }
  
    return {
      isCorrect: guessCharacter.id === character.id,
      matches: {
        debutYear: guessCharacter.debutYear === character.debutYear,
        gender: guessCharacter.gender === character.gender,
        species: guessCharacter.species === character.species,
        debutGame: guessCharacter.debutGame === character.debutGame
      }
    };
  }