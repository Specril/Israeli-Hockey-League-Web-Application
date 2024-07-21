import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Photo} = await req.json();
    try {
        console.log(Photo)
        const pool = await getConnection();
        let getMaxPhotoID = await pool.request()
            .query('SELECT MAX(Photo_ID) AS max_Photo_ID FROM photos');
        let maxPhotoID = getMaxPhotoID.recordset[0].max_Photo_ID;
        let Photo_ID = maxPhotoID + 1;
        console.log(maxPhotoID)
        if (!maxPhotoID){
            Photo_ID = 1;
        }

        await pool.request()
            .input('Photo_ID',sql.Int, Photo_ID)
            .input('Photo', sql.Text, Photo)
            .query('INSERT INTO photos (Photo_ID, Photo) VALUES (@Photo_ID, @Photo)')
        return NextResponse.json({ success: true});
        
    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}