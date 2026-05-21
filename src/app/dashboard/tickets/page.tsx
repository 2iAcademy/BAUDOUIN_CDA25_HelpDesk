import { prisma } from "@/../lib/prisma";
import TicketCard from "@/components/tickets/TicketCard";
import AddTicketButton from "@/components/tickets/AddTicketButton";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function TicketsList() {
  const session = await getServerSession(authOptions);

  const isAdmin = session?.user?.role === "ADMIN";

  const tickets = await prisma.ticket.findMany({
    include: {
      technician: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const technicians = await prisma.user.findMany({
    where: {
      role: "TECHNICIAN",
    },
  });

  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tickets</h1>

        {isAdmin && <AddTicketButton technicians={technicians} />}
      </div>
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            technicians={technicians}
            currentUser={session?.user}
          />
        ))}
      </div>
    </section>
  );
}
