-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('GUEST', 'STANDARD', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('EXCLUDED', 'FORMER', 'ALUMNUS', 'BABY', 'ACTIVE', 'MDV', 'BOARDIE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "givenName" VARCHAR(100),
    "profile" VARCHAR(512),
    "gender" VARCHAR(20),
    "phoneNumber" VARCHAR(20),
    "birthday" DATE,
    "roles" "UserRole"[],
    "status" "UserStatus",

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSecret" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "issuing" BOOLEAN NOT NULL,
    "issuesUntil" TIMESTAMP(3) NOT NULL,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuthSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthSession" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "deviceOS" TEXT NOT NULL,
    "browser" TEXT NOT NULL,
    "lastTimeUsed" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "AuthSession" ADD CONSTRAINT "AuthSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
