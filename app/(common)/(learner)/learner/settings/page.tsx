import { redirect } from "next/navigation";
import auth from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { SettingsContent } from "@/components/settings/settings-content";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function Settings() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const userEmail = session.user.email;

  // Get user from database - try by ID first, then by email
  let user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Fallback: try finding by email if ID doesn't match
  if (!user && userEmail) {
    user = await db.query.users.findFirst({
      where: eq(users.email, userEmail),
      columns: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-lg font-medium">Unable to load user data</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please log out and log back in to refresh your session.
            </p>
            <Link href="/learner/dashboard" className="mt-4 inline-block">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <SettingsContent user={user} />;
}
