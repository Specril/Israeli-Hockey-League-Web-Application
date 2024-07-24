import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Game_ID, Goals, Penalties, Cards} = await req.json();
    try {
      const pool = await getConnection();
      for (const goal of Goals){
        // insert each goal to Goals table
        let getMaxGoalID = await pool.request()
            .query('SELECT MAX(Goal_ID) AS max_Goal_ID FROM Goals');
        let maxGoalID = getMaxGoalID.recordset[0].max_Goal_ID;
        let newGoalId = maxGoalID + 1;
        if (!maxGoalID){
          newGoalId = 1;
        }
        await pool.request()
            .input('Goal_ID',sql.Int, newGoalId)
            .input('Game_ID',sql.Int, Game_ID)
            .input('User_ID',sql.Int, goal['User_ID'])
            .input('Team_ID', sql.Int, goal['Team_ID'])
            .input('Time_Stamp', sql.VarChar, goal['Time_Stamp'])
            .query('INSERT INTO Goals (Goal_ID, Game_ID, User_ID, Team_ID, Time_Stamp) VALUES (@Goal_ID, @Game_ID, @User_ID, @Team_ID, @Time_Stamp)')
      }
      for (const penalty of Penalties){
        // insert each Penalty to Penalties table
        let getMaxPenaltyID = await pool.request()
            .query('SELECT MAX(Penalty_ID) AS max_Penalty_ID FROM Penalties');
        let maxPenaltyID = getMaxPenaltyID.recordset[0].max_Penalty_ID;
        let newPenaltyId = maxPenaltyID + 1;
        if (!maxPenaltyID){
          newPenaltyId = 1;
        }
        await pool.request()
            .input('Penalty_ID',sql.Int, newPenaltyId)
            .input('Game_ID',sql.Int, Game_ID)
            .input('User_ID',sql.Int, penalty['User_ID'])
            .input('Time_Stamp', sql.VarChar, penalty['Time_Stamp'])
            .input('Team_ID', sql.Int, penalty['Team_ID'])
            .query('INSERT INTO Penalties (Penalty_ID, Game_ID, User_ID, Time_Stamp, Team_ID) VALUES (@Penalty_ID, @Game_ID, @User_ID, @Time_Stamp, @Team_ID)')
      }
      for (const card of Cards){
        // insert each Card to Cards table
        let getMaxCardID = await pool.request()
        .query('SELECT MAX(Card_ID) AS max_Card_ID FROM Cards');
        let maxCardID = getMaxCardID.recordset[0].max_Card_ID;
        let newCardId = maxCardID + 1;
        if (!maxCardID){
          newCardId = 1;
        }
          await pool.request()
            .input('Card_ID',sql.Int, newCardId)
            .input('Game_ID',sql.Int, Game_ID)
            .input('User_ID',sql.Int, card['User_ID'])
            .input('Time_Stamp', sql.VarChar, card['Time_Stamp'])
            .input('Team_ID', sql.Int, card['Team_ID'])
            .input('Card_Type', sql.VarChar, card['Card_Type'])
            .query('INSERT INTO Cards (Card_ID, Game_ID, User_ID, Time_Stamp, Team_ID, Card_Type) VALUES (@Card_ID, @Game_ID, @User_ID, @Time_Stamp, @Team_ID, @Card_Type)')
    }
      return NextResponse.json({ success: true});


    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }

}