
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function GET(req, res) {
    const url = new URL(req.url);
    const UID = url.searchParams.get('UID');
    try {
        const pool = await getConnection();
        let result = await pool.request()
            .input('UID', sql.VarChar, UID)
            .query(`SELECT User_ID FROM Users WHERE UID = @UID;`);
        
        const User_ID = result.recordset.length > 0 ? result.recordset[0].User_ID : null;
        return NextResponse.json({ User_ID: User_ID});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}




