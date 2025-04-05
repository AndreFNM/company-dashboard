// src/app/api/holidays/all/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não Autorizado" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    include: {
      holidays: true,
    },
  });

  const holidays = users.flatMap((user) =>
    user.holidays.map((holiday) => ({
      title: `${user.name} - Férias`,
      start: holiday.date,
      end: holiday.date,
      allDay: true,
      userId: user.id,
    }))
  );

  return NextResponse.json({ holidays, users });
}
