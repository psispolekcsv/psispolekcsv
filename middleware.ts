import { NextResponse, type NextRequest } from "next/server";

const openPaths = new Set([
  "/sprava/prihlaseni",
  "/sprava/registrace",
  "/sprava/zapomenute-heslo",
  "/sprava/ceka-na-schvaleni",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/sprava") || openPaths.has(pathname)) return NextResponse.next();
  if (!request.cookies.get("session")?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/sprava/prihlaseni";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/sprava/:path*"],
};
