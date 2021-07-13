import { Board } from "@prisma/client";
import prisma from "../../client";
import { NotFoundError } from "../../utils/errors";
import { UpdateBoardBody } from "./board.controller";
import * as userService from "../user/user.service";

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

interface CustomBoard extends Board {
  members: Member[];
}

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
      members: {
        create: {
          memberId: userId,
        },
      },
    },
  });

  return board;
}

async function getOne(userId: number, boardId: number): Promise<CustomBoard> {
  //   Finds board if logged in user is the creator or a member
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      creatorId: userId,
      OR: {
        id: boardId,
        members: {
          some: {
            memberId: userId,
          },
        },
      },
    },
    include: {
      lists: true,
      members: {
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (board == null) {
    throw new NotFoundError("Board not found.");
  }

  const members = board.members.map((board) => board.member);

  return { ...board, members };
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

async function addMember(boardId: number, email: string, userId: number) {
  const newMember = await userService.findByEmail(email);

  if (newMember == null) {
    throw new NotFoundError("User not found.");
  }

  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId: userId,
      },
    },
    data: {
      members: {
        create: {
          memberId: newMember.id,
        },
      },
    },
  });

  return board;
}

async function removeMember(boardId: number, userId: number, memberId: number) {
  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId: userId,
      },
    },
    data: {
      members: {
        delete: {
          memberId_boardId: {
            boardId,
            memberId,
          },
        },
      },
    },
  });

  return board;
}

export {
  getAll,
  createOne,
  getOne,
  updateOne,
  deleteOne,
  addMember,
  removeMember,
};
