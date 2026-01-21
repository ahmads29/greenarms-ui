import { PageHeader } from "@/app/components/PageHeader";
import { Card, CardContent } from "@/app/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <Card>
        <CardContent className="pt-12 pb-12 text-center">
          <Construction className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Coming Soon</p>
          <p className="text-sm text-gray-500 mt-1">This page is under construction</p>
        </CardContent>
      </Card>
    </div>
  );
}
