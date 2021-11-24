import { NotFoundError, UnauthorizedError } from "../common/errors";
import * as listService from "../list/list.service";
import * as userSevice from "../user/user.service";
import * as boardDao from "./board.dao";

export interface CreateBoardDto {
  creatorId: number;
  name: string;
  description?: string;
}

export interface UpdateBoardDto {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

async function listUsersBoards(userId: number): Promise<boardDao.Board[]> {
  const boards = await boardDao.list(userId);

  if (!boards) {
    throw new NotFoundError();
  }

  return boards;
}

async function create(data: CreateBoardDto): Promise<boardDao.Board> {
  const board = await boardDao.create(data);

  if (!board) {
    throw new Error();
  }

  await listService.createDefaultLists(board.id, data.creatorId);

  return board;
}

async function findBoardIfMember(
  creatorId: number,
  boardId: number,
): Promise<boardDao.Board> {
  const board = await boardDao.findBoardByMemberId(creatorId, boardId);

  if (board == null) {
    throw new NotFoundError("Board not found.");
  }

  return board;
}

async function updateBoard(
  data: UpdateBoardDto,
  boardId: number,
  creatorId: number,
): Promise<boardDao.Board> {
  const board = await boardDao.update(data, { id: boardId, creatorId });
  if (!board) {
    throw new NotFoundError();
  }
  return board;
}

async function deleteBoard(boardId: number, creatorId: number): Promise<void> {
  const res = await boardDao.deleteBoard(boardId, creatorId);
  if (!res) {
    throw Error("Error when deleting board.");
  }
}

async function addMemberToBoard(
  boardId: number,
  email: string,
  creatorId: number,
): Promise<boardDao.Board> {
  await checkIfUserIsCreatorOfBoard(boardId, creatorId);

  const newMember = await userSevice.findByEmail(email);

  const board = await boardDao.addMember(boardId, newMember.id);
  if (!board) {
    throw new Error();
  }

  return board;
}

async function removeMember(
  boardId: number,
  creatorId: number,
  memberId: number,
): Promise<boardDao.Board> {
  const board = await boardDao.removeMember(boardId, memberId);

  if (!board) {
    throw new Error();
  }

  return board;
}

// async function userIsMember(memberId: number, boardId: number) {
//   const isMember = await boardDao.findMember(memberId, boardId);

//   //   TODO this should throw
//   if (isMember == null) {
//     throw new UnauthorizedError();
//   } else {
//     return true;
//   }
// }

async function checkIfUserIsCreatorOfBoard(
  boardId: number,
  creatorId: number,
): Promise<void> {
  const creator = await boardDao.findBoardCreator(boardId, creatorId);
  if (!creator) {
    throw new UnauthorizedError();
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
  //   userIsMember,
  checkIfUserIsCreatorOfBoard,
};
