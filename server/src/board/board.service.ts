import { NotFoundError, UnauthorizedError } from "../common/errors";
import * as listService from "../list/list.service";
import * as userSevice from "../user/user.service";
import * as boardDao from "./board.dao";

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

async function listUsersBoards(userId: number) {
  const boards = await boardDao.list(userId);

  return boards;
}

async function create(data: CreateBoardDto) {
  const board = await boardDao.create(data);

  await listService.createDefaultLists(board.id, data.creatorId);

  return board;
}

async function findBoardIfMember(memberId: number, boardId: number) {
  const board = await boardDao.findBoardByMemberId(memberId, boardId);

  if (board == null) {
    throw new NotFoundError("Board not found.");
  }

  const members = board.members.map((board) => board.member);

  return { ...board, members };
}

async function updateBoard(data: UpdateBoardDto) {
  const board = await boardDao.update(data);
  return board;
}

async function deleteBoard(boardId: number, creatorId: number) {
  await boardDao.deleteBoard(boardId, creatorId);
  return true;
}

async function addMemberToBoard(
  boardId: number,
  email: string,
  creatorId: number,
) {
  const newMember = await userSevice.findByEmail(email);

  const board = await boardDao.addMember(boardId, creatorId, newMember.id);
  return board;
}

async function removeMember(
  boardId: number,
  creatorId: number,
  memberId: number,
) {
  const board = await boardDao.removeMember(boardId, creatorId, memberId);

  return board;
}

async function userIsMember(memberId: number, boardId: number) {
  const isMember = await boardDao.findMember(memberId, boardId);

  //   TODO this should throw
  if (isMember == null) {
    throw new UnauthorizedError();
  } else {
    return true;
  }
}

export {
  listUsersBoards,
  create,
  findBoardIfMember,
  updateBoard,
  deleteBoard,
  addMemberToBoard,
  removeMember,
  userIsMember,
};

// class BoardService {
//   async listUsersBoards(userId: number) {
//     const boards = await boardDao.list(userId);

//     return boards;
//   }

//   async create(data: CreateBoardDto) {
//     const board = await boardDao.create(data);

//     await listService.createDefaultLists(board.id, data.creatorId);

//     return board;
//   }

//   async findBoardIfMember(memberId: number, boardId: number) {
//     const board = await boardDao.findBoardByMemberId(memberId, boardId);

//     if (board == null) {
//       throw new NotFoundError("Board not found.");
//     }

//     const members = board.members.map((board) => board.member);

//     return { ...board, members };
//   }

//   async updateBoard(data: UpdateBoardDto) {
//     const board = await boardDao.update(data);
//     return board;
//   }

//   async deleteBoard(boardId: number, creatorId: number) {
//     await boardDao.delete(boardId, creatorId);
//     return true;
//   }

//   async addMemberToBoard(boardId: number, email: string, creatorId: number) {
//     const newMember = await userSevice.findByEmail(email);

//     const board = await boardDao.addMember(boardId, creatorId, newMember.id);
//     return board;
//   }

//   async removeMember(boardId: number, creatorId: number, memberId: number) {
//     const board = await boardDao.removeMember(boardId, creatorId, memberId);

//     return board;
//   }

//   async userIsMember(memberId: number, boardId: number) {
//     const isMember = await boardDao.findMember(memberId, boardId);

//     //   TODO this should throw
//     if (isMember == null) {
//       throw new UnauthorizedError();
//     } else {
//       return true;
//     }
//   }
// }

// export default new BoardService();
