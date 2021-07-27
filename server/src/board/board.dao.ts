import prisma from "../common/client";
import { CreateBoardDto, UpdateBoardDto } from "./board.service";

async function list(userId: number) {
  const boards = await prisma.board.findMany({
    where: {
      creatorId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return boards;
}

async function create(data: CreateBoardDto) {
  //   Also add an entry in the board_members table
  const board = await prisma.board.create({
    data: {
      name: data.name,
      description: data.description,
      creatorId: data.creatorId,
      members: { create: { memberId: data.creatorId } },
    },
  });
  return board;
}

async function findBoardByMemberId(memberId: number, boardId: number) {
  //   Finds board if logged in user is the creator or a member
  console.log({ memberId, boardId });
  const board = await prisma.board.findFirst({
    where: {
      id: boardId,
      AND: {
        creatorId: memberId,
      },
      OR: {
        id: boardId,
        AND: {
          members: {
            some: {
              memberId,
            },
          },
        },
      },
    },
    include: {
      lists: { orderBy: { createdAt: "asc" } },
      members: {
        include: {
          member: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      },
    },
  });

  return board;
}

async function update(data: UpdateBoardDto) {
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: data.boardId,
        creatorId: data.creatorId,
      },
    },
    data: {
      name: data.name,
      description: data.description,
      isPrivate: data.isPrivate,
    },
  });

  return board;
}

async function deleteBoard(boardId: number, creatorId: number) {
  const board = await prisma.board.delete({
    where: { id_creatorId: { id: boardId, creatorId } },
  });
  return board;
}

async function addMember(
  boardId: number,
  creatorId: number,
  newMemberId: number,
) {
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId,
      },
    },
    data: {
      members: {
        create: {
          memberId: newMemberId,
        },
      },
    },
  });
  return board;
}

async function removeMember(
  boardId: number,
  creatorId: number,
  memberId: number,
) {
  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  const board = await prisma.board.update({
    where: {
      id_creatorId: {
        id: boardId,
        creatorId,
      },
    },
    data: {
      members: {
        delete: {
          memberId_boardId: {
            boardId,
            memberId,
          },
        },
      },
    },
  });
  return board;
}

async function findMember(memberId: number, boardId: number) {
  const member = await prisma.boardMembers.findUnique({
    where: {
      memberId_boardId: {
        memberId,
        boardId,
      },
    },
    select: { memberId: true },
  });

  return member;
}

export {
  list,
  create,
  findBoardByMemberId,
  update,
  deleteBoard,
  addMember,
  removeMember,
  findMember,
};

// class BoardDao {
//   async list(userId: number) {
//     const boards = await prisma.board.findMany({
//       where: {
//         creatorId: userId,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });
//     return boards;
//   }

//   async create(data: CreateBoardDto) {
//     //   Also add an entry in the board_members table
//     const board = await prisma.board.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         creatorId: data.creatorId,
//         members: { create: { memberId: data.creatorId } },
//       },
//     });
//     return board;
//   }

//   async findBoardByMemberId(memberId: number, boardId: number) {
//     //   Finds board if logged in user is the creator or a member
//     console.log({ memberId, boardId });
//     const board = await prisma.board.findFirst({
//       where: {
//         id: boardId,
//         AND: {
//           creatorId: memberId,
//         },
//         OR: {
//           id: boardId,
//           AND: {
//             members: {
//               some: {
//                 memberId,
//               },
//             },
//           },
//         },
//       },
//       include: {
//         lists: { orderBy: { createdAt: "asc" } },
//         members: {
//           include: {
//             member: {
//               select: {
//                 id: true,
//                 firstName: true,
//                 lastName: true,
//                 email: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     return board;
//   }

//   async update(data: UpdateBoardDto) {
//     const board = await prisma.board.update({
//       where: {
//         id_creatorId: {
//           id: data.boardId,
//           creatorId: data.creatorId,
//         },
//       },
//       data: {
//         name: data.name,
//         description: data.description,
//         isPrivate: data.isPrivate,
//       },
//     });

//     return board;
//   }

//   async delete(boardId: number, creatorId: number) {
//     const board = await prisma.board.delete({
//       where: { id_creatorId: { id: boardId, creatorId } },
//     });
//     return board;
//   }

//   async addMember(boardId: number, creatorId: number, newMemberId: number) {
//     const board = await prisma.board.update({
//       where: {
//         id_creatorId: {
//           id: boardId,
//           creatorId,
//         },
//       },
//       data: {
//         members: {
//           create: {
//             memberId: newMemberId,
//           },
//         },
//       },
//     });
//     return board;
//   }

//   async removeMember(boardId: number, creatorId: number, memberId: number) {
//     //   The logged in user is able to add members to a board only if this user als is the creator of the board
//     const board = await prisma.board.update({
//       where: {
//         id_creatorId: {
//           id: boardId,
//           creatorId,
//         },
//       },
//       data: {
//         members: {
//           delete: {
//             memberId_boardId: {
//               boardId,
//               memberId,
//             },
//           },
//         },
//       },
//     });
//     return board;
//   }

//   async findMember(memberId: number, boardId: number) {
//     const member = await prisma.boardMembers.findUnique({
//       where: {
//         memberId_boardId: {
//           memberId,
//           boardId,
//         },
//       },
//       select: { memberId: true },
//     });

//     return member;
//   }
// }

// export default new BoardDao();
