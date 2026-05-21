"use client";

import { useState } from "react";
import { AddTicketForm } from "@/components/admin/forms/AddTicketForm";

type Props = {
  technicians: any[];
};

export default function AddTicketButton({ technicians }: Props) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalIsOpen(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Nouveau ticket
      </button>

      {modalIsOpen && (
        <AddTicketForm
          technicians={technicians}
          onClose={() => setModalIsOpen(false)}
        />
      )}
    </>
  );
}
