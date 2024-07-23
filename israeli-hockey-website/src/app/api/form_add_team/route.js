import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    let {Team_Name, Rank, Location_ID, League_ID, Location_Name} = await req.json();
    try {
        const pool = await getConnection();
        if (!Location_ID && Location_Name){
            // insret new location to Locations table
            let getMaxLocationID = await pool.request()
            .query('SELECT MAX(Location_ID) AS max_Location_ID FROM Locations');
            let maxLocationID = getMaxLocationID.recordset[0].max_Location_ID;
            Location_ID = maxLocationID + 1;

            await pool.request()
            .input('Location_ID',sql.Int, Location_ID)
            .input('Location_Name', sql.NVarChar, Location_Name)
            .query('INSERT INTO Locations (Location_ID, Location_Name) VALUES (@Location_ID, @Location_Name)')
        }
        let getMaxTeamID = await pool.request()
        .query('SELECT MAX(Team_ID) AS max_Team_ID FROM Teams');
        let maxTeamID = getMaxTeamID.recordset[0].max_Team_ID;
        let newTeamId = maxTeamID + 1;
        // insert new team to Teams table
        await pool.request()
            .input('Team_ID',sql.Int, newTeamId)
            .input('Team_Name', sql.NVarChar, Team_Name)
            .input('Rank', sql.NVarChar, Rank)
            .input('Location_ID', sql.Int, Location_ID)
            .input('League_ID', sql.Int, League_ID)
            .query('INSERT INTO Teams (Team_ID, Team_Name, Rank, Location_ID, League_ID) VALUES (@Team_ID, @Team_Name, @Rank, @Location_ID, @League_ID)')
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}