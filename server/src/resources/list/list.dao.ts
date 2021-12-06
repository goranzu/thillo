import { FindList } from "../../common/types";
import pool from "../../db/pool";
import { CreateListDto, PatchListDto } from "./list.service";

interface List {
  id: number;
  name: string;
  description?: string;
  creatorId?: number;
  boardId?: number;
  createdAt: string;
  updatedAt: string;
}

async function create(data: CreateListDto): Promise<List> {
  const list = await pool.query(
    `
        INSERT INTO lists (name, description, "creatorId", "boardId")
        VALUES ($1, $2, $3, $4)
        RETURNING name, description, "createdAt", "updatedAt";
    `,
    [data.name, data.description, data.creatorId, data.boardId],
  );
  return list?.rows[0];
}

async function createMany(defaultLists: CreateListDto[]): Promise<void> {
  for (const list of defaultLists) {
    await create(list);
  }
}

async function find(listId: number, boardId: number, memberId: number) {
  // TODO !

  // const list = await pool.query(`
  //     SELECT
  // `)
  //   console.log("boardId", boardId);
  //   const list = await prisma.list.findFirst({
  //     where: {
  //       id: listId,
  //       AND: {
  //         boardId,
  //         AND: {
  //           board: {
  //             members: {
  //               some: {
  //                 memberId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     select: {
  //       id: true,
  //       name: true,
  //       description: true,
  //       cards: true,
  //     },
  //   });

  return list;
}

async function update(data: PatchListDto): Promise<List> {
  const list = await pool.query(
    `
        UPDATE lists
        SET name = $1, description = $2
        WHERE id = $3
        RETURNING *;
    `,
    [data.name, data.description, data.listId],
  );
  //   const list = await prisma.list.update({
  //     where: {
  //       id: data.listId,
  //     },
  //     data: {
  //       name: data.name,
  //       description: data.description,
  //     },
  //   });

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
