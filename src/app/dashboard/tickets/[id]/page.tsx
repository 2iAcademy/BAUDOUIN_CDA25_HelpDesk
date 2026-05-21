import { prisma } from "@/../lib/prisma";
import { notFound } from "next/navigation";

import {
  priorityLabels,
  priorityColors,
  statusLabels,
  categoryLabels,
} from "@/utils/labels";

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

      <div className="mb-8 rounded-xl border p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              priorityColors[ticket.priority as keyof typeof priorityColors]
            }`}
          >
            {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
          </span>

          <span className="text-sm text-gray-600">
            {statusLabels[ticket.status as keyof typeof statusLabels]}
          </span>

          <span className="text-sm text-gray-600">
            {categoryLabels[ticket.category as keyof typeof categoryLabels]}
          </span>
        </div>

        <div className="mt-5 space-y-2 text-sm">
          <p>
            <span className="font-medium">Client :</span> {ticket.client}
          </p>

          <p>
            <span className="font-medium">Technicien :</span>{" "}
            {ticket.technician
              ? `${ticket.technician.firstName} ${ticket.technician.name}`
              : "Non affecté"}
          </p>

          <p>
            <span className="font-medium">Créé le :</span>{" "}
            {ticket.createdAt.toLocaleDateString("fr-FR")}
          </p>
        </div>
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
