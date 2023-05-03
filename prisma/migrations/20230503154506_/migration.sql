-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "smart_contract_address" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "project_deposit_walletDeposit_wallet_address" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    CONSTRAINT "Project_project_deposit_walletDeposit_wallet_address_fkey" FOREIGN KEY ("project_deposit_walletDeposit_wallet_address") REFERENCES "Project_deposit_wallet" ("deposit_wallet_address") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project_deposit_wallet" (
    "deposit_wallet_address" TEXT NOT NULL,
    "deposit_wallet_id" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_smart_contract_address_key" ON "Project"("smart_contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_project_deposit_walletDeposit_wallet_address_key" ON "Project"("project_deposit_walletDeposit_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_deposit_wallet_deposit_wallet_address_key" ON "Project_deposit_wallet"("deposit_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_deposit_wallet_deposit_wallet_id_key" ON "Project_deposit_wallet"("deposit_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");
