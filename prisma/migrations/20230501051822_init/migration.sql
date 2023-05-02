-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Deposit_wallet" (
    "user_id" INTEGER NOT NULL,
    "deposit_wallet_address" TEXT NOT NULL,
    "deposit_wallet_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Deposit_wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_address_key" ON "User"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_wallet_user_id_key" ON "Deposit_wallet"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_wallet_deposit_wallet_address_key" ON "Deposit_wallet"("deposit_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_wallet_deposit_wallet_id_key" ON "Deposit_wallet"("deposit_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Deposit_wallet_userId_key" ON "Deposit_wallet"("userId");
