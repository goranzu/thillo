import * as boardService from "../board/board.service";
import { NotFoundError } from "../../common/errors";
import { FindList } from "../../common/types";
import * as listDao from "./list.dao";

export interface CreateListDto {
  name: string;
  description?: string;
  boardId: number;
  creatorId: number;
}

export interface PatchListDto {
  name?: string;
  description?: string;
  listId: number;
  boardId: number;
  memberId: number;
}

async function createList(data: CreateListDto) {
  const list = await listDao.create(data);
  return list;
}

async function getList({ listId, boardId, memberId }: FindList) {
  const list = await listDao.find({ listId, memberId, boardId });

  if (list == null) {
    throw new NotFoundError("List not found.");
  }

  return list;
}

async function createDefaultLists(
  boardId: number,
  creatorId: number,
): Promise<void> {
  const defaultLists = [
    {
      name: "To Do",
      boardId,
      creatorId,
    },
    {
      name: "Current",
      boardId,
      creatorId,
    },
    {
      name: "Done",
      boardId,
      creatorId,
    },
  ];

  await listDao.createMany(defaultLists);
  return;
}

async function updateList(data: PatchListDto) {
  //   await boardService.userIsMember(data.memberId, data.boardId);

  const list = await listDao.update(data);
  return list;
}

async function deleteList(boardId: number, listId: number, memberId: number) {
  //   Only creator of board can delete lists
  //   await boardService.userIsMember(memberId, boardId);
  await boardService.checkIfUserIsCreatorOfBoard(boardId, memberId);
  await listDao.deleteList(listId, boardId);
  return true;
}

export { createList, getList, createDefaultLists, updateList, deleteList };
