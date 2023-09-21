// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextRequest, NextResponse } from "next/server";

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         */
        '/((?!api).*)',
    ],
}

export function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const adminToken = req.cookies.get('adminToken');
    const token = req.cookies.get('token');
    const NEXT_PUBLIC_WEB_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.NEXT_PUBLIC_WEB_URL

    if (path.startsWith('/dashboard') && !adminToken) {
        return NextResponse.redirect(new URL(`/auth/login?redirectUrl=${path}`, NEXT_PUBLIC_WEB_URL));
    }

    if (path.startsWith('/collections') && !token) {
        return NextResponse.redirect(new URL('/', NEXT_PUBLIC_WEB_URL));
    }

    return NextResponse.next();
}