import prisma from "../common/client";
import { CreateListDto } from "./list.service";

class ListDao {
  async findList(listId: number, memberId: number, boardId: number) {
    const list = await prisma.list.findFirst({
      where: {
        id: listId,
        AND: {
          boardId,
          AND: {
            board: {
              members: {
                some: {
                  memberId,
                  boardId,
                },
              },
            },
          },
        },
      },
    });
    return list;
  }

  async createMany(defaultLists: CreateListDto[]) {
    await prisma.list.createMany({ data: defaultLists });
  }

  async find(listId: number, boardId: number, memberId: number) {
    const list = await prisma.list.findFirst({
      where: {
        id: listId,
        AND: {
          boardId,
          AND: {
            board: {
              members: {
                some: {
                  memberId,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        cards: true,
      },
    });

    return list;
  }
}

export default new ListDao();
