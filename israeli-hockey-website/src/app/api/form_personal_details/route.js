import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

// Update Users Table
export async function POST(req, res) {
    const {User_ID, Full_Name, Email, Phone, Date_of_Birth} = await req.json();
    try {
      const pool = await getConnection();
      await pool.request()
        .input('User_ID',sql.Int, User_ID)
        .input('Full_Name', sql.NVarChar, Full_Name)
        .input('Email', sql.NVarChar, Email)
        .input('Phone', sql.NVarChar, Phone)
        .input('Date_of_Birth',sql.Date, new Date(Date_of_Birth))
        .query('UPDATE Users SET Full_Name = @Full_Name, Date_of_Birth = @Date_of_Birth, Phone = @Phone, Email = @Email WHERE User_ID = @User_ID;')
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }

}