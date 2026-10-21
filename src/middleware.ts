import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes require admin role
    if (path.startsWith('/admin')) {
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        // Protected routes require valid login token
        if (
          path.startsWith('/admin') ||
          path.startsWith('/watchlist') ||
          path.startsWith('/favorites') ||
          path.startsWith('/profile') ||
          path.startsWith('/recommendations')
        ) {
          return !!token;
        }
        return true;
      },
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Only intercept genuinely protected routes so public browsing and public movie APIs are never blocked
export const config = {
  matcher: [
    '/admin/:path*',
    '/watchlist/:path*',
    '/favorites/:path*',
    '/profile/:path*',
    '/recommendations/:path*',
  ],
};
