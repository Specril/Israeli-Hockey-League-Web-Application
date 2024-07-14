
import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";




// Connection configuration
// const config = {
//   authentication: {
//     options: {
//       userName: DB_USER,
//       password: DB_PASSWORD,
//     },
//     type: "default",
//   },
//   server: DB_SERVER,
//   options: {
//     database: DB_NAME,
//     encrypt: true, // Use encryption
//     trustServerCertificate: true, // Change this based on your security requirements
//   },
// };


// export async function POST(req) {
//     try {
//         const { userId } = await req.json();
//         const db = await getConnection();

//         const user = await db.collection('Users').findOne(
//             { _id: new ObjectId(userId) },
//             { projection: { firstName: 1, lastName: 1, email: 1, role: 1, fromFacebook: 1} }
//         );

//         if (user) {
//             return NextResponse.json({ success: true, information: user });
//         } else {
//             return NextResponse.json({ success: false, message: "User not found" });
//         }

//     } catch (error) {
//         return NextResponse.json({ success: false, message: error.message });
//     }
// }



import sql from 'mssql';

export async function POST(req, res) {
  if (req.method === 'POST') {
    const { Full_Name, Email, Phone } = req.body;
        console.log('hiiiiiiiiii')
    try {
      const pool = await getConnection();
      const result = await pool.request()
        .input('User_ID',sql.Int, 200)
        .input('Full_Name', sql.NVarChar, Full_Name)
        .input('Email', sql.NVarChar, Email)
        .input('Phone', sql.NVarChar, Phone)
        .input('Date_of_Birth',sql.Date, new Date(2024,1,1))
        .query('INSERT INTO Users (User_ID, Full_Name, Date_of_Birth, Phone, Email)  VALUES (@User_ID, @Full_Name, @Date_of_Birth, @Phone, @Email);')
        

      res.status(200).json({ message: 'Data received successfully', result });
    } catch (error) {
      console.error('Database operation failed: ', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}