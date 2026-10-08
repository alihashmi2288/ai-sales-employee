import { NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { OrderStatus } from '@/lib/types';

export async function GET() {
  try {
    const orders = await db.getOrders();
    return NextResponse.json({ orders });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { orderId, status } = body;
    if (!orderId || !status) {
      return NextResponse.json({ error: 'orderId and status required' }, { status: 400 });
    }
    const updated = await db.updateOrderStatus(orderId, status as OrderStatus);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
