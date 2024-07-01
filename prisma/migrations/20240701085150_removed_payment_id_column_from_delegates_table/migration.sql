/*
  Warnings:

  - You are about to drop the column `paymentId` on the `delegate` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `delegate` DROP FOREIGN KEY `Delegate_paymentId_fkey`;

-- AlterTable
ALTER TABLE `delegate` DROP COLUMN `paymentId`;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_delegateId_fkey` FOREIGN KEY (`delegateId`) REFERENCES `Delegate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
