import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      id: string;
      token: string;
      role: "admin" | "user" | "manager" | "associate";
      status: string;
      email: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: "admin" | "user" | "manager" | "associate";
    token: string;
    status: string;
    email: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    role: "admin" | "manager" | "associate" | "user";
    token: string;
    status: string;
    email: string;
  }
}
