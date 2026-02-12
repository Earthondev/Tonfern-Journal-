import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if the route is an admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // Check for "journal_token" cookie
        const token = request.cookies.get('journal_token');

        if (!token) {
            // If no token, redirect to login
            const loginUrl = new URL('/login', request.url);
            // Optional: Add ?from=... to redirect back after login
            return NextResponse.redirect(loginUrl);
        }
    }

    // Continue if authorized or not an admin route
    return NextResponse.next();
}

// Config: Apply middleware only to admin routes
export const config = {
    matcher: '/admin/:path*',
};
