import { ContentLayout } from "@/layouts/content-layout";
import { ReactNode } from "react";

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <ContentLayout title="Analytics">{children}</ContentLayout>;
}
