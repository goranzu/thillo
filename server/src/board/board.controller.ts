import listService from "../list/list.service";
import { BadUserInputError } from "../utils/errors";
import { Controller } from "../common/types";
import boardService from "./board.service";

class BoardController {
  list: Controller = async (req, res) => {
    const boards = await boardService.listUsersBoards(req.user.id);
    res.status(200).json({ data: boards });
  };

  createBoard: Controller = async (req, res) => {
    const { name, description } = req.body;
    const creatorId = req.user.id;
    const boards = await boardService.create({ name, description, creatorId });

    res.status(200).json({ data: boards });
  };

  getById: Controller = async (req, res) => {
    const board = await boardService.findBoardIfMember(
      req.user.id,
      req.body.boardId,
    );
    res.status(200).json({ data: board });
  };

  updateBoard: Controller = async (req, res) => {
    const creatorId = req.user.id;
    const { boardId, name, description, isPrivate } = req.body;
    const board = await boardService.updateBoard({
      creatorId,
      boardId,
      name,
      description,
      isPrivate,
    });
    res.status(200).json({ data: board });
  };

  deleteBoard: Controller = async (req, res) => {
    const creatorId = req.user.id;
    const { boardId } = req.body;
    await boardService.deleteBoard(boardId, creatorId);
    res.status(204).end();
  };

  getListFromBoard: Controller = async (req, res) => {
    const { boardId, listId } = req.body;
    const { id } = req.user;

    const list = await listService.getList(listId, id, boardId);

    res.status(200).json({ data: list });
    return;
  };

  addMemberToBoard: Controller = async (req, res) => {
    const { id } = req.user;
    const { email, boardId } = req.body;

    const board = await boardService.addMemberToBoard(boardId, email, id);

    res.status(200).json({ data: board });
    return;
  };

  removeMemberFromBoard: Controller = async (req, res) => {
    const { boardId, memberId } = req.body;
    const { id } = req.user;

    if (id === memberId) {
      throw new BadUserInputError();
    }

    await boardService.removeMember(boardId, id, memberId);

    res.status(204).end();
    return;
  };
}

export default new BoardController();

// const httpGetAll: Controller = async (req, res) => {
//   const { id } = req.user;
//   const boards = await boardService.getAll(id);
//   res.status(200).json({ data: boards });
//   return;
// };

// const httpCreateOne: Controller = async (req, res) => {
//   const { name, description } = req.body;
//   const { id } = req.user;
//   const board = await boardService.createOne({
//     description,
//     name,
//     userId: id,
//   });

//   await listService.createDefaultLists(board.id, id);

//   res.status(200).json({ data: board });
//   return;
// };

// const httpGetOne: Controller = async (req, res) => {
//   const { id } = req.user;
//   const { boardId } = req.params;

//   const board = await boardService.getOne(id, Number(boardId));

//   res.status(200).json({ data: board });
//   return;
// };

// export interface UpdateBoardBody {
//   name?: string;
//   description?: string;
//   isPrivate?: boolean;
// }

// const httpUpdateOne: Controller = async (req, res) => {
//   const { id } = req.user;
//   const { boardId } = req.params;
//   const { name, description, isPrivate } = req.body;

//   const board = await boardService.updateOne({
//     boardId: Number(boardId),
//     userId: id,
//     name,
//     description,
//     isPrivate,
//   });

//   res.status(200).json({ data: board });
//   return;
// };

// const httpDeleteOne: Controller = async (req, res) => {
//   const { boardId } = req.params;
//   const { id } = req.user;

//   await boardService.deleteOne(Number(boardId), id);

//   res.status(204).end();
//   return;
// };

// const httpGetList: Controller = async (req, res) => {
//   const { boardId, listId } = req.params;
//   const { id } = req.user;

//   const list = await listService.getOne(Number(listId), id, Number(boardId));

//   res.status(200).json({ data: list });
//   return;
// };

// const httpAddMember: Controller = async (req, res) => {
//   const { boardId } = req.params;
//   const { id } = req.user;
//   const { email } = req.body;

//   const board = await boardService.addMember(Number(boardId), email, id);

//   res.status(200).json({ data: board });
//   return;
// };

// const httpRemoveMember: Controller = async (req, res) => {
//   const { boardId, memberId } = req.params;
//   const { id } = req.user;

//   if (id === Number(memberId)) {
//     throw new BadUserInputError();
//   }

//   await boardService.removeMember(Number(boardId), id, Number(memberId));

//   res.status(204).end();
//   return;
// };

// export {
//   httpGetAll,
//   httpCreateOne,
//   httpGetOne,
//   httpUpdateOne,
//   httpDeleteOne,
//   httpGetList,
//   httpAddMember,
//   httpRemoveMember,
// };
