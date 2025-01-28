import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export const dynamic = 'force-dynamic';

async function selectRandomCharacter() {
    const client = await pool.connect();
    try {
        // Get today's date in UTC
        const today = new Date().toISOString().split('T')[0];

        // Check if we already have a character for today
        const existingResult = await client.query(
            'SELECT character_id FROM daily_character WHERE date = $1',
            [today]
        );

        if (existingResult.rows.length > 0) {
            return existingResult.rows[0].character_id;
        }

        // Select a random character
        const result = await client.query(
            'SELECT id FROM characters ORDER BY RANDOM() LIMIT 1'
        );
        
        const characterId = result.rows[0].id;

        // Store the selected character for today
        await client.query(
            'INSERT INTO daily_character (character_id, date) VALUES ($1, $2) ON CONFLICT (date) DO UPDATE SET character_id = $1',
            [characterId, today]
        );

        return characterId;
    } finally {
        client.release();
    }
}

export async function GET() {
    try {
        const characterId = await selectRandomCharacter();
        return NextResponse.json({ success: true, characterId });
    } catch (error) {
        console.error('Error in daily character cron:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to select daily character' },
            { status: 500 }
        );
    }
}