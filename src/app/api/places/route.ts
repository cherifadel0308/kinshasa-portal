import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const commune = searchParams.get('commune');
  const type = searchParams.get('type');

  if (!commune) {
    return NextResponse.json({ error: 'Commune parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Server API Credentials' }, { status: 500 });
  }
  
  let searchQuery = `${commune}, Kinshasa`;
  if (type === 'economy') searchQuery += ' bank market business store commercial';
  if (type === 'social') searchQuery += ' hospital school clinic pharmacy administrative';
  if (type === 'cultural') searchQuery += ' restaurant hotel museum monument club entertainment';

  const googleUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    searchQuery
  )}&key=${apiKey}`;

  try {
    const res = await fetch(googleUrl, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data.results || []);
  } catch (error) {
    return NextResponse.json({ error: 'Google Maps API Fetch Error' }, { status: 500 });
  }
}