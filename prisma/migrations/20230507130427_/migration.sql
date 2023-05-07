/*
  Warnings:

  - You are about to drop the column `projectProject_id` on the `Category` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_projectProject_id_fkey";

-- DropIndex
DROP INDEX "Category_category_key";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "projectProject_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "created_time" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "_CategoryToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProject_AB_unique" ON "_CategoryToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProject_B_index" ON "_CategoryToProject"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToProject" ADD CONSTRAINT "_CategoryToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProject" ADD CONSTRAINT "_CategoryToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;
