import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Game_ID, League_ID, Home_Team_ID, Away_Team_ID, Day, Date, Start_Time, Location, Location_ID, Referee_ID, Second_Referee_ID} = await req.json();
    try {
        const pool = await getConnection();
        if (Game_ID){
            // update game in Games table
            await pool.request()
                .input('Game_ID',sql.Int, Game_ID)
                .input('League_ID', sql.Int, League_ID)
                .input('Home_Team_ID', sql.Int, Home_Team_ID)
                .input('Away_Team_ID', sql.Int, Away_Team_ID)
                .input('Day', sql.NVarChar, Day)
                .input('Date', sql.Date, Date)
                .input('Start_Time', sql.VarChar, Start_Time)
                .input('Location', sql.NVarChar, Location)
                .input('Location_ID', sql.Int, Location_ID)
                .input('Referee_ID', sql.Int, Referee_ID)
                .input('Second_Referee_ID', sql.Int, Second_Referee_ID)
                .query('UPDATE Games SET League_ID = @League_ID, Home_Team_ID = @Home_Team_ID, Away_Team_ID = @Away_Team_ID, Day = @Day, Date = @Date, Start_Time = @Start_Time, Location = @Location, Location_ID = @Location_ID, Referee_ID = @Referee_ID, Second_Referee_ID = @Second_Referee_ID WHERE Game_ID = @Game_ID')
            return NextResponse.json({ success: true});
        }
        else {
            let getMaxGameID = await pool.request()
                .query('SELECT MAX(Game_ID) AS max_Game_ID FROM Games');
            let maxGameID = getMaxGameID.recordset[0].max_Game_ID;
            let newGameId = maxGameID + 1;
            // insert new team to Teams table
            await pool.request()
                .input('Game_ID',sql.Int, newGameId)
                .input('League_ID', sql.Int, League_ID)
                .input('Home_Team_ID', sql.Int, Home_Team_ID)
                .input('Away_Team_ID', sql.Int, Away_Team_ID)
                .input('Day', sql.NVarChar, Day)
                .input('Date', sql.Date, Date)
                .input('Start_Time', sql.VarChar, Start_Time)
                .input('Location', sql.NVarChar, Location)
                .input('Location_ID', sql.Int, Location_ID)
                .input('Referee_ID', sql.Int, Referee_ID)
                .input('Second_Referee_ID', sql.Int, Second_Referee_ID)
                .query('INSERT INTO Games (Game_ID, League_ID, Home_Team_ID, Away_Team_ID, Day, Date, Start_Time, Location, Location_ID, Referee_ID, Second_Referee_ID) VALUES (@Game_ID, @League_ID, @Home_Team_ID, @Away_Team_ID, @Day, @Date, @Start_Time, @Location, @Location_ID, @Referee_ID, @Second_Referee_ID);')
            return NextResponse.json({ success: true});
        }
        
    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}