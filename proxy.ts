import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Public routes - keine Auth benötigt
    if (pathname.startsWith('/login') || 
        pathname.startsWith('/api/auth') || // better-auth routes
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')) {
        return NextResponse.next()
    }

    // Better-auth Session check
    const session = await auth.api.getSession({
        headers: request.headers
    })

    if (!session?.user) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}