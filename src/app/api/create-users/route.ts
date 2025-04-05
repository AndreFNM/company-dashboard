import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, position, phone, password, role } = body;

  if (!name || !email || !password || !position || !role) {
    return NextResponse.json({ message: "Campos obrigatórios em falta." }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    return NextResponse.json({ message: "Este email já está em uso." }, { status: 400 });
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      phone,
      position,
      role,
      password: hashed,
    },
  });

  return NextResponse.json({ message: "Utilizador criado com sucesso." }, { status: 201 });
}