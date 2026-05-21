"use client";

import { Modal } from "@/components/admin/Modal";
import { useActionState, useEffect } from "react";
import { createTicket } from "@/actions/ticketActions";
import { toast } from "react-toastify";

type Props = {
  onClose: () => void;
  technicians: any[];
};

export function AddTicketForm({ onClose, technicians }: Props) {
  const [state, action, pending] = useActionState(createTicket, null);

  useEffect(() => {
    if (state !== null) {
      if (state.success) {
        toast.success("Ticket créé");
        onClose();
      }

      if (!state.success) {
        toast.error(state.error ?? "Impossible de créer le ticket.");
      }
    }
  }, [state, onClose]);
  return (
    <Modal onClose={onClose}>
      <form action={action} className="space-y-4">
        <h2 className="text-xl font-semibold">Créer un ticket</h2>

        <div>
          <label className="block text-sm font-medium">Titre</label>
          <input
            name="title"
            required
            placeholder="Titre du ticket"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            name="description"
            required
            placeholder="Description du problème"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Client</label>
          <input
            name="client"
            required
            placeholder="Nom du client"
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Priorité</label>
          <select
            name="priority"
            required
            defaultValue="MEDIUM"
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
            defaultValue=""
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="" disabled>
              Choisir une catégorie
            </option>
            <option value="NETWORK">Réseau</option>
            <option value="HARDWARE">Matériel</option>
            <option value="SOFTWARE">Logiciel</option>
            <option value="SECURITY">Sécurité</option>
            <option value="OTHER">Autre</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Technicien</label>

          <select
            name="technicianId"
            className="mt-1 w-full rounded border px-3 py-2"
            defaultValue=""
          >
            <option value="">Non affecté</option>

            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.firstName} {technician.name}
              </option>
            ))}
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
            {pending ? "Création..." : "Créer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
