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
  // Nettoyage (Ordre respecté à cause des contraintes de clés étrangères)
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  // Mot de passe hashé commun pour les tests
  const password = await bcrypt.hash("test_mdp", 10);

  console.log("Création des utilisateurs...");
  // ADMINS
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

  // TECHNICIENS
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

  // TICKETS

  const t1 = await prisma.ticket.create({
    data: {
      title: "Panne réseau",
      description: "Plus aucun accès réseau au second étage.",
      client: "Dubois&Fils",
      priority: TicketPriority.HIGH,
      category: TicketCategory.NETWORK,
      status: TicketStatus.OPEN,
      technicianId: tech1.id,
    },
  });

  const t2 = await prisma.ticket.create({
    data: {
      title: "Serveur NAS inaccessible",
      description: "Le disque dur est raplapla.",
      client: "Suivi de Flotte",
      priority: TicketPriority.CRITICAL,
      category: TicketCategory.HARDWARE,
      status: TicketStatus.IN_PROGRESS,
      technicianId: tech2.id,
    },
  });

  const t3 = await prisma.ticket.create({
    data: {
      title: "Bug export",
      description:
        "L'export au format CSV crash depuis la dernière mise à jour.",
      client: "InnovCorp",
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.SOFTWARE,
      status: TicketStatus.PENDING,
      technicianId: tech3.id,
    },
  });

  const t4 = await prisma.ticket.create({
    data: {
      title: "Installation double écran",
      description: "Demande d'un second moniteur.",
      client: "Cabinet Médical Centre",
      priority: TicketPriority.LOW,
      category: TicketCategory.OTHER,
      status: TicketStatus.RESOLVED,
      technicianId: tech1.id,
    },
  });

  const t5 = await prisma.ticket.create({
    data: {
      title: "Tentative de Phishing",
      description: "Plusieurs collaborateurs ont reçu un email frauduleux.",
      client: "Dubois&Fils",
      priority: TicketPriority.HIGH,
      category: TicketCategory.SECURITY,
      status: TicketStatus.CLOSED,
      technicianId: tech2.id,
    },
  });

  const t6 = await prisma.ticket.create({
    data: {
      title: "VPN défaillant",
      description:
        "Impossible pour les télétravailleurs de monter le tunnel VPN ce matin. Erreur de certificat.",
      client: "LogiTrans",
      priority: TicketPriority.CRITICAL,
      category: TicketCategory.NETWORK,
      status: TicketStatus.OPEN,
      technicianId: null,
    },
  });

  const t7 = await prisma.ticket.create({
    data: {
      title: "Imprimante bourrage constant",
      description: "L'imprimante bloque le papier.",
      client: "InnovCorp",
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.HARDWARE,
      status: TicketStatus.IN_PROGRESS,
      technicianId: tech3.id,
    },
  });

  const t8 = await prisma.ticket.create({
    data: {
      title: "Mise à jour bloquée",
      description: "La mise à jour annuelle de la base de données plante.",
      client: "BatiConstruction",
      priority: TicketPriority.HIGH,
      category: TicketCategory.SOFTWARE,
      status: TicketStatus.PENDING,
      technicianId: tech1.id,
    },
  });

  const t9 = await prisma.ticket.create({
    data: {
      title: "Renouvellement carte d'accès",
      description: "Perte du badge magnétique d'accès aux locaux.",
      client: "Suivi de Flotte",
      priority: TicketPriority.LOW,
      category: TicketCategory.SECURITY,
      status: TicketStatus.RESOLVED,
      technicianId: tech2.id,
    },
  });

  const t10 = await prisma.ticket.create({
    data: {
      title: "Nettoyage poste informatique",
      description: "Le PC de Max fait énormément de bruit.",
      client: "LogiTrans",
      priority: TicketPriority.MEDIUM,
      category: TicketCategory.OTHER,
      status: TicketStatus.CLOSED,
      technicianId: tech3.id,
    },
  });

  //COMMENTAIRES
  await prisma.comment.create({
    data: {
      description: "Je me déplace pour tester le câblage.",
      ticketId: t1.id,
      userId: tech1.id,
    },
  });

  await prisma.comment.create({
    data: {
      description: "Commande d'un disque de rechange effectuée.",
      ticketId: t2.id,
      userId: tech2.id,
    },
  });

  await prisma.comment.create({
    data: {
      description: "Attention, livraison du disque prévue sous 48h.",
      ticketId: t2.id,
      userId: admin1.id,
    },
  });

  await prisma.comment.create({
    data: {
      description:
        "Ticket mis en attente suite au transfert du rapport de bug.",
      ticketId: t3.id,
      userId: tech3.id,
    },
  });

  await prisma.comment.create({
    data: {
      description: "Nettoyage effectué.",
      ticketId: t7.id,
      userId: tech3.id,
    },
  });
}

main()
  .catch((e) => {
    console.error("Une erreur est survenue lors du seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
