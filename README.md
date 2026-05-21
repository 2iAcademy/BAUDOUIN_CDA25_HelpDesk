# HelpDesk Pro

Application de gestion de tickets réalisée avec :

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- NextAuth
- BCryptJS

---

# Planning prévisionnel

En début de journée, un planning prévisionnel a été établi pour découper le travail en tâches concrètes avec une estimation de durée.

| Horaires | Tâche                                                                                                                                           | Statut |
| :--- |:------------------------------------------------------------------------------------------------------------------------------------------------|:------:|
| **9h - 10h** | Choix des technos, création dépôt Git, modélisation de la BDD                                                                                   |   ✅    |
| **10h - 11h** | Installation du projet (Framework, ORM, dépendances) + création des modèles                                                                     |   ✅    |
| **11h - 12h30** | Initialisation de la BDD + accès aux données                                                                                                    |   ✅    |
| **14h - 15h** | Affichage liste des tickets + détails d'un ticket + form de création/modification d'un ticket<br/>Optionnel : gérer la création de commentaires |   ✅    |
| **15h - 16h30** | Authentification pour accéder au /Dashboard + droits sur les actions + dashboard                                                                |   ✅    |
| **16h30 - 17h30** | Tests unitaires                                                                                                                                 |   ✅    |

---

# Installation du projet

## 1. Cloner le dépôt

```bash
git clone <url>
cd HelpDesk
```

## 2. Installer les dépendances

```bash
npm install
```

## 3. Créer le fichier .env

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/help_desk"
NEXTAUTH_SECRET="votre_secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 4. Générer le client Prisma et alimenter la BDD

```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

## 5. Lancer le projet

```bash
npm run dev
```

## Commandes utiles

Permet de visualiser la base de donnée sans avoir besoin de SGBD.
```bash
npx prisma studio
```