"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="mt-auto rounded px-3 py-2 text-left text-red-600 hover:bg-red-50 font-medium"
    >
      Se déconnecter
    </button>
  );
}
