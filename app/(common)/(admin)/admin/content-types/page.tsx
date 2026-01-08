import { ContentTypesCard } from "@/components/admin/ContentTypesCard";
import { requireAdmin } from "@/lib/auth/helpers";

export default async function ContentTypesPage() {
    await requireAdmin();

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-foreground">Content Types</h1>
                <p className="text-muted-foreground">
                    Manage global content types available for all courses.
                </p>
            </div>

            <ContentTypesCard />
        </div>
    );
}
