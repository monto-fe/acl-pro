import createMiddleware from 'next-intl/middleware';
import { locales, pathnames, localePrefix, defaultLocale } from './navigation';
import { NextRequest } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}

export default createMiddleware({
  defaultLocale,
  localePrefix,
  pathnames,
  locales,
});
