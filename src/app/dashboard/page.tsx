import { prisma } from "@/../lib/prisma";
import { priorityLabels, statusLabels } from "@/utils/labels";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/dashboard/tickets");
  }

  const tickets = await prisma.ticket.findMany({
    include: {
      technician: true,
    },
  });

  // Statuts
  const openTickets = tickets.filter((ticket) => ticket.status === "OPEN");

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS",
  );

  const pendingTickets = tickets.filter(
    (ticket) => ticket.status === "PENDING",
  );

  const resolvedTickets = tickets.filter(
    (ticket) => ticket.status === "RESOLVED",
  );

  const closedTickets = tickets.filter((ticket) => ticket.status === "CLOSED");

  // Priorités
  const lowPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "LOW",
  );

  const mediumPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "MEDIUM",
  );

  const highPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "HIGH",
  );

  const criticalPriorityTickets = tickets.filter(
    (ticket) => ticket.priority === "CRITICAL",
  );

  // Tickets en retard
  const lateTickets = tickets.filter((ticket) => {
    const hours = (Date.now() - ticket.createdAt.getTime()) / 1000 / 60 / 60; //Pour convertir les millisecondes du timestamp en heures

    return (
      (ticket.status === "OPEN" || ticket.status === "IN_PROGRESS") &&
      hours > 48
    );
  });

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Total tickets</p>

          <p className="text-2xl font-bold">{tickets.length}</p>
        </div>

        <div className="rounded border p-4">
          <p className="text-sm text-gray-500">Tickets en retard</p>

          <p className="text-2xl font-bold">{lateTickets.length}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="mb-4 font-semibold">Tickets par statut</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{statusLabels.OPEN}</span>
              <strong>{openTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{statusLabels.IN_PROGRESS}</span>
              <strong>{inProgressTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{statusLabels.PENDING}</span>
              <strong>{pendingTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{statusLabels.RESOLVED}</span>
              <strong>{resolvedTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{statusLabels.CLOSED}</span>
              <strong>{closedTickets.length}</strong>
            </div>
          </div>
        </div>

        <div className="rounded border p-4">
          <h2 className="mb-4 font-semibold">Tickets par priorité</h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>{priorityLabels.LOW}</span>
              <strong>{lowPriorityTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{priorityLabels.MEDIUM}</span>
              <strong>{mediumPriorityTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{priorityLabels.HIGH}</span>
              <strong>{highPriorityTickets.length}</strong>
            </div>

            <div className="flex justify-between">
              <span>{priorityLabels.CRITICAL}</span>
              <strong>{criticalPriorityTickets.length}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded border p-4">
        <h2 className="mb-4 font-semibold">Tickets en retard</h2>

        {lateTickets.length === 0 ? (
          <p className="text-sm text-gray-500">Aucun ticket en retard.</p>
        ) : (
          <div className="space-y-2">
            {lateTickets.map((ticket) => (
              <div key={ticket.id} className="border-b py-2">
                <p className="font-medium">{ticket.title}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
