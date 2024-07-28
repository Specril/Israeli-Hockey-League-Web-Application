import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {User_ID} = await req.json();
    try {
        const pool = await getConnection();
        let result = await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .query('SELECT COUNT(*) as count FROM UsersAdmin WHERE User_ID = @User_ID');

        if (result.recordset[0].count === 0){
            // insert the user to UsersAdmin table
            const Date_Created = new Date();
            await pool.request()
            .input('User_ID',sql.Int, User_ID)
            .query('INSERT INTO UsersAdmin (User_ID) VALUES (@User_ID)')
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
        let tableCheckResult = await pool.request()
            .query(`SELECT * FROM UsersAdmin;`);
        const rowCount = tableCheckResult.recordset.length;
        if (rowCount === 1){
            return NextResponse.json({ success: false, error: "There is only one admin, can't delete it" });
        }
        await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .query('DELETE FROM UsersAdmin WHERE User_ID = @User_ID;');
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}