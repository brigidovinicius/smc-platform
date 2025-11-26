import { NextRequest, NextResponse } from 'next/server';
import { forwardClientEvent, isContext7Enabled } from '@/lib/context7';

export async function POST(req: NextRequest) {
  if (!isContext7Enabled) {
    return NextResponse.json({ success: false, error: 'Context7 disabled' }, { status: 204 });
  }

  try {
    const body = await req.json();
    const result = await forwardClientEvent(body);
    return NextResponse.json(
      { success: result.forwarded, error: result.error },
      { status: result.forwarded ? 200 : 502 }
    );
  } catch (error) {
    console.error('[Context7] Failed to forward event', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process Context7 event' },
      { status: 500 }
    );
  }
}


