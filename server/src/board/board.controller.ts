import listService from "../list/list.service";
import { BadUserInputError } from "../common/errors";
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
