import { buildUpdateQuery } from "../common/utils";
import pool from "../db/pool";
import { CreateBoardDto, UpdateBoardDto } from "./board.service";
import BoardModel from "./board.model";
import UserModel from "../user/user.model";

export interface Board {
  id: number;
  name: string;
  isPrivate: boolean;
  description?: string;
  creatorId?: number;
  createdAt?: string;
  updatedAt?: string;
}

async function list(userId: number): Promise<BoardModel[] | undefined> {
  const boards = await BoardModel.query()
    .select("*")
    .where("creator_id", "=", userId)
    .orderBy("created_at", "DESC");
  return boards;
}

async function create(data: CreateBoardDto): Promise<BoardModel> {
  const board = await BoardModel.query().insert({
    name: data.name,
    description: data.description,
    creator_id: data.creatorId,
  });

  return board;
}

async function findBoardByMemberId(
  creatorId: number,
  boardId: number,
): Promise<BoardModel[]> {
  //   Finds board if logged in user is the creator or a member
  const boards = await UserModel.relatedQuery<BoardModel>("boards")
    .for(creatorId)
    .orderBy("created_at");

  return boards;
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
