// New file: server route to fetch party images from Pexels
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing PEXELS_API_KEY in environment' }, { status: 500 });
  }

  const url = new URL(request.url);
  const perPage = url.searchParams.get('per_page') || '6';

  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=party&per_page=${perPage}`, {
      headers: {
        Authorization: apiKey,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('Pexels API error', res.status, text);
      return NextResponse.json({ error: 'Failed to fetch from Pexels' }, { status: 502 });
    }

    const data = await res.json();
    // Map to useful sizes
    const photos: string[] = (data.photos || []).map((p: any) => p.src?.medium || p.src?.large || p.src?.original).filter(Boolean);

    return NextResponse.json({ photos });
  } catch (err) {
    console.error('Error fetching Pexels', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
