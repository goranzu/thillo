import prisma from "../common/client";
import { FindList } from "../common/types";
import { CreateListDto, PatchListDto } from "./list.service";

async function create(data: CreateListDto) {
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

async function createMany(defaultLists: CreateListDto[]) {
  await prisma.list.createMany({ data: defaultLists });
}

async function find({ listId, boardId = -1, memberId }: FindList) {
  console.log("boardId", boardId);
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

async function update(data: PatchListDto) {
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

async function deleteList(listId: number, boardId: number) {
  await prisma.list.delete({
    where: {
      id_boardId: {
        id: listId,
        boardId,
      },
    },
  });
  return;
}

export { create, createMany, find, update, deleteList };

// class ListDao {
//   //   async findList(listId: number, memberId: number, boardId: number) {
//   //     const list = await prisma.list.findFirst({
//   //       where: {
//   //         id: listId,
//   //         AND: {
//   //           boardId,
//   //           AND: {
//   //             board: {
//   //               members: {
//   //                 some: {
//   //                   memberId,
//   //                   boardId,
//   //                 },
//   //               },
//   //             },
//   //           },
//   //         },
//   //       },
//   //     });
//   //     return list;
//   //   }

//   async create(data: CreateListDto) {
//     const list = await prisma.list.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         boardId: data.boardId,
//         creatorId: data.creatorId,
//       },
//     });
//     return list;
//   }

//   async createMany(defaultLists: CreateListDto[]) {
//     await prisma.list.createMany({ data: defaultLists });
//   }

//   async find({ listId, boardId = -1, memberId }: FindList) {
//     console.log("boardId", boardId);
//     const list = await prisma.list.findFirst({
//       where: {
//         id: listId,
//         AND: {
//           boardId: 3,
//           AND: {
//             board: {
//               members: {
//                 some: {
//                   memberId,
//                 },
//               },
//             },
//           },
//         },
//       },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         cards: true,
//       },
//     });

//     return list;
//   }

//   async update(data: PatchListDto) {
//     const list = await prisma.list.update({
//       where: {
//         id: data.listId,
//       },
//       data: {
//         name: data.name,
//         description: data.description,
//       },
//     });

//     return list;
//   }

//   async delete(listId: number, boardId: number) {
//     await prisma.list.delete({
//       where: {
//         id_boardId: {
//           id: listId,
//           boardId,
//         },
//       },
//     });
//     return;
//   }
// }

// export default new ListDao();
