import { Suspense } from "react";
import { getCurrentTenant } from "@/lib/tenant";
import LoginCard from "./LoginCard";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const tenant = await getCurrentTenant();
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <Suspense>
        <LoginCard tenantName={tenant.name} />
      </Suspense>
    </main>
  );
}
