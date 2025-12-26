import { DefaultSession } from "next-auth";
import "next-auth/jwt";

// Extend the built-in session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      roleId: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    roleId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    roleId: string;
  }
}
