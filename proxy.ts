import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import User from './lib/models/User'
import dbConnect from './lib/mongodb'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    if (pathname.startsWith('/login')) {
        return NextResponse.next()
    }

    if (pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')) {
        return NextResponse.next()
    }

    const code = request.cookies.get('code')?.value;
    await dbConnect();
    const codeValid = await User.findById(code);

    if (!codeValid) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}