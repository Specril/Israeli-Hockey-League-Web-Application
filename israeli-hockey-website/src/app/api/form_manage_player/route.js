import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {User_ID, Team_ID, Position, Shirt_Number} = await req.json();
    try {
        const pool = await getConnection();
        // insert the player to PlayersInTeams table
        await pool.request()
            .input('User_ID',sql.Int, User_ID)
            .input('Team_ID', sql.Int, Team_ID)
            .input('Position', sql.NVarChar, Position)
            .input('Shirt_Number', sql.Int, Shirt_Number)
            .query('INSERT INTO PlayersInTeams (User_ID, Team_ID, Position, Shirt_Number) VALUES (@User_ID, @Team_ID, @Position, @Shirt_Number)')
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const { User_ID , Team_ID } = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .input('Team_ID', sql.Int, Team_ID)
            .query('DELETE FROM PlayersInTeams WHERE User_ID = @User_ID and Team_ID = @Team_ID;');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}