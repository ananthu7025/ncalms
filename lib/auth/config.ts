import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Validation schema for credentials
const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validatedCredentials = credentialsSchema.parse(credentials);

          // Find user by email
          const [user] = await db
            .select()
            .from(schema.users)
            .where(eq(schema.users.email, validatedCredentials.email))
            .limit(1);

          if (!user) {
            console.log("User not found");
            return null;
          }

          // Check if user is active
          if (!user.isActive) {
            console.log("User is inactive");
            return null;
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            validatedCredentials.password,
            user.passwordHash
          );

          if (!passwordMatch) {
            console.log("Invalid password");
            return null;
          }

          // Get role information
          const [role] = await db
            .select()
            .from(schema.roles)
            .where(eq(schema.roles.id, user.roleId))
            .limit(1);

          if (!role) {
            console.log("Role not found");
            return null;
          }

          // Return user object that will be stored in the JWT
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: role.name,
            roleId: user.roleId,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.roleId = user.roleId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.roleId = token.roleId as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
});
