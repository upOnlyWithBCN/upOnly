/*
  Warnings:

  - Added the required column `amount_donated` to the `Donations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Donations" ADD COLUMN     "amount_donated" DECIMAL(65,30) NOT NULL;
