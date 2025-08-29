// Script to import users from users.json into Prisma User table
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function importUsers() {
  const raw = fs.readFileSync('./data/users.json', 'utf-8');
  const users = JSON.parse(raw);

  for (const user of users) {
    try {
      await prisma.user.create({
        data: {
          username: user.username,
          password: user.password, // already hashed
          email: user.email || undefined,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
          branch: user.branch || undefined,
          position: user.position || undefined,
          permissions: user.permissions || undefined,
          createdAt: user.createdAt ? new Date(user.createdAt) : undefined,
        },
      });
      console.log(`Imported: ${user.username}`);
    } catch (err) {
      console.error(`Failed to import ${user.username}:`, err.message);
    }
  }
  await prisma.$disconnect();
}

importUsers();
