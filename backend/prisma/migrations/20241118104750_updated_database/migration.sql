/*
  Warnings:

  - Added the required column `difficulty` to the `Flashcard` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Flashcard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "setId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    CONSTRAINT "Flashcard_setId_fkey" FOREIGN KEY ("setId") REFERENCES "Set" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Flashcard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Flashcard" ("id", "question", "setId", "solution", "userId") SELECT "id", "question", "setId", "solution", "userId" FROM "Flashcard";
DROP TABLE "Flashcard";
ALTER TABLE "new_Flashcard" RENAME TO "Flashcard";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
