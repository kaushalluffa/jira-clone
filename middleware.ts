import { authkitMiddleware } from "@workos-inc/authkit-nextjs";

// In middleware auth mode, each page is protected by default.
// Exceptions are configured via the `unauthenticatedPaths` option.
export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: [
      "/", // Landing page
      "/api/auth/login", // Auth login endpoint
      "/api/auth/signup", // Auth signup endpoint
      "/api/auth/callback", // Auth callback endpoint
    ],
  },
});

// Match against pages that require authentication - all [orgId] routes are protected
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Apply to all routes except static files
  ],
};
