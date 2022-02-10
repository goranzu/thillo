import { CreateBoardDto, UpdateBoardDto } from "./board.service";
import BoardModel from "./board.model";

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
    .whereIn(
      "board_id",
      //   Select all the board_id's that user is member of
      BoardModel.knexQuery()
        .from("board_members")
        .where("member_id", "=", userId),
    );
  return boards;
}

async function create(data: CreateBoardDto): Promise<BoardModel> {
  // When creating a board you also become a member of a board
  const board = await BoardModel.query().insert({
    name: data.name,
    description: data.description,
    creator_id: data.creatorId,
  });

  //   Insert into the join table board_members
  await board.$relatedQuery("members").insert({ member_id: data.creatorId });

  return board;
}

async function update(
  data: UpdateBoardDto,
  conditions: { id: number; creatorId: number },
): Promise<BoardModel | null> {
  // Filter out null of undefined
  //   Should update the board details: name, description, isPrivate
  //   Only the creator of the board can update the board details
  const board = await BoardModel.query().findOne({
    board_id: conditions.id,
    creator_id: conditions.creatorId,
  });

  if (!board) {
    return null;
  }

  //   Update the board with details
  const updatedBoard = await board.$query().patchAndFetch({
    name: data.name,
    description: data.description,
    is_private: data.isPrivate,
  });

  return updatedBoard;
}

async function deleteBoard(
  boardId: number,
  creatorId: number,
): Promise<number> {
  // When a board is deleted cascading rules should remove related content.
  // Only the creator of the board can delete a board
  const result = await BoardModel.query()
    .delete()
    .where({ creator_id: creatorId, board_id: boardId });
  return result;
}

async function addMember(
  boardId: number,
  newMemberId: number,
): Promise<Board | undefined | any> {
  // make the connection in the board_members table
  const result = await BoardModel.relatedQuery("members")
    .for(boardId)
    .insert({ member_id: newMemberId });

  console.log(result);
  return result;
}

async function removeMember(
  boardId: number,
  creatorId: number,
  memberId: number,
): Promise<Board | undefined | any> {
  //   The logged in user is able to add members to a board only if this user als is the creator of the board
  //   Find the board, if board exists remove the member from the board
  const board = await BoardModel.query().findOne({
    board_id: boardId,
    creator_id: creatorId,
  });
  //   remove the join table entry
  const res = await board
    ?.$relatedQuery("members")
    .delete()
    .where("member_id", "=", memberId);

  console.log(res);
  return res;
}

export { list, create, update, deleteBoard, addMember, removeMember };
