import { describe, it, expect, vi, beforeEach } from "vitest";
import { createTicket, updateTicket } from "@/actions/ticketActions";
import { prisma } from "../lib/prisma";
import { getServerSession } from "next-auth";

//Mock de prisma
vi.mock("../lib/prisma", () => {
  return {
    prisma: {
      ticket: {
        create: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    },
  };
});

vi.mock("next-auth", () => {
  return {
    default: vi.fn(() => vi.fn()),
    getServerSession: vi.fn(),
  };
});

describe("Tests Unitaires - Sécurité des Rôles", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Nettoyage entre les tests
  });

  it("ticket_creation_should_not_be_allowed_to_non_admin_users", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { role: "TECHNICIAN" },
    } as any);

    const formData = new FormData();
    formData.append("title", "Ticket Test Sécurité");
    formData.append("description", "Vérification des droits d'accès");
    formData.append("client", "Client Test");
    formData.append("priority", "MEDIUM");
    formData.append("category", "SOFTWARE");

    const result = await createTicket(null, formData);

    expect(result.success).toBe(false);

    expect(result.error).toContain(
      "Seuls les administrateurs peuvent créer des tickets.",
    );

    expect(prisma.ticket.create).not.toHaveBeenCalled();
  });

  it("ticket_cant_be_updated_to_in_progress_status_if_not_assigned_to_technician", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { role: "ADMIN" },
    } as any);
    vi.mocked(prisma.ticket.findUnique).mockResolvedValue({
      status: "OPEN",
    } as any);

    const formData = new FormData();
    formData.append("ticketId", "uuid-test");
    formData.append("status", "IN_PROGRESS");
    formData.append("technicianId", "");

    const result = await updateTicket(null, formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain("technicien affecté");
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });

  it("update_shouldnt_be_allowed_if_ticket_status_is_closed", async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { role: "ADMIN" },
    } as any);

    vi.mocked(prisma.ticket.findUnique).mockResolvedValue({
      id: "uuid-test",
      status: "CLOSED",
    } as any);

    const formData = new FormData();
    formData.append("ticketId", "uuid-test");
    formData.append("title", "Nouveau titre");

    const result = await updateTicket(null, formData);

    // Vérifications
    expect(result.success).toBe(false);
    expect(result.error).toContain("clôturé. Il ne peut plus être modifié");
    expect(prisma.ticket.update).not.toHaveBeenCalled();
  });
});
