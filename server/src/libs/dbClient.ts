import { PrismaClient } from "@prisma/client";

// グローバル空間に型を定義する（TypeScriptの場合）
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// PrismaClient のインスタンスを生成または再利用
export const getPrisma = (): PrismaClient => {
  // グローバル空間にPrismaClientのインスタンスがない場合は、新規生成する。
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  return global.prisma;
};

// シングルトンなGlobal PrismaClient
export const globalPrisma = getPrisma();
