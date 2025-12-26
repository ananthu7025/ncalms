import auth from "@/auth";
import Link from "next/link";
import {
  LayoutDashboard,
  BookOpen,
  Library,
  User,
  Settings,
  BarChart3,
  Mail,
  MessageSquare,
  GraduationCap,
  CreditCard,
  Users,
  Video,
  Tag,
  ShoppingCart,
} from "lucide-react";

// Navigation Arrays
const learnerNavItems = [
  { title: "Dashboard", href: "/learner/dashboard", icon: LayoutDashboard },
  { title: "All Courses", href: "/learner/courses", icon: BookOpen },
  { title: "My Library", href: "/learner/library", icon: Library },
  { title: "Shopping Cart", href: "/learner/cart", icon: ShoppingCart },
  { title: "Book Session", href: "/learner/book-session", icon: Video },
  { title: "Support", href: "/learner/support", icon: MessageSquare },
  { title: "Profile", href: "/learner/profile", icon: User },
  { title: "Settings", href: "/learner/settings", icon: Settings },
];

const adminNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { title: "All Courses", href: "/admin/courses", icon: BookOpen },
  { title: "Offers", href: "/admin/offers", icon: Tag },
  { title: "Sessions", href: "/admin/sessions", icon: Video },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Email Templates", href: "/admin/email-templates", icon: Mail },
  { title: "Support Inbox", href: "/admin/support", icon: MessageSquare },
];

import { SidebarNavItem } from "./nav-item";
import { UserFooter } from "./user-footer";

export async function AppSidebarUI() {
  const session = await auth();
  const userRole = session?.user?.role;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300 flex flex-col w-64">
      <div className="flex items-center justify-between p-4 h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">NCA</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
        {userRole === "USER" && (
          <>
            <p className="px-3 text-xs font-semibold text-sidebar-muted uppercase tracking-wider mb-2">
              Learning
            </p>
            {learnerNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                title={item.title}
                icon={<item.icon className="w-5 h-5" />}
              />
            ))}
          </>
        )}

        {userRole === "ADMIN" && (
          <>
            <p className="px-3 text-xs font-semibold text-sidebar-muted uppercase tracking-wider mb-2">
              Administration
            </p>
            {adminNavItems.map((item) => (
              <SidebarNavItem
                key={item.href}
                href={item.href}
                title={item.title}
                icon={<item.icon className="w-5 h-5" />}
              />
            ))}
          </>
        )}
      </nav>

      {/* Dynamic User Footer */}
      <UserFooter
        user={{
          name: session?.user?.name,
          email: session?.user?.email,
          image: session?.user?.image,
          role: session?.user?.role,
        }}
      />
    </aside>
  );
}
