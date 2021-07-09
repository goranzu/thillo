import { Board } from "@prisma/client";
import prisma from "../../client";

async function getAll(userId: number): Promise<Board[]> {
  const boards = await prisma.board.findMany({
    where: { creatorId: userId },
    orderBy: { createdAt: "desc" },
  });

  return boards;
}

interface CreateOne {
  userId: number;
  name: string;
  description?: string;
}

async function createOne({
  userId,
  name,
  description,
}: CreateOne): Promise<Board> {
  const board = await prisma.board.create({
    data: {
      name,
      description,
      creatorId: userId,
    },
  });

  return board;
}

async function getOne(userId: number, boardId: number): Promise<Board | null> {
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      creatorId: userId,
    },
  });

  return board;
}

export { getAll, createOne, getOne };
