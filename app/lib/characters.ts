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

  // Use UTC date to ensure consistency across time zones
  const today = new Date();
  const startOfDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const daysSinceEpoch = Math.floor(startOfDay / (1000 * 60 * 60 * 24));
  
  return characters[daysSinceEpoch % characters.length];
}

export function validateGuess(guess: string, character: Character): {
  isCorrect: boolean;
  matches: {
    debutYear: boolean;
    gender: boolean;
    ethnicity: boolean;
    species: boolean;
    debutGame: boolean;
  };
} {
  const guessCharacter = charactersData.characters.find(c => 
    c.name.toLowerCase() === guess.toLowerCase()
  );
  
  // Early return if character not found
  if (!guessCharacter) {
    return {
      isCorrect: false,
      matches: {
        debutYear: false,
        gender: false,
        ethnicity: false,
        species: false,
        debutGame: false
      }
    };
  }

  return {
    isCorrect: guessCharacter.id === character.id,
    matches: {
      debutYear: guessCharacter.debutYear === character.debutYear,
      gender: guessCharacter.gender === character.gender,
      ethnicity: guessCharacter.ethnicity === character.ethnicity,
      species: guessCharacter.species === character.species,
      debutGame: guessCharacter.debutGame === character.debutGame
    }
  };
}