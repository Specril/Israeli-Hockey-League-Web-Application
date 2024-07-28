import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {User_ID, Experience} = await req.json();
    try {
        const pool = await getConnection();
        let result = await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .query('SELECT COUNT(*) as count FROM UsersReferees WHERE User_ID = @User_ID');

        if (result.recordset[0].count === 0){
            // insert the user to UsersReferees table
            const Date_Created = new Date();
            await pool.request()
            .input('User_ID',sql.Int, User_ID)
            .input('Date_Created', sql.Date, Date_Created)
            .input('Experience', sql.NVarChar, Experience)
            .query('INSERT INTO UsersReferees (User_ID, Date_Created, Experience) VALUES (@User_ID, @Date_Created, @Experience)')
        }
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const { User_ID } = await req.json();
    try {
        const pool = await getConnection();
        await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .query('DELETE FROM UsersReferees WHERE User_ID = @User_ID;');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}