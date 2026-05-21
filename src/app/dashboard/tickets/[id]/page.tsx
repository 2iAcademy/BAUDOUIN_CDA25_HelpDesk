import { prisma } from "@/../lib/prisma";
import { notFound } from "next/navigation";

export default async function TicketDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      technician: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!ticket) {
    notFound();
  }

  return (
    <section>
      <h1 className="mb-2 text-2xl font-bold">{ticket.title}</h1>

      <p className="mb-6 text-gray-600">{ticket.description}</p>

      <div className="mb-8 space-y-2 rounded-xl border p-4">
        <p>Client : {ticket.client}</p>
        <p>Priorité : {ticket.priority}</p>
        <p>Statut : {ticket.status}</p>
        <p>
          Technicien :{" "}
          {ticket.technician
            ? `${ticket.technician.firstName} ${ticket.technician.name}`
            : "Non affecté"}
        </p>
        <p>Créé le : {ticket.createdAt.toLocaleDateString("fr-FR")}</p>
      </div>

      <h2 className="mb-4 text-xl font-semibold">Commentaires</h2>

      <div className="space-y-3">
        {ticket.comments.length === 0 && (
          <p className="text-gray-500">Aucun commentaire.</p>
        )}

        {ticket.comments.map((comment) => (
          <div key={comment.id} className="rounded border p-3">
            <p>{comment.description}</p>

            <p className="mt-2 text-sm text-gray-500">
              {comment.user.firstName} {comment.user.name} —{" "}
              {comment.createdAt.toLocaleDateString("fr-FR")}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
