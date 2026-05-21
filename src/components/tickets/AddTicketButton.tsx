"use client";

import { useState } from "react";
import { AddTicketForm } from "@/components/admin/forms/AddTicketForm";

export default function AddTicketButton() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalIsOpen(true)}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Nouveau ticket
      </button>

      {modalIsOpen && <AddTicketForm onClose={() => setModalIsOpen(false)} />}
    </>
  );
}
