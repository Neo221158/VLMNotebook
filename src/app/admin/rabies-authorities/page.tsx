import { requireAdmin } from "@/lib/auth-helpers";
import { RabiesAuthoritiesManager } from "@/components/admin/rabies-authorities-manager";

export default async function RabiesAuthoritiesPage() {
  await requireAdmin();
  return <RabiesAuthoritiesManager />;
}
