import apiRoutes from "@/services/ApiServices/apiRoutes";
import Credentials from "next-auth/providers/credentials";
import { AuthError, type NextAuthConfig } from "next-auth";
import { type Session, type User } from "next-auth";
import { type JWT } from "next-auth/jwt";

export class CustomError extends AuthError {
  static type = "CredentialsSignin";

  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}
class InvalidLoginError extends AuthError {
  code = "custom";
  errorMessage: string;
  constructor(message?: any, errorOptions?: any) {
    super(message, errorOptions);
    this.errorMessage = message;
  }
}
export default {
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const apiServerUrl =
            process.env.NEXT_PUBLIC_APP_API_BASE_URL || "http://localhost:5000";

          const res = await fetch(`${apiServerUrl}/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: {
              "content-type": "application/json",
            },
          });

          if (res.ok) {
            const isJson = res.headers.get("content-type")?.includes("application/json");
            const result = isJson ? await res.json() : null;
            if (!result) return null;
            const user = result?.user;
            return {
              ...user,
              name: user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.email,
              role: "admin",
              token: result?.token,
            };
          } else {
            const isJson = res.headers.get("content-type")?.includes("application/json");
            if (isJson) {
              const error = await res.json();
              console.log("Auth error:", error);
              if (error.message) {
                throw new InvalidLoginError(error.message || "Invalid credentials");
              }
            } else {
               console.log("Auth error: Received non-JSON response:", res.status, res.statusText);
               throw new InvalidLoginError("Server returned an invalid response. Check backend URL.");
            }
            return null;
          }
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.role = user.role;
        token.token = user.token;
        token.email = user.email;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.role = token.role as "admin" | "user";
        session.user.token = token.token as string;
        session.user.email = token.email as string;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
