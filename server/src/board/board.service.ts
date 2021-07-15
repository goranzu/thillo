import { Board } from "@prisma/client";
import prisma from "../client";
import { NotFoundError } from "../utils/errors";
import listService from "../list/list.service";
// import { UpdateBoardBody } from "./board.controller";
// import * as userService from "../user/user.service";
import userSevice from "../user/user.service";
import boardDao from "./board.dao";

export interface CreateBoardDto {
  creatorId: number;
  name: string;
  description?: string;
}

export interface UpdateBoardDto extends Partial<CreateBoardDto> {
  creatorId: number;
  isPrivate?: boolean;
  boardId: number;
}

class BoardService {
  async listUsersBoards(userId: number) {
    const boards = await boardDao.list(userId);

    return boards;
  }

  async create(data: CreateBoardDto) {
    const board = await boardDao.create(data);

    await listService.createDefaultLists(board.id, data.creatorId);

    return board;
  }

  async findBoardIfMember(memberId: number, boardId: number) {
    const board = await boardDao.findBoardByMemberId(memberId, boardId);

    if (board == null) {
      throw new NotFoundError("Board not found.");
    }

    const members = board.members.map((board) => board.member);

    return { ...board, members };
  }

  async updateBoard(data: UpdateBoardDto) {
    const board = await boardDao.update(data);
    return board;
  }

  async deleteBoard(boardId: number, creatorId: number) {
    await boardDao.delete(boardId, creatorId);
    return true;
  }

  async addMemberToBoard(boardId: number, email: string, creatorId: number) {
    const newMember = await userSevice.findByEmail(email);

    const board = await boardDao.addMember(boardId, creatorId, newMember.id);
    return board;
  }

  async removeMember(boardId: number, creatorId: number, memberId: number) {
    const board = await boardDao.removeMember(boardId, creatorId, memberId);

    return board;
  }
}

export default new BoardService();

// interface Member {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// interface CustomBoard extends Board {
//   members: Member[];
// }

// async function getAll(userId: number): Promise<Board[]> {
//   const boards = await prisma.board.findMany({
//     where: { creatorId: userId },
//     orderBy: { createdAt: "desc" },
//   });

//   return boards;
// }

// async function createOne({
//   userId,
//   name,
//   description,
// }: CreateOne): Promise<Board> {
//   const board = await prisma.board.create({
//     data: {
//       name,
//       description,
//       creatorId: userId,
//       members: {
//         create: {
//           memberId: userId,
//         },
//       },
//     },
//   });

//   return board;
// }

// async function getOne(userId: number, boardId: number): Promise<CustomBoard> {
//   //   Finds board if logged in user is the creator or a member
//   const board = await prisma.board.findFirst({
//     where: {
//       id: boardId,
//       creatorId: userId,
//       OR: {
//         id: boardId,
//         members: {
//           some: {
//             memberId: userId,
//           },
//         },
//       },
//     },
//     include: {
//       lists: true,
//       members: {
//         include: {
//           member: {
//             select: {
//               id: true,
//               firstName: true,
//               lastName: true,
//               email: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   if (board == null) {
//     throw new NotFoundError("Board not found.");
//   }

//   const members = board.members.map((board) => board.member);

//   return { ...board, members };
// }

// interface Update extends UpdateBoardBody {
//   userId: number;
//   boardId: number;
// }

// async function updateOne({
//   boardId,
//   userId,
//   name,
//   description,
//   isPrivate,
// }: Update): Promise<Board> {
//   const board = await prisma.board.update({
//     where: {
//       id_creatorId: {
//         id: boardId,
//         creatorId: userId,
//       },
//     },
//     data: {
//       name,
//       description,
//       isPrivate,
//     },
//   });

//   return board;
// }

// async function deleteOne(boardId: number, userId: number): Promise<void> {
//   await prisma.board.delete({
//     where: {
//       id_creatorId: {
//         id: boardId,
//         creatorId: userId,
//       },
//     },
//   });
// }

// async function addMember(boardId: number, email: string, userId: number) {
//   const newMember = await userSevice.findByEmail(email);

//   if (newMember == null) {
//     throw new NotFoundError("User not found.");
//   }

//   //   The logged in user is able to add members to a board only if this user als is the creator of the board
//   const board = await prisma.board.update({
//     where: {
//       id_creatorId: {
//         id: boardId,
//         creatorId: userId,
//       },
//     },
//     data: {
//       members: {
//         create: {
//           memberId: newMember.id,
//         },
//       },
//     },
//   });

//   return board;
// }

// async function removeMember(boardId: number, userId: number, memberId: number) {
//   //   The logged in user is able to add members to a board only if this user als is the creator of the board
//   const board = await prisma.board.update({
//     where: {
//       id_creatorId: {
//         id: boardId,
//         creatorId: userId,
//       },
//     },
//     data: {
//       members: {
//         delete: {
//           memberId_boardId: {
//             boardId,
//             memberId,
//           },
//         },
//       },
//     },
//   });

//   return board;
// }

// export {
//   getAll,
//   createOne,
//   getOne,
//   updateOne,
//   deleteOne,
//   addMember,
//   removeMember,
// };
