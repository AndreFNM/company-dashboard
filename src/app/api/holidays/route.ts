import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não Autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { dates } = body;

  if (!dates || !Array.isArray(dates) || dates.length === 0) {
    return NextResponse.json({ message: "Nenhuma data recebida" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);
  const parsedDates = dates.map((d: string) => new Date(d));
  const year = parsedDates[0].getFullYear();

  const existing = await prisma.holiday.findMany({
    where: {
      userId,
      date: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    },
  });

  if (existing.length + parsedDates.length > 22) {
    return NextResponse.json(
      { message: "Limite de 22 dias por ano excedido" },
      { status: 400 }
    );
  }

  const holidays = parsedDates.map((date) => ({ userId, date }));
  await prisma.holiday.createMany({ data: holidays });

  return NextResponse.json({ message: "Férias marcadas com sucesso" }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não Autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { date } = body;

  if (!date) {
    return NextResponse.json({ message: "Data não recebida" }, { status: 400 });
  }

  const userId = parseInt(session.user.id);
  const targetDate = new Date(date);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (targetDate < today) {
    return NextResponse.json({ message: "Não é possível remover dias passados." }, { status: 400 });
  }

  await prisma.holiday.deleteMany({
    where: {
      userId,
      date: targetDate,
    },
  });

  return NextResponse.json({ message: "Férias removidas com sucesso." });
}
