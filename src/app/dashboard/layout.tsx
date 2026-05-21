import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import LogoutButton from "@/components/LogOutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-64 border-r bg-gray-100 p-4 flex flex-col justify-between">
        <div>
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
        </div>

        <div className="flex flex-col border-t pt-4">
          <p className="px-3 text-sm font-semibold text-gray-700 truncate">
            {session.user?.name}
          </p>

          <p className="px-3 mb-3 text-xs text-gray-500 truncate">
            {session.user?.email}
          </p>

          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
