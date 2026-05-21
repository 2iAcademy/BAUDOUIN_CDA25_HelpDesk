"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { TicketCategory, TicketPriority, TicketStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createTicket(previous: any, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return {
      success: false,
      error:
        "Accès refusé. Seuls les administrateurs peuvent créer des tickets.",
    };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const client = formData.get("client") as string;

  const priority = formData.get("priority") as TicketPriority;
  const category = formData.get("category") as TicketCategory;

  const technicianId = formData.get("technicianId") as string;

  if (!title || !description || !client || !priority || !category) {
    return {
      success: false,
      error: "Tous les champs obligatoires doivent être remplis.",
    };
  }

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title: title,
        description: description,
        client: client,
        priority: priority,
        category: category,
        technicianId: technicianId || null,
      },
    });
    revalidatePath("/dashboard/tickets", "page");
    return { success: true, newTicket };
  } catch (error) {
    console.error("Erreur lors de la création :", error);
    return { success: false, error: "Impossible de créer le ticket." };
  }
}

export async function updateTicket(previous: any, formData: FormData) {
  const ticketId = formData.get("ticketId") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const client = formData.get("client") as string;

  const priority = formData.get("priority") as TicketPriority;
  const category = formData.get("category") as TicketCategory;

  const status = formData.get("status") as TicketStatus;

  const technicianId = formData.get("technicianId") as string;

  const currentTicket = await prisma.ticket.findUnique({
    where: { id: ticketId },
  });

  if (
    status === "IN_PROGRESS" &&
    (!technicianId || technicianId.trim() === "")
  ) {
    return {
      success: false,
      error: "Un ticket ne peut pas passer 'En cours' sans technicien affecté.",
    };
  }

  if (!currentTicket) {
    return { success: false, error: "Ticket introuvable." };
  }

  if (currentTicket.status === "CLOSED") {
    return {
      success: false,
      error: "Ce ticket est clôturé. Il ne peut plus être modifié.",
    };
  }

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        title: title,
        description: description,
        client: client,
        priority: priority,
        category: category,
        status: status,
        technicianId: technicianId || null,
      },
    });
    revalidatePath("/dashboard/tickets", "page");
    return { success: true, updatedTicket };
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    return { success: false, error: "Impossible de modifier le ticket." };
  }
}
