import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function badRequest(message: string, details?: any) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message: string = 'Not found') {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function serverError(message: string = 'Internal server error') {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function success(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}
