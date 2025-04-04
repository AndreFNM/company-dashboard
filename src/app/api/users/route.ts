import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (err) {  
    console.error("Error getting users:", err); 
    return NextResponse.error();
  }
}
