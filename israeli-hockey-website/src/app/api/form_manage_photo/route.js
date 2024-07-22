import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Photo} = await req.json();
    try {
        const pool = await getConnection();
        let getMaxPhotoID = await pool.request()
            .query('SELECT MAX(Photo_ID) AS max_Photo_ID FROM Photos');
        let maxPhotoID = getMaxPhotoID.recordset[0].max_Photo_ID;
        let Photo_ID = maxPhotoID + 1;
        console.log(maxPhotoID)
        if (!maxPhotoID){
            Photo_ID = 1;
        }

        await pool.request()
            .input('Photo_ID',sql.Int, Photo_ID)
            .input('Photo', sql.Text, Photo)
            .query('INSERT INTO Photos (Photo_ID, Photo) VALUES (@Photo_ID, @Photo)')
        return NextResponse.json({ success: true});
        
    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const { Photo_ID } = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('Photo_ID', sql.Int, Photo_ID)
            .query('DELETE FROM Photos WHERE Photo_ID = @Photo_ID');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}