import { Card, CardContent } from "@/components/ui/card";
import { Video, FileText, HelpCircle } from "lucide-react";

interface ContentType {
  id: string;
  name: string;
}

interface Content {
  content: {
    id: string;
    title: string;
    price: string;
    duration: number | null;
    isActive: boolean;
  };
  contentType: {
    id: string;
    name: string;
  } | null;
}

interface ContentStatsProps {
  contentTypes: ContentType[];
  contents: Content[];
}

const getContentIcon = (contentTypeName: string) => {
  if (contentTypeName?.toLowerCase().includes("video")) return Video;
  if (contentTypeName?.toLowerCase().includes("pdf")) return FileText;
  return HelpCircle;
};

export function ContentStats({ contentTypes, contents }: ContentStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {contentTypes.map((ct) => {
        const Icon = getContentIcon(ct.name);
        const count = contents.filter(
          (c) => c.contentType?.id === ct.id
        ).length;
        return (
          <Card key={ct.id}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-sm text-muted-foreground">{ct.name}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
