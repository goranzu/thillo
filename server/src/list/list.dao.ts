import prisma from "../common/client";
import { CreateListDto, PatchListDto } from "./list.service";

class ListDao {
  //   async findList(listId: number, memberId: number, boardId: number) {
  //     const list = await prisma.list.findFirst({
  //       where: {
  //         id: listId,
  //         AND: {
  //           boardId,
  //           AND: {
  //             board: {
  //               members: {
  //                 some: {
  //                   memberId,
  //                   boardId,
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     });
  //     return list;
  //   }

  async create(data: CreateListDto) {
    const list = await prisma.list.create({
      data: {
        name: data.name,
        description: data.description,
        boardId: data.boardId,
        creatorId: data.creatorId,
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

  async update(data: PatchListDto) {
    const list = await prisma.list.update({
      where: {
        id: data.listId,
      },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return list;
  }

  async delete(listId: number) {
    await prisma.list.delete({
      where: {
        id: listId,
      },
    });
    return;
  }
}

export default new ListDao();
