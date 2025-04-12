/*
  Warnings:

  - You are about to drop the `ChatLog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reminder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ChatLog" DROP CONSTRAINT "ChatLog_userId_fkey";

-- DropForeignKey
ALTER TABLE "Reminder" DROP CONSTRAINT "Reminder_userId_fkey";

-- DropTable
DROP TABLE "ChatLog";

-- DropTable
DROP TABLE "Reminder";

-- DropEnum
DROP TYPE "ChatMode";

-- DropEnum
DROP TYPE "ReminderType";
