/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/healthcheck",
  "/privacy",
  "/terms",
  "/",
  "/sign-in",
  "/dashboard",
  "/products",
  "/sales",
  "/alerts",
  "/categories",
  "/customers",
  "/reports",
  "/settings",
  "/stock",
  "/brands",
];

/**
 * An array of routes that are accessible to the authentication
 * These routes do not require authentication
 * @type {string[]}
 */
export const authRoutes = ["/sign-in","/sign-up"];

/**
 * Password reset routes prefix
 * @type {string}
 */
export const RESET_PASSWORD_ROUTE_PREFIX = "/reset-password";

/**
 * Password reset routes prefix
 * @type {string}
 */
export const AUTH_APIS_ROUTE_PREFIX = "/api/auth";
