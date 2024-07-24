
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function GET(req, res) {
    const url = new URL(req.url);
    const User_ID = url.searchParams.get('User_ID');
    try {
        const pool = await getConnection();
        let result = await pool.request()
        .input('User_ID', sql.Int, User_ID)
        .query(`
            SELECT
                (CASE WHEN EXISTS (SELECT 1 FROM UsersAdmin WHERE User_ID = @User_ID) THEN 1 ELSE 0 END) AS inUsersAdmin,
                (CASE WHEN EXISTS (SELECT 1 FROM UsersReferees WHERE User_ID = @User_ID) THEN 1 ELSE 0 END) AS inUsersReferees,
                (CASE WHEN EXISTS (SELECT 1 FROM UsersCoaches WHERE User_ID = @User_ID) THEN 1 ELSE 0 END) AS inUsersCoaches,
                (CASE WHEN EXISTS (SELECT 1 FROM UsersPlayers WHERE User_ID = @User_ID) THEN 1 ELSE 0 END) AS inUsersPlayers,
                (CASE WHEN EXISTS (SELECT 1 FROM UsersFans WHERE User_ID = @User_ID) THEN 1 ELSE 0 END) AS inUsersFans
        `);
        
        const inUsersAdmin = result.recordset[0].inUsersAdmin;
        const inUsersReferees = result.recordset[0].inUsersReferees;
        const inUsersCoaches = result.recordset[0].inUsersCoaches;
        const inUsersPlayers = result.recordset[0].inUsersPlayers;
        const inUsersFans = result.recordset[0].inUsersFans;

        const typesJson = {
            "admin": inUsersAdmin,
            "referee": inUsersReferees,
            "coach": inUsersCoaches,
            "player": inUsersPlayers,
            "fan": inUsersFans
        }
        return NextResponse.json({ result: typesJson});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}




