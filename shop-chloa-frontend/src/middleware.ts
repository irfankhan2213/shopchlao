import { auth } from "./app/auth";
import {
  AUTH_APIS_ROUTE_PREFIX,
  authRoutes,
  publicRoutes,
  RESET_PASSWORD_ROUTE_PREFIX,
} from "./routes";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  
  const isAuthRoute =
    authRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith(RESET_PASSWORD_ROUTE_PREFIX);

  const isApiAuthRoute = nextUrl.pathname.startsWith(AUTH_APIS_ROUTE_PREFIX);

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);

  // Restrict access to /team-management route for users and associates
  // const restrictedRoutes = ["/team-management"];
  // const restrictedRoles = ["user", "associate"];

  // if (restrictedRoutes.includes(nextUrl.pathname)) {
  //   const role = req?.auth?.user?.role;
  //   if (role && restrictedRoles.includes(role)) {
  //     return NextResponse.redirect(new URL("/", nextUrl));
  //   }
  // }

  if (isApiAuthRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      if ((req?.auth?.user as any)?.profileCompleted === false) {
        // If they haven't completed their profile, stay on sign-up if they are already there
        if (nextUrl.pathname === "/sign-up") return;
        return NextResponse.redirect(new URL("/sign-up?step=2", nextUrl));
      }
      return NextResponse.redirect(new URL("/", nextUrl));
    } else if (nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/sign-in", nextUrl));
    }
    return;
  }

  if (isLoggedIn && (req?.auth?.user as any)?.profileCompleted === false) {
    return NextResponse.redirect(new URL("/sign-up?step=2", nextUrl));
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }

  return;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/(api|trpc)(.*)"],
};
