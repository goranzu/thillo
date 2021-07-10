import { Board } from "@prisma/client";
import prisma from "../../client";
import { UpdateBoardBody } from "./board.controller";

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

interface Update extends UpdateBoardBody {
  userId: number;
  boardId: number;
}

async function updateOne({
  boardId,
  userId,
  name,
  description,
  isPrivate,
}: Update): Promise<Board> {
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId: userId,
      },
    },
    data: {
      name,
      description,
      isPrivate,
    },
  });

  return board;
}

async function deleteOne(boardId: number, userId: number): Promise<void> {
  await prisma.board.delete({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId: userId,
      },
    },
  });
}

export { getAll, createOne, getOne, updateOne, deleteOne };
