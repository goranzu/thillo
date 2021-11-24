import { buildUpdateQuery } from "../common/utils";
import pool from "../db/pool";
import { CreateBoardDto, UpdateBoardDto } from "./board.service";

export interface Board {
  id: number;
  name: string;
  isPrivate: boolean;
  description?: string;
  creatorId?: number;
  createdAt?: string;
  updatedAt?: string;
}

async function list(userId: number): Promise<Board[] | undefined> {
  const boards = await pool.query(
    `
        SELECT id, name, "isPrivate", description
        FROM boards
        WHERE "creatorId" = $1
        ORDER BY "createdAt" DESC;
    `,
    [userId],
  );

  return boards?.rows;
}

async function create(data: CreateBoardDto): Promise<Board | undefined> {
  //   Also add an entry in the board_members table?

  const board = await pool.query(
    `
        INSERT INTO boards (name, description, "creatorId")
        VALUES ($1, $2, $3)
        RETURNING *;
    `,
    [data.name, data.description, data.creatorId],
  );

  return board?.rows[0];
}

async function findBoardByMemberId(
  creatorId: number,
  boardId: number,
): Promise<Board | undefined> {
  //   Finds board if logged in user is the creator or a member

  const databaseBoards = await pool.query(
    `
        SELECT
            b.id "boardId",
            b.name "boardName",
            u.id "memberId",
            u."firstName",
            u."lastName",
            u2.id "creatorId",
            u2."firstName" "creatorFirstName",
            u2."firstName" "creatorLastName"
        FROM
            "boards" b
            LEFT JOIN "boardMembers" bm ON bm."boardId" = $1
            LEFT JOIN "users" u ON u.id = bm."memberId"
            LEFT JOIN "users" u2 ON u2.id = b."creatorId"
        WHERE
            b.id = $1;
    `,
    [boardId],
  );

  //   const lists = await pool.query(
  //     `
  //       SELECT id, name, description, "createdAt", "updatedAt" FROM lists WHERE "boardId" = $1;
  //       `,
  //     [boardId],
  //   );
  //   const board = databaseBoards?.rows.reduce(
  //     (prev: Record<string, any>, acc) => {
  //       prev.id = acc.boardId;
  //       prev.name = acc.boardName;
  //       prev.creatorId = acc.creatorId;
  //       prev.creatorFirstName = acc.creatorFirstName;
  //       prev.creatorLastName = acc.creatorLastName;
  //       prev.members = [];
  //       if (acc.memberId) {
  //         prev.members.push({
  //           id: acc.memberId,
  //           firstName: acc.firstName,
  //           lastName: acc.lastName,
  //         });
  //       }
  //       return acc;
  //     },
  //     {},
  //   );
  const board = databaseBoards?.rows;
  console.log(board);
  //   board.lists = [];

  return board;
}

async function update(
  data: UpdateBoardDto,
  conditions: { id: number; creatorId: number },
): Promise<Board | undefined> {
  // Filter out null of undefined

  const q = buildUpdateQuery(data, conditions);

  const board = await pool.query((q.query += " RETURNING *"), q.values);

  return board?.rows[0];
}

async function deleteBoard(
  boardId: number,
  creatorId: number,
): Promise<boolean> {
  const result = await pool.query(
    `
        DELETE FROM boards
        WHERE id = $1 AND "creatorId" = $2;
    `,
    [boardId, creatorId],
  );
  console.log(result);

  return true;
}

async function findBoardCreator(
  boardId: number,
  creatorId: number,
): Promise<boolean> {
  const check = await pool.query(
    `
        SELECT id
        FROM boards
        WHERE id = $1 AND "creatorId" = $2
    `,
    [boardId, creatorId],
  );

  if (check?.rowCount && check.rowCount > 0) {
    return true;
  } else {
    return false;
  }
}

async function addMember(
  boardId: number,
  newMemberId: number,
): Promise<Board | undefined> {
  const board = await pool.query(
    `
        INSERT INTO "boardMembers" ("memberId", "boardId")
        VALUES ($1, $2)
        RETURNING *;
    `,
    [newMemberId, boardId],
  );
  console.log(board);
  return board?.rows[0];
}

async function removeMember(
  boardId: number,
  memberId: number,
): Promise<Board | undefined> {
  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  const result = await pool.query(
    `
        DELETE FROM "boardMembers"
        WHERE "memberId" = $1 AND "boardId" = $2
        RETURNING *;
  `,
    [memberId, boardId],
  );

  console.log(result);
  return result?.rows[0];
}

async function findMember(
  memberId: number,
  boardId: number,
): Promise<number | undefined> {
  const mem = await pool.query(
    `
        SELECT "memberId"
        FROM "boardMembers"
        WHERE "boardId" = $1 AND "memberId" = $2
    `,
    [boardId, memberId],
  );
  return mem?.rows[0];
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
  findBoardCreator,
};
