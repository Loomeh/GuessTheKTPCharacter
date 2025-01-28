import { NextResponse } from 'next/server';
import sql from '@/app/lib/db';

export const dynamic = 'force-dynamic';

async function selectRandomCharacter() {
    const today = new Date().toISOString().split('T')[0];

    const [character] = await sql`
        WITH RandomCharacter AS (
            SELECT *,
            ROW_NUMBER() OVER (
                ORDER BY MD5(CONCAT(${today}, id))::uuid
            ) as rn
            FROM characters
        )
        SELECT id FROM RandomCharacter WHERE rn = 1
    `;

    return character.id;
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