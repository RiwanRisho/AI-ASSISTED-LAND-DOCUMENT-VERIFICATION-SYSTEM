import { NextResponse } from 'next/server';
import { verifyDocuments } from '@/lib/verification';
export async function POST(req:Request){ try { const body=await req.json(); return NextResponse.json(verifyDocuments(body.documents||[])); } catch { return NextResponse.json({error:'Invalid verification payload'},{status:400}); } }
