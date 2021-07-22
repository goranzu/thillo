import boardService from "../board/board.service";
import { NotFoundError } from "../common/errors";
import listDao from "./list.dao";

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

class ListService {
  async createList(data: CreateListDto) {
    const list = await listDao.create(data);
    return list;
  }

  async getList(listId: number, memberId: number, boardId: number) {
    const list = await listDao.find(listId, memberId, boardId);

    if (list == null) {
      throw new NotFoundError("List not found.");
    }

    return list;
  }

  async createDefaultLists(boardId: number, creatorId: number) {
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

  async updateList(data: PatchListDto) {
    await boardService.userIsMember(data.memberId, data.boardId);

    const list = await listDao.update(data);
    return list;
  }

  async deleteList(boardId: number, listId: number, memberId: number) {
    await boardService.userIsMember(memberId, boardId);
    await listDao.delete(listId);
    return true;
  }
}

export default new ListService();
