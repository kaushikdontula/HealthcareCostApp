// middleware.ts
import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { userId } = await getAuth(req);
  
  // Allow access to public routes
  if (req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/api/public")) {
    return NextResponse.next();
  }

  // Redirect to sign-in if not authenticated
  if (!userId) {
    const signInUrl = new URL('/sign-in', req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};