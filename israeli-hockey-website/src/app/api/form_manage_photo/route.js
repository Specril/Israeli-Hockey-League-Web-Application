import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {Photo, Photo_Name} = await req.json();
    try {
        const pool = await getConnection();
        let checkName = await pool.request()
            .input('Photo_Name', sql.VarChar, Photo_Name)
            .query('SELECT COUNT(*) as count FROM Photos WHERE Photo_Name = @Photo_Name');

        if (checkName.recordset[0].count > 0){
            return NextResponse.json({error: 'Photo_Name already in data'});
        }
        console.log('after checkName')
        let getMaxPhotoID = await pool.request()
            .query('SELECT MAX(Photo_ID) AS max_Photo_ID FROM Photos');
        let maxPhotoID = getMaxPhotoID.recordset[0].max_Photo_ID;
        let Photo_ID = maxPhotoID + 1;
        if (!maxPhotoID){
            Photo_ID = 1;
        }

        await pool.request()
            .input('Photo_ID',sql.Int, Photo_ID)
            .input('Photo', sql.Text, Photo)
            .input('Photo_Name', sql.NVarChar, Photo_Name)
            .query('INSERT INTO Photos (Photo_ID, Photo, Photo_Name) VALUES (@Photo_ID, @Photo, @Photo_Name)')
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