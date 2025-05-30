import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: parseInt(session.user.id) },
    select: {
      name: true,
      phone: true,
      imageUrl: true,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "Utilizador não encontrado" }, { status: 404 });
  }

  return NextResponse.json(user);
}

type UpdateData = Partial<{
  name: string;
  phone: string;
  imageUrl: string;
  password: string;
}>;

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Não autorizado." }, { status: 401 });
  }

  const body = await req.json();
  const { name, phone, currentPassword, newPassword, imageUrl } = body;

  if (!name) {
    return NextResponse.json({ message: "Nome é obrigatório." }, { status: 400 });
  }

  const userId = parseInt(session.user.id);
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    return NextResponse.json({ message: "Utilizador não encontrado." }, { status: 404 });
  }

  const updateData: UpdateData = {
    name,
  };

  if (phone) updateData.phone = phone;
  if (imageUrl) updateData.imageUrl = imageUrl;

  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ message: "Insira a password atual." }, { status: 400 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password || "");
    if (!isValid) {
      return NextResponse.json({ message: "Password atual incorreta." }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    updateData.password = hashed;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({ message: "Perfil atualizado com sucesso." });
}
