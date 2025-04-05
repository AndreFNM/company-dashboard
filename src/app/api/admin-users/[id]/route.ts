import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const userIdToDelete = parseInt(params.id);

  const user = await prisma.user.findUnique({
    where: { id: userIdToDelete },
    select: { role: true },
  });

  if (!user) {
    return NextResponse.json({ message: "Utilizador não encontrado." }, { status: 404 });
  }

  if (user.role === "ADMIN") {
    return NextResponse.json({ message: "Não é possível eliminar um admin." }, { status: 403 });
  }

  await prisma.holiday.deleteMany({
    where: { userId: userIdToDelete },
  });

  await prisma.user.delete({
    where: { id: userIdToDelete },
  });

  return NextResponse.json({ message: "Utilizador eliminado com sucesso." });
}
