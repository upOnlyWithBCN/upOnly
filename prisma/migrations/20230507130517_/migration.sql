/*
  Warnings:

  - You are about to drop the column `projectId` on the `Chain` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chain" DROP CONSTRAINT "Chain_projectId_fkey";

-- AlterTable
ALTER TABLE "Chain" DROP COLUMN "projectId",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Chain_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "_ChainToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChainToProject_AB_unique" ON "_ChainToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_ChainToProject_B_index" ON "_ChainToProject"("B");

-- AddForeignKey
ALTER TABLE "_ChainToProject" ADD CONSTRAINT "_ChainToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChainToProject" ADD CONSTRAINT "_ChainToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;
