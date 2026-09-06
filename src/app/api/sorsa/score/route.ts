import { NextResponse, type NextRequest } from 'next/server';
import { factValue, PUBLIC_FIRM_PROFILES } from '@/lib/data/publicFirmProfiles';

const SORSA_SCORE_URL = 'https://api.sorsa.io/v3/score';
const X_USERNAME = /^[A-Za-z0-9_]{1,15}$/;
const TRACKED_USERNAMES = new Set(
  PUBLIC_FIRM_PROFILES
    .map((firm) => factValue(firm.identity.xHandle)?.replace(/^@/, '').toLowerCase())
    .filter((username): username is string => Boolean(username)),
);

type SorsaScoreResponse = {
  score?: unknown;
};

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get('username')?.replace(/^@/, '').trim() ?? '';
  if (!X_USERNAME.test(username)) {
    return NextResponse.json({ message: 'Invalid X username.' }, { status: 400 });
  }
  if (!TRACKED_USERNAMES.has(username.toLowerCase())) {
    return NextResponse.json({ message: 'X account is not part of the firm directory.' }, { status: 404 });
  }

  const apiKey = process.env.SORSA_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json({ message: 'Sorsa is not configured.' }, { status: 503 });
  }

  try {
    const response = await fetch(`${SORSA_SCORE_URL}?username=${encodeURIComponent(username)}`, {
      headers: { ApiKey: apiKey },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: response.status === 404 ? 'Sorsa score not found.' : 'Sorsa score is unavailable.' },
        { status: response.status === 404 ? 404 : 502 },
      );
    }

    const data = await response.json() as SorsaScoreResponse;
    if (typeof data.score !== 'number' || !Number.isFinite(data.score)) {
      return NextResponse.json({ message: 'Sorsa returned an invalid score.' }, { status: 502 });
    }

    return NextResponse.json(
      { score: data.score, source: 'Sorsa', checkedAt: new Date().toISOString() },
      { headers: { 'Cache-Control': 'private, max-age=300' } },
    );
  } catch {
    return NextResponse.json({ message: 'Sorsa score request failed.' }, { status: 502 });
  }
}
