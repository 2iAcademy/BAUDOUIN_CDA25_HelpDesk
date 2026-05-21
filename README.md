# HelpDesk Pro

Application de gestion de tickets réalisée avec :

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- NextAuth
- BCryptJS

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

```bash
npx prisma studio
```