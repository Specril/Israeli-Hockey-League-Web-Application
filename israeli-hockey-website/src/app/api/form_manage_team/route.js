import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    let {Team_Name, Rank, Location_ID, Age, New_Location} = await req.json();
    try {
        const pool = await getConnection();
        if (New_Location){
            // insret new location to Locations table
            let getMaxLocationID = await pool.request()
            .query('SELECT MAX(Location_ID) AS max_Location_ID FROM Locations');
            let maxLocationID = getMaxLocationID.recordset[0].max_Location_ID;
            Location_ID = maxLocationID + 1;
            if (!maxLocationID){
                Location_ID = 1;
            }

            await pool.request()
            .input('Location_ID',sql.Int, Location_ID)
            .input('Location_Name', sql.NVarChar, New_Location)
            .query('INSERT INTO Locations (Location_ID, Location_Name) VALUES (@Location_ID, @Location_Name)')
        }
        let getMaxTeamID = await pool.request()
        .query('SELECT MAX(Team_ID) AS max_Team_ID FROM Teams');
        let maxTeamID = getMaxTeamID.recordset[0].max_Team_ID;
        let newTeamId = maxTeamID + 1;
        if (!maxTeamID){
            newTeamId = 1;
        }
        // insert new team to Teams table
        await pool.request()
            .input('Team_ID',sql.Int, newTeamId)
            .input('Team_Name', sql.NVarChar, Team_Name)
            .input('Rank', sql.NVarChar, Rank)
            .input('Location_ID', sql.Int, Location_ID)
            .input('Age', sql.NVarChar, Age)
            .query('INSERT INTO Teams (Team_ID, Team_Name, Rank, Location_ID, Age) VALUES (@Team_ID, @Team_Name, @Rank, @Location_ID, @Age)')
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const { Team_ID } = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Team_ID', sql.Int, Team_ID)
            .query('DELETE FROM Teams WHERE Team_ID = @Team_ID');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}