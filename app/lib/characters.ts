import sql from './db';
import type { Character } from '@/app/types/characters';

export async function getAllCharacters(): Promise<Character[]> {
  const results = await sql`SELECT * FROM characters`;
  return results.map(row => ({
      id: row.id,
      name: row.name,
      ethnicity: row.ethnicity,
      debutYear: row.debut_year,
      gender: row.gender,
      species: row.species,
      debutGame: row.debut_game,
      quote: row.quote
  }));
}

export async function getDailyCharacter(): Promise<Character> {
  const today = new Date().toISOString().split('T')[0];
  
  const [character] = await sql`
      WITH RandomCharacter AS (
          SELECT *,
          ROW_NUMBER() OVER (
              ORDER BY MD5(CONCAT(${today}, id))::uuid
          ) as rn
          FROM characters
      )
      SELECT * FROM RandomCharacter WHERE rn = 1
  `;

  return {
      id: character.id,
      name: character.name,
      ethnicity: character.ethnicity,
      debutYear: character.debut_year,
      gender: character.gender,
      species: character.species,
      debutGame: character.debut_game,
      quote: character.quote
  };
}

export async function validateGuess(guess: string, character: Character): Promise<{
  isCorrect: boolean;
  matches: {
      debutYear: boolean;
      gender: boolean;
      ethnicity: boolean;
      species: boolean;
      debutGame: boolean;
  };
}> {
  const [guessCharacter] = await sql`
      SELECT * FROM characters WHERE LOWER(name) = LOWER(${guess})
  `;
  
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
          debutYear: guessCharacter.debut_year === character.debutYear,
          gender: guessCharacter.gender === character.gender,
          ethnicity: guessCharacter.ethnicity === character.ethnicity,
          species: guessCharacter.species === character.species,
          debutGame: guessCharacter.debut_game === character.debutGame
      }
  };
}