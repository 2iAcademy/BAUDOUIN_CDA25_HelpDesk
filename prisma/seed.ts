import { PrismaClient } from "./generated/prisma/client";
import {
  UserRole,
  TicketPriority,
  TicketCategory,
  TicketStatus,
} from "./generated/prisma/enums";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // nettoyage
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  // mot de passe hashé
  const password = await bcrypt.hash("test_mdp", 10);

  // admins
  const admin1 = await prisma.user.create({
    data: {
      email: "admin1@test.com",
      hashedPassword: password,
      firstName: "Emeline",
      name: "Baudouin",
      role: UserRole.ADMIN,
    },
  });

  const admin2 = await prisma.user.create({
    data: {
      email: "admin2@test.com",
      hashedPassword: password,
      firstName: "Maxime",
      name: "Beaujard",
      role: UserRole.ADMIN,
    },
  });

  // techniciens
  const tech1 = await prisma.user.create({
    data: {
      email: "tech1@test.com",
      hashedPassword: password,
      firstName: "Samuel",
      name: "Masqué",
      role: UserRole.TECHNICIAN,
    },
  });

  const tech2 = await prisma.user.create({
    data: {
      email: "tech2@test.com",
      hashedPassword: password,
      firstName: "Florine",
      name: "Bonnin",
      role: UserRole.TECHNICIAN,
    },
  });

  const tech3 = await prisma.user.create({
    data: {
      email: "tech3@test.com",
      hashedPassword: password,
      firstName: "Léo",
      name: "Legoat",
      role: UserRole.TECHNICIAN,
    },
  });

  // tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: "Erreur 500",
      description: "La page d'accueil ne charge pas.",
      client: "Dubois&Fils",
      priority: TicketPriority.HIGH,
      category: TicketCategory.NETWORK,
      status: TicketStatus.OPEN,
      technicianId: tech1.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: "PC bloqué",
      description: "Le poste ne démarre plus.",
      client: "Suivi de Flotte",
      priority: TicketPriority.CRITICAL,
      category: TicketCategory.HARDWARE,
      status: TicketStatus.IN_PROGRESS,
      technicianId: tech2.id,
    },
  });

  // commentaires
  await prisma.comment.create({
    data: {
      description: "Diagnostic en cours.",
      ticketId: ticket1.id,
      userId: tech1.id,
    },
  });

  await prisma.comment.create({
    data: {
      description: "Pièce commandée.",
      ticketId: ticket2.id,
      userId: tech2.id,
    },
  });

  console.log("Seed terminé");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
