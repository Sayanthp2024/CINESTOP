import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Isolate the admin: Only users with the 'admin' role can access the /admin route
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Requires the user to be logged in for all matched routes
    },
    pages: {
      signIn: '/login', // Redirect unauthenticated users to our custom login page
    },
  }
);

// Protect all routes except login, register, public files, and api auth routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - login
     * - register
     * - api/auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!login|register|api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
