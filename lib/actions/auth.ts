"use server";

import { signIn, signOut } from "@/auth";
import { db, schema } from "@/lib/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";
import { AuthError } from "next-auth";
import { v4 as uuidv4 } from "uuid";
import { addHours } from "date-fns";
import { sendEmail } from "../email/service";

/**
 * Server Action: Register a new user
 */
export async function registerUser(data: RegisterInput) {
  try {
    // Validate input
    const validatedData = registerSchema.parse(data);

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, validatedData.email))
      .limit(1);

    if (existingUser.length > 0) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    // Get the USER role ID
    const [userRole] = await db
      .select()
      .from(schema.roles)
      .where(eq(schema.roles.name, "USER"))
      .limit(1);

    if (!userRole) {
      return {
        success: false,
        error: "User role not found. Please contact administrator.",
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const [newUser] = await db
      .insert(schema.users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
        passwordHash,
        roleId: userRole.id,
        isActive: true,
      })
      .returning();

    if (!newUser) {
      return {
        success: false,
        error: "Failed to create user",
      };
    }

    return {
      success: true,
      message: "Account created successfully. Please login.",
    };
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Server Action: Login user
 */
export async function loginUser(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Get user role for client-side redirect
    const user = await db
      .select({
        roleName: schema.roles.name,
      })
      .from(schema.users)
      .innerJoin(schema.roles, eq(schema.users.roleId, schema.roles.id))
      .where(eq(schema.users.email, email))
      .limit(1)
      .then((res) => res[0]);

    return {
      success: true,
      message: "Logged in successfully",
      role: user?.roleName,
    };
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "Invalid email or password",
          };
        default:
          return {
            success: false,
            error: "An error occurred during login",
          };
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Server Action: Logout user
 */
export async function logoutUser() {
  try {
    await signOut({ redirect: false });
    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: "Failed to logout",
    };
  }
}



/**
 * Server Action: Check if email exists
 */
export async function checkEmailExists(email: string) {
  try {
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    return {
      exists: existingUser.length > 0,
    };
  } catch (error) {
    console.error("Check email error:", error);
    return {
      exists: false,
      error: "Failed to check email",
    };
  }
}

/**
 * Server Action: Forgot Password
 */
export async function forgotPassword(email: string) {
  try {
    // Check if user exists
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);

    if (!user) {
      // Don't reveal if user exists
      return {
        success: true,
        message: "If an account with that email exists, we have sent a password reset link.",
      };
    }

    // Generate token
    const token = uuidv4();
    const expiresAt = addHours(new Date(), 1);

    // Save token to database
    // First, delete any existing tokens for this user
    await db
      .delete(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.userId, user.id));

    // Insert new token
    await db.insert(schema.passwordResetTokens).values({
      userId: user.id,
      token,
      expiresAt,
    });

    // Send email using Resend
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      templateName: "RESET_PASSWORD",
      dynamicData: {
        resetLink,
      },
    });

    return {
      success: true,
      message: "If an account with that email exists, we have sent a password reset link.",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    };
  }
}

/**
 * Server Action: Reset Password
 */
export async function resetPassword(token: string, password: string) {
  try {
    // 1. Verify token exists and is not expired
    const [storedToken] = await db
      .select()
      .from(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.token, token))
      .limit(1);

    if (!storedToken) {
      return {
        success: false,
        error: "Invalid or expired reset token",
      };
    }

    if (new Date() > storedToken.expiresAt) {
      // Clean up expired token
      await db
        .delete(schema.passwordResetTokens)
        .where(eq(schema.passwordResetTokens.token, token));

      return {
        success: false,
        error: "Reset token has expired",
      };
    }

    // 2. Update user password
    const passwordHash = await bcrypt.hash(password, 12);

    await db
      .update(schema.users)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, storedToken.userId));

    // 3. Delete used token
    await db
      .delete(schema.passwordResetTokens)
      .where(eq(schema.passwordResetTokens.token, token));

    return {
      success: true,
      message: "Password reset successfully. You can now login with your new password.",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: "Failed to reset password",
    };
  }
}
