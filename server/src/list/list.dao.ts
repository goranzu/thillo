import prisma from "../client";
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
}

export default new ListDao();
