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

export const learnerNavItems = [
    { title: "Dashboard", href: "/learner/dashboard", icon: LayoutDashboard },
    { title: "All Courses", href: "/learner/courses", icon: BookOpen },
    { title: "My Library", href: "/learner/library", icon: Library },
    { title: "Shopping Cart", href: "/learner/cart", icon: ShoppingCart },
    { title: "Book Session", href: "/learner/book-session", icon: Video },
    { title: "Support", href: "/learner/support", icon: MessageSquare },
    { title: "Profile", href: "/learner/profile", icon: User },
    { title: "Settings", href: "/learner/settings", icon: Settings },
];

export const adminNavItems = [
    { title: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
    { title: "All Courses", href: "/admin/courses", icon: BookOpen },
    { title: "Offers", href: "/admin/offers", icon: Tag },
    { title: "Sessions", href: "/admin/sessions", icon: Video },
    { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
    { title: "Users", href: "/admin/users", icon: Users },
    { title: "Email Templates", href: "/admin/email-templates", icon: Mail },
    { title: "Support Inbox", href: "/admin/support", icon: MessageSquare },
];
