import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Team_ID, League_ID} = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Team_ID',sql.Int, Team_ID)
            .input('League_ID',sql.Int, League_ID)
            .query('INSERT INTO TeamsInLeagues (Team_ID, League_ID) VALUES (@Team_ID, @League_ID)')
        
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const {Team_ID, League_ID} = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Team_ID',sql.Int, Team_ID)
            .input('League_ID',sql.Int, League_ID)
            .query('DELETE FROM TeamsInLeagues WHERE Team_ID = @Team_ID and League_ID = @League_ID;')
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}