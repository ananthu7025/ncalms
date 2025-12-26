import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserActionsDropdown } from "./user-actions-dropdown";
import type { UserWithStats } from "@/lib/actions/users";
import { formatDistanceToNow } from "date-fns";

interface UsersTableProps {
  users: UserWithStats[];
}

export function UsersTable({ users }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <p className="text-muted-foreground">No users found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Role
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Courses
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Total Spent
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Last Activity
                </th>
                <th className="text-left p-4 font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        user.role.name === "admin" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {user.role.name}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={user.isActive ? "default" : "secondary"}
                      className={
                        user.isActive
                          ? "bg-green-500/10 text-green-700 hover:bg-green-500/20"
                          : ""
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="font-medium">{user.coursesEnrolled}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-semibold">
                      ${parseFloat(user.totalSpent).toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {user.lastPurchaseDate
                        ? formatDistanceToNow(new Date(user.lastPurchaseDate), {
                            addSuffix: true,
                          })
                        : "Never"}
                    </span>
                  </td>
                  <td className="p-4">
                    <UserActionsDropdown
                      userId={user.id}
                      userName={user.name}
                      userEmail={user.email}
                      isActive={user.isActive}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
