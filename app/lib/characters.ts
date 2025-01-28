import pool from './db';
import type { Character } from '@/app/types/characters';

export async function getAllCharacters(): Promise<Character[]> {
    const result = await pool.query('SELECT * FROM characters');
    return result.rows.map(row => ({
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
  const client = await pool.connect();
  try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's character ID from daily_character table
      const dailyResult = await client.query(
          `SELECT c.* 
           FROM characters c
           JOIN daily_character dc ON c.id = dc.character_id
           WHERE dc.date = $1`,
          [today]
      );

      if (dailyResult.rows.length === 0) {
          // If no character is set for today, select one randomly
          const result = await client.query('SELECT * FROM characters ORDER BY RANDOM() LIMIT 1');
          const character = result.rows[0];
          
          // Store it as today's character
          await client.query(
              'INSERT INTO daily_character (character_id, date) VALUES ($1, $2) ON CONFLICT (date) DO UPDATE SET character_id = $1',
              [character.id, today]
          );

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

      const character = dailyResult.rows[0];
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
  } finally {
      client.release();
  }
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
    const result = await pool.query(
        'SELECT * FROM characters WHERE LOWER(name) = LOWER($1)',
        [guess]
    );
    
    // Early return if character not found
    if (result.rows.length === 0) {
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

    const guessCharacter = result.rows[0];
    
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