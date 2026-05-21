import { prisma } from "@/../lib/prisma";
import TicketCard from "@/components/tickets/TicketCard";

export default async function TicketsList() {
  const tickets = await prisma.ticket.findMany({
    include: {
      technician: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <section>
      <h1 className="mb-6 text-2xl font-bold">Tickets</h1>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </section>
  );
}
