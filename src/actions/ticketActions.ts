"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../../lib/prisma";
import { TicketCategory, TicketPriority } from "@prisma/client";

export async function createTicket(previous: any, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const client = formData.get("client") as string;

  const priority = formData.get("priority") as TicketPriority;
  const category = formData.get("category") as TicketCategory;

  try {
    const newTicket = await prisma.ticket.create({
      data: {
        title: title,
        description: description,
        client: client,
        priority: priority,
        category: category,
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

  const technicianId = formData.get("technicianId") as string;

  try {
    const updatedTicket = await prisma.ticket.update({
      where: { id: ticketId },
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
    return { success: true, updatedTicket };
  } catch (error) {
    console.error("Erreur lors de la modification :", error);
    return { success: false, error: "Impossible de modifier le ticket." };
  }
}
