import { Controller } from "../../types";
import { NotFoundError } from "../../utils/errors";
import * as boardService from "./board.service";
import * as listService from "../list/list.service";

const httpGetAll: Controller<Record<string, never>> = async (req, res) => {
  const { id } = req.user;
  const boards = await boardService.getAll(id);
  res.status(200).json({ data: boards });
  return;
};

const httpCreateOne: Controller<{ name: string; description?: string }> =
  async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.user;
    const board = await boardService.createOne({
      description,
      name,
      userId: id,
    });

    await listService.createDefaultLists(board.id, id);

    res.status(200).json({ data: board });
    return;
  };

const httpGetOne: Controller<Record<string, never>> = async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.params;
  const board = await boardService.getOne(id, Number(boardId));

  if (board == null) {
    throw new NotFoundError("Board not found.");
  }

  res.status(200).json({ data: board });
  return;
};

export interface UpdateBoardBody {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

const httpUpdateOne: Controller<UpdateBoardBody> = async (req, res) => {
  const { id } = req.user;
  const { boardId } = req.params;
  const { name, description, isPrivate } = req.body;

  const board = await boardService.updateOne({
    boardId: Number(boardId),
    userId: id,
    name,
    description,
    isPrivate,
  });

  res.status(200).json({ data: board });
  return;
};

const httpDeleteOne: Controller<Record<string, never>> = async (req, res) => {
  const { boardId } = req.params;
  const { id } = req.user;

  await boardService.deleteOne(Number(boardId), id);

  res.status(204).end();
  return;
};

export { httpGetAll, httpCreateOne, httpGetOne, httpUpdateOne, httpDeleteOne };
