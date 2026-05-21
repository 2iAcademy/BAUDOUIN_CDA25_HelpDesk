import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-gray-100 p-4">
        <h2 className="mb-6 text-2xl font-bold">HelpDesk Pro</h2>

        <nav className="flex flex-col gap-2">
          <Link
            href="/dashboard"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Dashboard
          </Link>

          <Link
            href="/dashboard/tickets"
            className="rounded px-3 py-2 hover:bg-gray-200"
          >
            Tickets
          </Link>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
