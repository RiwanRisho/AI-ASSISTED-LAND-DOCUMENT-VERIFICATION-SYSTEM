import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ error: 'Missing q' }, { status: 400 });
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=3&countrycodes=in&accept-language=en&q=${encodeURIComponent(q)}`;
    const r = await fetch(url, { headers: { 'User-Agent': 'LandGuardAI-HackathonPrototype/1.0 contact: hackathon@example.invalid' } });
    if (!r.ok) return NextResponse.json({ results: [], error: `Geocoder ${r.status}` }, { status: 200 });
    const data = await r.json();
    return NextResponse.json({ results: data.map((x: any) => ({ lat: Number(x.lat), lon: Number(x.lon), display_name: x.display_name, type: x.type, importance: x.importance })) });
  } catch {
    return NextResponse.json({ results: [], error: 'Geocoder unavailable' }, { status: 200 });
  }
}
