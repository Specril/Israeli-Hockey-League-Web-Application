
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";



import sql from 'mssql';

export async function POST(req, res) {
//   if (req.method === 'POST') {
    const { Full_Name, Email, Phone, User_ID} = await req.json();
        console.log(Full_Name + User_ID)
    try {
      const pool = await getConnection();
      await pool.request()
        .input('User_ID',sql.Int, User_ID)
        .input('Full_Name', sql.NVarChar, Full_Name)
        .input('Email', sql.NVarChar, Email)
        .input('Phone', sql.NVarChar, Phone)
        .input('Date_of_Birth',sql.Date, new Date('2008-02-24T00:00:00.000Z'))
        // .query('INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email)  VALUES (@User_ID, @Full_Name, @Date_of_Birth, @Phone, @Email);')
        .query('UPDATE Users SET Full_Name = @Full_Name, Date_of_Birth = @Date_of_Birth, Phone = @Phone, Email = @Email WHERE User_ID = @User_ID;')
        return NextResponse.json({ success: true});

      
    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
     
    }
//   } else {
    // res.setHeader('Allow', ['POST']);
//     console.log('inside else')
    
//   }
}