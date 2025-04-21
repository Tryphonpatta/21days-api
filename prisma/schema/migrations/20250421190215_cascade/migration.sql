-- DropForeignKey
ALTER TABLE "goalLog" DROP CONSTRAINT "goalLog_goalId_fkey";

-- AddForeignKey
ALTER TABLE "goalLog" ADD CONSTRAINT "goalLog_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
