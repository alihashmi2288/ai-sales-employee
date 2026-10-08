import { NextResponse } from 'next/server';
import * as db from '@/lib/db';

export async function GET() {
  try {
    const products = await db.getAllProducts();
    return NextResponse.json({ products });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const product = await db.upsertProduct(body);
    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
