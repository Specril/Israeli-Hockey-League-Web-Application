import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    let {User_ID, Full_Name, Email, Phone, Date_of_Birth, Residence, UID} = await req.json();
    try {
      if (Date_of_Birth){
        Date_of_Birth = new Date(Date_of_Birth);
      }
      if (User_ID){
        // update Users Table
        const pool = await getConnection();
        await pool.request()
          .input('User_ID',sql.Int, User_ID)
          .input('Full_Name', sql.NVarChar, Full_Name)
          .input('Email', sql.NVarChar, Email)
          .input('Phone', sql.NVarChar, Phone)
          .input('Date_of_Birth',sql.Date, Date_of_Birth)
          .input('Residence', sql.NVarChar, Residence)
          .query('UPDATE Users SET Full_Name = @Full_Name, Date_of_Birth = @Date_of_Birth, Phone = @Phone, Email = @Email, Residence = @Residence WHERE User_ID = @User_ID;')
        return NextResponse.json({ success: true});
      }
      else {
         // insert new user to Users Table
        const pool = await getConnection();
        let getMaxUserID = await pool.request()
            .query('SELECT MAX(User_ID) AS max_User_ID FROM Users');
        let maxUserID = getMaxUserID.recordset[0].max_User_ID;
        let newUserId = maxUserID + 1;
        if (!maxUserID){
          newUserId = 1;
        }
         await pool.request()
           .input('User_ID',sql.Int, newUserId)
           .input('Full_Name', sql.NVarChar, Full_Name)
           .input('Email', sql.NVarChar, Email)
           .input('Phone', sql.NVarChar, Phone)
           .input('Date_of_Birth',sql.Date, Date_of_Birth)
          .input('Residence', sql.NVarChar, Residence)
           .input('UID',sql.VarChar, UID)
           .query('INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email, Residence, UID) VALUES (@User_ID, @Full_Name, @Date_of_Birth, @Phone, @Email, @Residence, @UID)')
         return NextResponse.json({ success: true});
      }
      

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }

}