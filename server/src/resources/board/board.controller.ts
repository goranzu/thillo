import { Controller } from "../../types";
import { NotFoundError } from "../../utils/errors";
import * as boardService from "./board.service";

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

export { httpGetAll, httpCreateOne, httpGetOne };
