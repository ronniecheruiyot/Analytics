-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` INTEGER NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Delegate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fullName` VARCHAR(50) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` INTEGER NOT NULL,
    `ihrmNumber` VARCHAR(20) NOT NULL,
    `jobTitle` VARCHAR(15) NOT NULL,
    `companyId` INTEGER NULL,
    `paymentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Delegate_email_key`(`email`),
    UNIQUE INDEX `Delegate_phone_key`(`phone`),
    UNIQUE INDEX `Delegate_ihrmNumber_key`(`ihrmNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SponsorCompany` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `companyName` VARCHAR(50) NOT NULL,
    `employeeCount` INTEGER NOT NULL,
    `contactPersonName` VARCHAR(50) NULL,
    `contactPersonEmail` VARCHAR(50) NULL,
    `contactPersonPhone` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentMode` VARCHAR(6) NOT NULL,
    `amount` INTEGER NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `paymentReferenceCode` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Delegate` ADD CONSTRAINT `Delegate_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `SponsorCompany`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Delegate` ADD CONSTRAINT `Delegate_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
