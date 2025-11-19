import { requireAdmin } from "@/lib/auth-helpers";
import { ImportRabiesClient } from "@/components/admin/import-rabies-client";

/**
 * Admin-only page for importing rabies authority data from PDF
 */
export default async function ImportRabiesPage() {
  await requireAdmin();

  return <ImportRabiesClient />;
}
