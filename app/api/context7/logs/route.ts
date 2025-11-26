import { NextRequest, NextResponse } from 'next/server';
import { context7ServerClient, isContext7Enabled } from '@/lib/context7';

export async function POST(req: NextRequest) {
  if (!isContext7Enabled) {
    return NextResponse.json({ success: false, error: 'Context7 disabled' }, { status: 204 });
  }

  try {
    const body = await req.json();
    const result = await context7ServerClient.logAction({
      ...body,
      timestamp: Date.now(),
      type: body?.type ?? 'log'
    });

    return NextResponse.json(
      { success: result.ok, error: result.error },
      { status: result.ok ? 200 : result.status ?? 502 }
    );
  } catch (error) {
    console.error('[Context7] Failed to log event', error);
    return NextResponse.json({ success: false, error: 'Failed to log event' }, { status: 500 });
  }
}


