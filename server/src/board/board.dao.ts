import { UnauthorizedError } from "../common/errors";
import pool from "../db/pool";
import { CreateBoardDto, UpdateBoardDto } from "./board.service";

interface Board {
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
  memberId: number,
  boardId: number,
): Promise<Board | undefined> {
  //   Finds board if logged in user is the creator or a member
  const board = await pool.query(
    `
    SELECT id, name, "isPrivate", description, "creatorId", "createdAt" "updatedAt"
    FROM boards
    WHERE "creatorId" = $1 AND id = $2;
  `,
    [memberId, boardId],
  );
  console.log({ memberId, boardId });

  return board?.rows[0];
}

async function update(data: UpdateBoardDto): Promise<Board | undefined> {
  const board = await pool.query(
    `
        UPDATE boards
        SET name = $1
            "isPrivate" = $2
            description = $3
        WHERE id = $3 AND "creatorId" = $4;
    `,
    [data.name, data.isPrivate, data.description, data.boardId, data.creatorId],
  );

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

async function checkIfUserIsCreator(
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
  creatorId: number,
  newMemberId: number,
): Promise<boolean> {
  const isCreator = await checkIfUserIsCreator(boardId, creatorId);

  if (!isCreator) {
    throw new UnauthorizedError();
  }

  const result = await pool.query(
    `
        INSERT INTO "boardMembers" ("memberId", "boardId")
        VALUES ($1, $2);
    `,
    [newMemberId, boardId],
  );
  console.log(result);
  return true;
}

async function removeMember(
  boardId: number,
  creatorId: number,
  memberId: number,
): Promise<boolean> {
  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  const isCreator = await checkIfUserIsCreator(boardId, creatorId);
  if (!isCreator) {
    throw new UnauthorizedError();
  }

  const result = await pool.query(
    `
    DELETE FROM "boardMembers"
    WHERE "memberId" = $1 AND "boardId" = $2;
  `,
    [memberId, boardId],
  );

  console.log(result);
  return true;
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
};
