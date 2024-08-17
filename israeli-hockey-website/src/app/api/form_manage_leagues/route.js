import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Age, League_type} = await req.json();
    try {
        const pool = await getConnection();
        let getMaxLeagueID = await pool.request()
            .query('SELECT MAX(League_ID) AS max_League_ID FROM League');
        let maxLeagueID = getMaxLeagueID.recordset[0].max_League_ID;
        let newLeagueId = maxLeagueID + 1;
        if (!maxLeagueID){
            newLeagueId = 1;
        }
        
        await pool.request()
            .input('League_ID',sql.Int, newLeagueId)
            .input('Age',sql.NVarChar, Age)
            .input('League_type',sql.NVarChar, League_type)
            .query('INSERT INTO League (League_ID, Age, League_type) VALUES (@League_ID, @Age, @League_type)')
        
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const {League_ID} = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('League_ID',sql.Int, League_ID)
            .query('DELETE FROM League WHERE League_ID = @League_ID;')

        await pool.request()
            .input('League_ID',sql.Int, League_ID)
            .query('DELETE FROM TeamsInLeagues WHERE League_ID = @League_ID;')
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}