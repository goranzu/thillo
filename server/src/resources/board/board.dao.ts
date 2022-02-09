import { buildUpdateQuery } from "../../common/utils";
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

/* TODO:
- Boards may only be accessed by the creator of the board or members of the board
*/
async function list(userId: number): Promise<BoardModel[] | undefined> {
  // This function should list the boards the user has created and is a member of.
  /*
        select *
        from boards b
        where creator_id = $1
        and b.board_id in (
            select board_id
            from board_members
            where member_id = $1
        );
    */
  const boards = await BoardModel.query()
    .select("*")
    .where("creator_id", "=", userId)
    .where(
      "board_id",
      "in",
      BoardModel.knexQuery()
        .from("board_members")
        .where("member_id", "=", userId),
    );
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

async function update(
  data: UpdateBoardDto,
  conditions: { id: number; creatorId: number },
): Promise<Board | undefined> {
  // Filter out null of undefined
  //   Should update the board details: name, description, isPrivate
  const updatedBoard = await BoardModel.query().patch();
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
  update,
  deleteBoard,
  addMember,
  removeMember,
  findMember,
  findBoardCreator,
};
