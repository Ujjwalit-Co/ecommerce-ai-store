import AdminShell from "./AdminShell";

// Admin routes rely on the client-only Sanity App SDK, so they are always
// rendered on demand instead of being statically prerendered at build time.
export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
