import { NextResponse } from 'next/server';
import { context7ServerClient, isContext7Enabled } from '@/lib/context7';

export async function GET() {
  if (!isContext7Enabled) {
    return NextResponse.json(
      { success: false, status: 'disabled', timestamp: Date.now() },
      { status: 200 }
    );
  }

  const result = await context7ServerClient.health();
  return NextResponse.json(
    {
      success: result.ok,
      status: result.ok ? 'ok' : 'degraded',
      timestamp: Date.now(),
      error: result.error
    },
    { status: result.ok ? 200 : result.status ?? 502 }
  );
}


