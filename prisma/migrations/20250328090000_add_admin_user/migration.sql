-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- Insert admin user
-- Password: admin123 (hashed with bcrypt)
INSERT INTO "users" ("id", "email", "name", "password", "role", "createdAt", "updatedAt")
VALUES (
    'admin-user-id',
    'admin@example.com',
    'Admin',
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LHZzpXQNSZxLKJ.Ey',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
); 