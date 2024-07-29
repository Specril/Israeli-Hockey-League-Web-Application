import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";
import sql from 'mssql';

export async function POST(req, res) {
    const {User_ID, admin, referee, coach, player, fan} = await req.json();
    try {
        const pool = await getConnection();
        if (admin){
            let result = await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('SELECT COUNT(*) as count FROM UsersAdmin WHERE User_ID = @User_ID');

            if (result.recordset[0].count === 0){
                // insert the user to UsersAdmin table
                await pool.request()
                .input('User_ID',sql.Int, User_ID)
                .query('INSERT INTO UsersAdmin (User_ID) VALUES (@User_ID)')
            }
        }
        if (referee) {
            let result = await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('SELECT COUNT(*) as count FROM UsersReferees WHERE User_ID = @User_ID');

            if (result.recordset[0].count === 0){
                // insert the user to UsersReferees table
                await pool.request()
                .input('User_ID',sql.Int, User_ID)
                .query('INSERT INTO UsersReferees (User_ID) VALUES (@User_ID)')
            }
        }
        if (coach){
            let result = await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('SELECT COUNT(*) as count FROM UsersCoaches WHERE User_ID = @User_ID');

            if (result.recordset[0].count === 0){
                // insert the user to UsersCoaches table
                await pool.request()
                .input('User_ID',sql.Int, User_ID)
                .query('INSERT INTO UsersCoaches (User_ID) VALUES (@User_ID)')
            }
        }
        if (player){
            let result = await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('SELECT COUNT(*) as count FROM UsersPlayers WHERE User_ID = @User_ID');

            if (result.recordset[0].count === 0){
                // insert the user to UsersPlayers table
                await pool.request()
                .input('User_ID',sql.Int, User_ID)
                .query('INSERT INTO UsersPlayers (User_ID) VALUES (@User_ID)')
            }
        }
        if (fan){
            let result = await pool.request()
            .input('User_ID', sql.Int, User_ID)
            .query('SELECT COUNT(*) as count FROM UsersFans WHERE User_ID = @User_ID');

            if (result.recordset[0].count === 0){
                // insert the user to UsersFans table
                await pool.request()
                .input('User_ID',sql.Int, User_ID)
                .query('INSERT INTO UsersFans (User_ID) VALUES (@User_ID)')
            }
        }
        return NextResponse.json({ success: true});

    } catch (error) {
      console.error('Database operation failed: ', error);
      return NextResponse.json({ success: false});
    }
}

export async function DELETE(req, res) {
    const { User_ID, admin, referee, coach, player, fan } = await req.json();
    try {
        const pool = await getConnection();
        if (admin){
            let tableCheckResult = await pool.request()
                .query(`SELECT * FROM UsersAdmin;`);
            const rowCount = tableCheckResult.recordset.length;
            if (rowCount === 1){
                return NextResponse.json({ success: false, error: "There is only one admin, can't delete it" });
            }
            await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('DELETE FROM UsersAdmin WHERE User_ID = @User_ID;');
        }
        if (referee) {
            await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('DELETE FROM UsersReferees WHERE User_ID = @User_ID;');
        }
        if (coach){
            await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('DELETE FROM UsersCoaches WHERE User_ID = @User_ID;');
        }
        if (player){
            await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('DELETE FROM UsersPlayers WHERE User_ID = @User_ID;');
        }
        if (fan){
            await pool.request()
                .input('User_ID', sql.Int, User_ID)
                .query('DELETE FROM UsersFans WHERE User_ID = @User_ID;');
        }
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Database operation failed: ', error);
        return NextResponse.json({ success: false });
    }
}