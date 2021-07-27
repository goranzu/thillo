import * as listService from "../list/list.service";
import { BadUserInputError } from "../common/errors";
import { Controller } from "../common/types";
import * as boardService from "./board.service";

const list: Controller = async (req, res) => {
  const boards = await boardService.listUsersBoards(res.locals.user.id);
  res.status(200).json({ data: boards });
};

const createBoard: Controller = async (req, res) => {
  const { name, description } = req.body;
  const creatorId = res.locals.user.id;
  const boards = await boardService.create({ name, description, creatorId });

  res.status(200).json({ data: boards });
};

const getById: Controller = async (req, res) => {
  const board = await boardService.findBoardIfMember(
    res.locals.user.id,
    req.body.boardId,
  );
  res.status(200).json({ data: board });
};

const updateBoard: Controller = async (req, res) => {
  const creatorId = res.locals.user.id;
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

const deleteBoard: Controller = async (req, res) => {
  const creatorId = res.locals.user.id;
  const { boardId } = req.body;
  await boardService.deleteBoard(boardId, creatorId);
  res.status(204).end();
};

const getListFromBoard: Controller = async (req, res) => {
  const { boardId, listId } = req.body;
  const { id } = res.locals.user;

  const list = await listService.getList({ listId, boardId, memberId: id });

  res.status(200).json({ data: list });
  return;
};

const addMemberToBoard: Controller = async (req, res) => {
  const { id } = res.locals.user;
  const { email, boardId } = req.body;

  const board = await boardService.addMemberToBoard(boardId, email, id);

  res.status(200).json({ data: board });
  return;
};

const removeMemberFromBoard: Controller = async (req, res) => {
  const { boardId, memberId } = req.body;
  const { id } = res.locals.user;

  if (id === memberId) {
    throw new BadUserInputError();
  }

  await boardService.removeMember(boardId, id, memberId);

  res.status(204).end();
  return;
};

export {
  list,
  createBoard,
  getById,
  updateBoard,
  deleteBoard,
  getListFromBoard,
  addMemberToBoard,
  removeMemberFromBoard,
};

// class BoardController {
//   list: Controller = async (req, res) => {
//     const boards = await boardService.listUsersBoards(res.locals.user.id);
//     res.status(200).json({ data: boards });
//   };

//   createBoard: Controller = async (req, res) => {
//     const { name, description } = req.body;
//     const creatorId = res.locals.user.id;
//     const boards = await boardService.create({ name, description, creatorId });

//     res.status(200).json({ data: boards });
//   };

//   getById: Controller = async (req, res) => {
//     const board = await boardService.findBoardIfMember(
//       res.locals.user.id,
//       req.body.boardId,
//     );
//     res.status(200).json({ data: board });
//   };

//   updateBoard: Controller = async (req, res) => {
//     const creatorId = res.locals.user.id;
//     const { boardId, name, description, isPrivate } = req.body;
//     const board = await boardService.updateBoard({
//       creatorId,
//       boardId,
//       name,
//       description,
//       isPrivate,
//     });
//     res.status(200).json({ data: board });
//   };

//   deleteBoard: Controller = async (req, res) => {
//     const creatorId = res.locals.user.id;
//     const { boardId } = req.body;
//     await boardService.deleteBoard(boardId, creatorId);
//     res.status(204).end();
//   };

//   getListFromBoard: Controller = async (req, res) => {
//     const { boardId, listId } = req.body;
//     const { id } = res.locals.user;

//     const list = await listService.getList({ listId, boardId, memberId: id });

//     res.status(200).json({ data: list });
//     return;
//   };

//   addMemberToBoard: Controller = async (req, res) => {
//     const { id } = res.locals.user;
//     const { email, boardId } = req.body;

//     const board = await boardService.addMemberToBoard(boardId, email, id);

//     res.status(200).json({ data: board });
//     return;
//   };

//   removeMemberFromBoard: Controller = async (req, res) => {
//     const { boardId, memberId } = req.body;
//     const { id } = res.locals.user;

//     if (id === memberId) {
//       throw new BadUserInputError();
//     }

//     await boardService.removeMember(boardId, id, memberId);

//     res.status(204).end();
//     return;
//   };
// }

// export default new BoardController();
