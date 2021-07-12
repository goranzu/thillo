import { Controller } from "../../types";
import { NotFoundError } from "../../utils/errors";
import * as listService from "./list.service";

const httpGetAll: Controller<Record<string, never>> = async (req, res) => {
  const { id } = req.user;
  const lists = await listService.getAllListsFromUser(id);
  res.status(200).json({ data: lists });
  return;
};

const httpCreateOne: Controller<{
  name: string;
  description?: string;
  boardId: number;
}> = async (req, res) => {
  const { name, description, boardId } = req.body;
  const { id } = req.user;

  const list = await listService.createList({
    name,
    description,
    boardId,
    creatorId: id,
  });

  res.status(200).json({ data: list });
  return;
};

const httpGetOne: Controller<Record<string, never>> = async (req, res) => {
  const { id } = req.user;
  const { listId } = req.params;
  const list = await listService.getOne(Number(listId), id);

  if (list == null) {
    throw new NotFoundError("Board not found.");
  }

  res.status(200).json({ data: list });
  return;
};

export interface UpdateBoardBody {
  name?: string;
  description?: string;
  isPrivate?: boolean;
}

// const httpUpdateOne: Controller<UpdateBoardBody> = async (req, res) => {
//   const { id } = req.user;
//   const { boardId } = req.params;
//   const { name, description, isPrivate } = req.body;

//   const board = await listService.updateOne({
//     boardId: Number(boardId),
//     userId: id,
//     name,
//     description,
//     isPrivate,
//   });

//   res.status(200).json({ data: board });
//   return;
// };

// const httpDeleteOne: Controller<Record<string, never>> = async (req, res) => {
//   const { boardId } = req.params;
//   const { id } = req.user;

//   await listService.deleteOne(Number(boardId), id);

//   res.status(204).end();
//   return;
// };

export { httpGetAll, httpCreateOne, httpGetOne };
