import { NotFoundError } from "../utils/errors";
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

// async function createDefaultLists(
//   boardId: number,
//   creatorId: number,
// ): Promise<void> {
//   const defaultLists: DefaultListItem[] = [
//     {
//       name: "To Do",
//       boardId,
//       creatorId,
//     },
//     {
//       name: "Current",
//       boardId,
//       creatorId,
//     },
//     {
//       name: "Done",
//       boardId,
//       creatorId,
//     },
//   ];

//   await prisma.list.createMany({ data: defaultLists });
//   return;
// }

// async function getOne(
//   listId: number,
//   userId: number,
//   boardId: number,
// ): Promise<List> {
//   // Finds the list only if the logged in user is a member of the board
//   const list = await prisma.list.findFirst({
//     where: {
//       id: listId,
//       AND: {
//         boardId,
//         AND: {
//           board: {
//             members: {
//               some: {
//                 memberId: userId,
//                 boardId,
//               },
//             },
//           },
//         },
//       },
//     },
//   });

//   if (list == null) {
//     throw new NotFoundError("List not found.");
//   }

//   return list;
// }

// export { createDefaultLists, getOne };
