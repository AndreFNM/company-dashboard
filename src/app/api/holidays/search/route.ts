import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não Autorizado" }, { status: 401 });
  }

  const userId = parseInt(session.user.id);

  const holidays = await prisma.holiday.findMany({
    where: { userId },
    select: { date: true },
  });

  return NextResponse.json({ holidays });
}
