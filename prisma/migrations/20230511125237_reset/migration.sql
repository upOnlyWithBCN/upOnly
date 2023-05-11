-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deposit_wallet" (
    "user_id" INTEGER NOT NULL,
    "deposit_wallet_address" TEXT NOT NULL,
    "deposit_wallet_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Deposit_wallet_pkey" PRIMARY KEY ("deposit_wallet_id")
);

-- CreateTable
CREATE TABLE "Chain" (
    "id" SERIAL NOT NULL,
    "chain_id" TEXT NOT NULL,

    CONSTRAINT "Chain_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "created_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_id" SERIAL NOT NULL,
    "smart_contract_address" TEXT NOT NULL,
    "deposit_wallet_address" TEXT NOT NULL,
    "deposit_wallet_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "project_details" TEXT NOT NULL,
    "project_title" TEXT NOT NULL,
    "completion_time" TIMESTAMP(3) NOT NULL,
    "goal_time" TIMESTAMP(3) NOT NULL,
    "targeted_amount" DECIMAL(65,30) NOT NULL,
    "raised_amount" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("project_id")
);

-- CreateTable
CREATE TABLE "Project_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "projectProject_id" INTEGER,

    CONSTRAINT "Project_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Donations" (
    "id" BIGSERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "projectProject_id" INTEGER NOT NULL,

    CONSTRAINT "Donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChainToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryToProject" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
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

-- CreateIndex
CREATE UNIQUE INDEX "Chain_chain_id_key" ON "Chain"("chain_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_smart_contract_address_key" ON "Project"("smart_contract_address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_deposit_wallet_address_key" ON "Project"("deposit_wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "Project_deposit_wallet_id_key" ON "Project"("deposit_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "Project_images_url_key" ON "Project_images"("url");

-- CreateIndex
CREATE UNIQUE INDEX "_ChainToProject_AB_unique" ON "_ChainToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_ChainToProject_B_index" ON "_ChainToProject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToProject_AB_unique" ON "_CategoryToProject"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToProject_B_index" ON "_CategoryToProject"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToUser_AB_unique" ON "_ProjectToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToUser_B_index" ON "_ProjectToUser"("B");

-- AddForeignKey
ALTER TABLE "Deposit_wallet" ADD CONSTRAINT "Deposit_wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project_images" ADD CONSTRAINT "Project_images_projectProject_id_fkey" FOREIGN KEY ("projectProject_id") REFERENCES "Project"("project_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donations" ADD CONSTRAINT "Donations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Donations" ADD CONSTRAINT "Donations_projectProject_id_fkey" FOREIGN KEY ("projectProject_id") REFERENCES "Project"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChainToProject" ADD CONSTRAINT "_ChainToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Chain"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChainToProject" ADD CONSTRAINT "_ChainToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProject" ADD CONSTRAINT "_CategoryToProject_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToProject" ADD CONSTRAINT "_CategoryToProject_B_fkey" FOREIGN KEY ("B") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("project_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToUser" ADD CONSTRAINT "_ProjectToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
