import { NextRequest, NextResponse } from 'next/server';
import { context7ServerClient, isContext7Enabled } from '@/lib/context7';

export async function POST(req: NextRequest) {
  if (!isContext7Enabled) {
    return NextResponse.json({ success: false, error: 'Context7 disabled' }, { status: 204 });
  }

  try {
    const body = await req.json();
    const response = await context7ServerClient.identify({
      ...body,
      timestamp: Date.now()
    });

    return NextResponse.json(
      { success: response.ok, error: response.error },
      { status: response.ok ? 200 : response.status ?? 502 }
    );
  } catch (error) {
    console.error('[Context7] Identify failed', error);
    return NextResponse.json({ success: false, error: 'Identify failed' }, { status: 500 });
  }
}


