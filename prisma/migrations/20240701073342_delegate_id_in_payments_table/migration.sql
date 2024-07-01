/*
  Warnings:

  - Added the required column `delegateId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `delegateId` INTEGER NOT NULL;
