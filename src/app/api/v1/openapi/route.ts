import { NextResponse } from 'next/server';
import { openapiSpec } from '@/core/swagger/openapiSpec';

export async function GET() {
  return NextResponse.json(openapiSpec, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
