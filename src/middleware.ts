import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  response.headers.set(
    'Content-Security-Policy',
    'default-src self; script-src self unsafe-inline unsafe-eval; connect-src self vitals.vercel-insights.com *.facebook.com *.google-analytics.com *.salesmartly.com wss://*.salesmartly.com; img-src self data: blob: https://*.cloudinary.com https://syjewelrydisplay.cn; style-src self unsafe-inline; font-src self data: https://syjewelrydisplay.cn; frame-src self;'
  );
  
  return response;
}

export const config = {
  matcher: "/:path*",
};
