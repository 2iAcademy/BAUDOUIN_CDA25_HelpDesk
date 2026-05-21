"use client";

import { Modal } from "@/components/admin/Modal";
import { useActionState, useEffect, useState } from "react";
import { updateTicket } from "@/actions/ticketActions";
import { toast } from "react-toastify";

type Props = {
  onClose: () => void;
  ticket: any;
  technicians: any[];
};

export function UpdateTicketForm({ onClose, ticket, technicians }: Props) {
  const [state, action, pending] = useActionState(updateTicket, null);

  const [selectedStatus, setSelectedStatus] = useState(ticket.status ?? "OPEN");
  const [selectedTechnician, setSelectedTechnician] = useState(
    ticket.technicianId ?? "",
  );

  useEffect(() => {
    if (state !== null) {
      if (state.success) {
        toast.success("Ticket mis à jour");
        onClose();
      }

      if (!state.success) {
        toast.error(state.error ?? "Impossible de mettre à jour le ticket.");
      }
    }
  }, [state, onClose]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (selectedStatus === "IN_PROGRESS" && !selectedTechnician) {
      e.preventDefault(); // Bloque l'envoi du formulaire
      toast.error(
        "Veuillez affecter un technicien pour passer le ticket 'En cours'.",
      );
    }
  };

  return (
    <Modal onClose={onClose}>
      <form action={action} onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Modifier le ticket</h2>

        <input type="hidden" name="ticketId" value={ticket.id} />

        <div>
          <label className="block text-sm font-medium">Titre</label>

          <input
            name="title"
            required
            defaultValue={ticket.title}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>

          <textarea
            name="description"
            required
            defaultValue={ticket.description}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Client</label>

          <input
            name="client"
            required
            defaultValue={ticket.client}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Priorité</label>

          <select
            name="priority"
            required
            defaultValue={ticket.priority}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="LOW">Basse</option>
            <option value="MEDIUM">Moyenne</option>
            <option value="HIGH">Haute</option>
            <option value="CRITICAL">Critique</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Catégorie</label>

          <select
            name="category"
            required
            defaultValue={ticket.category}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="NETWORK">Réseau</option>
            <option value="HARDWARE">Matériel</option>
            <option value="SOFTWARE">Logiciel</option>
            <option value="SECURITY">Sécurité</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Technicien{" "}
            {selectedStatus === "IN_PROGRESS" && (
              <span className="text-red-500">*</span>
            )}
          </label>
          <select
            name="technicianId"
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">Non affecté</option>
            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.firstName} {technician.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Statut</label>
          <select
            name="status"
            required
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="OPEN">Ouvert</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="PENDING">En attente</option>
            <option value="RESOLVED">Résolu</option>
            <option value="CLOSED">Fermé</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Annuler
          </button>

          <button
            type="submit"
            disabled={pending}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {pending ? "Modification..." : "Modifier"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
