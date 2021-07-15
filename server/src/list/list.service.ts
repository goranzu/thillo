import { NotFoundError } from "../common/errors";
import listDao from "./list.dao";

export interface CreateListDto {
  name: string;
  description?: string;
  boardId: number;
  creatorId: number;
}

class ListService {
  async getList(listId: number, memberId: number, boardId: number) {
    const list = await listDao.findList(listId, memberId, boardId);

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
}

export default new ListService();
