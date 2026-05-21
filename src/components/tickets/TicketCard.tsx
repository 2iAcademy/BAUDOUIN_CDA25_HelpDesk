"use client";

import Link from "next/link";
import { useState } from "react";

export default function TicketCard({ ticket }: { ticket: any }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="absolute top-5 right-5 z-10 flex gap-3 text-sm">
        <button
          onClick={(e) => {
            e.preventDefault();
            setModalIsOpen(true);
          }}
          className="text-gray-500 hover:text-black"
        >
          Modifier
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer
        </button>
      </div>

      <Link href={`/dashboard/tickets/${ticket.id}`} className="block">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pr-28">
          <div>
            <h2 className="text-lg font-semibold">{ticket.label}</h2>

            <p className="mt-1 text-sm text-gray-500">{ticket.client}</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500">Priorité :</span> {ticket.priority}
          </div>

          <div>
            <span className="text-gray-500">Statut :</span> {ticket.status}
          </div>

          <div>
            <span className="text-gray-500">Technicien :</span>{" "}
            {ticket.technician
              ? `${ticket.technician.firstName} ${ticket.technician.name}`
              : "Non affecté"}
          </div>
        </div>
      </Link>

      {modalIsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <h2 className="text-xl font-semibold">Modifier le ticket</h2>

            <button
              onClick={() => setModalIsOpen(false)}
              className="mt-6 rounded border px-4 py-2"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
