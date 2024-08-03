import { NextResponse } from "next/server";
import { getConnection } from "@/app/lib/db";

export async function POST(req, res) {
  try {
    const { query } = await req.json();
    if (!query) {
      return NextResponse.json({ success: false, message: 'Query is missing' });
    }
    const pool = await getConnection();
    const result = await pool.request()
        .query(query);

    return NextResponse.json(result.recordset);

  } catch (error) {
    console.error('Database operation failed: ', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch the data' });
  }
}