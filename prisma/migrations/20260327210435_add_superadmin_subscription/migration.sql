/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Tenant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Tenant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "pin_kiosco" TEXT NOT NULL DEFAULT '1234',
ADD COLUMN     "suscripcion_vence" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Superadmin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Superadmin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Superadmin_email_key" ON "Superadmin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");
