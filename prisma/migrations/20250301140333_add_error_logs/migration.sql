-- CreateTable
CREATE TABLE "error_logs" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "stack" TEXT,
    "componentStack" TEXT,
    "url" TEXT,
    "userAgent" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "error_logs_pkey" PRIMARY KEY ("id")
);
