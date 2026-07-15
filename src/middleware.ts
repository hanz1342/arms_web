import { NextResponse, NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const loginURL = new URL('/auth', request.url);

  if (token) {
    return NextResponse.next();
  } else {
    return NextResponse.redirect(loginURL);
  }
}
export const config = {
  matcher: [
    '/',
    '/dashboard',
    '/risk_detail',
    '/risk_details',
    '/riskmatrix',
    '/departments',
    '/directorates',
    '/divisions',
    '/employees',
    '/impact_categories',
    '/quarters',
    '/ra_asec_wides',
    '/ra_departments',
    '/ra_directorates',
    '/risk_category',
    '/risks',
  ],
};