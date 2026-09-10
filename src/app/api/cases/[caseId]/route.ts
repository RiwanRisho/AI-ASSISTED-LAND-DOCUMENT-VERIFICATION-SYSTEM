import { NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;

    const cases = (await getDb()).collection<any>('cases');

    const row = await cases.findOne(
      { caseId },
      { projection: { _id: 0 } }
    );

    if (!row) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ case: row });
  } catch {
    return NextResponse.json(
      { error: 'Persistent storage unavailable.' },
      { status: 503 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const { caseId } = await params;
    const body = await req.json();

    const allowed: Record<string, any> = {
      updatedAt: new Date(),
    };

    for (const key of ['status', 'decision', 'assignedOfficer']) {
      if (body?.[key] !== undefined) {
        allowed[key] = String(body[key]).slice(0, 200);
      }
    }

    const db = await getDb();
    const cases = db.collection<any>('cases');

    const auditEntry = {
      action: allowed.decision
        ? `Decision: ${allowed.decision}`
        : `Status: ${allowed.status || 'updated'}`,
      timestamp: new Date(),
      actor: String(body?.actor || 'PUBLIC INTAKE'),
    };

    const result = await cases.updateOne(
      { caseId },
      {
        $set: allowed,
        $push: {
          auditTrail: auditEntry,
        },
      } as any
    );

    if (!result.matchedCount) {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: 'Could not update case.' },
      { status: 500 }
    );
  }
}