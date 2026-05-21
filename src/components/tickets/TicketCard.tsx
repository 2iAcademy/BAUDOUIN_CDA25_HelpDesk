"use client";

import Link from "next/link";
import { useState } from "react";
import { UpdateTicketForm } from "@/components/admin/forms/UpdateTicketForm";
import { deleteTicket } from "@/actions/ticketActions";
import { toast } from "react-toastify";

import { priorityLabels, priorityColors, statusLabels } from "@/utils/labels";

type Props = {
  ticket: any;
  technicians: any[];
  currentUser: any;
};

export default function TicketCard({
  ticket,
  technicians,
  currentUser,
}: Props) {
  const isAdmin = currentUser?.role === "ADMIN";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmation de sécurité
  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce ticket ?")) return;

    setIsDeleting(true);
    try {
      const res = await deleteTicket(ticket.id);

      if (res.success) {
        toast.success("Ticket supprimé avec succès");
      } else {
        toast.error("Impossible de supprimer le ticket.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Une erreur inattendue est survenue.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {isAdmin && (
        <div className="absolute top-5 right-5 z-10 flex gap-3 text-sm">
          <button
            onClick={(e) => {
              e.preventDefault();
              setModalIsOpen(true);
            }}
            disabled={isDeleting}
            className="text-gray-500 hover:text-black disabled:opacity-50"
          >
            Modifier
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      )}

      <Link href={`/dashboard/tickets/${ticket.id}`} className="block">
        <div className="flex items-start justify-between gap-4 pr-28">
          <div>
            <h2 className="text-lg font-semibold">{ticket.title}</h2>

            <p className="mt-1 text-sm text-gray-500">{ticket.client}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm">
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              priorityColors[ticket.priority as keyof typeof priorityColors]
            }`}
          >
            {priorityLabels[ticket.priority as keyof typeof priorityLabels]}
          </span>

          <span className="text-gray-600">
            {statusLabels[ticket.status as keyof typeof statusLabels]}
          </span>

          <span className="text-gray-600">
            {ticket.technician
              ? `${ticket.technician.firstName} ${ticket.technician.name}`
              : "Non affecté"}
          </span>
        </div>
      </Link>

      {modalIsOpen && (
        <UpdateTicketForm
          ticket={ticket}
          technicians={technicians}
          onClose={() => setModalIsOpen(false)}
        />
      )}
    </div>
  );
}
