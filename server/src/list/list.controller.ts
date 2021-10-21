import { Request, Response } from "express";
import {
  CreateListInput,
  DeleteListInput,
  GetListInput,
  UpdateListInput,
} from "../common/schemas/list.schema";
import { Controller } from "../common/types";
import * as listService from "./list.service";

const createList = async (
  req: Request<
    unknown,
    unknown,
    CreateListInput["body"],
    CreateListInput["query"]
  >,
  res: Response,
): Promise<void> => {
  const { name, description } = req.body;
  const { boardId } = req.query;
  const creatorId = res.locals.user.id;
  const list = await listService.createList({
    name,
    description,
    boardId,
    creatorId,
  });

  res.status(201).json({ data: list });
  return;
};

const getListById = async (
  req: Request<GetListInput["params"], unknown, unknown, GetListInput["query"]>,
  res: Response,
): Promise<void> => {
  const memberId = res.locals.user.id;
  const { boardId } = req.query;
  const { listId } = req.params;

  const list = await listService.getList({ memberId, boardId, listId });

  if (list == null) {
    res.status(404).end();
    return;
  }

  res.status(200).json({ data: list });
  return;
};

const updateList = async (
  req: Request<
    UpdateListInput["params"],
    unknown,
    UpdateListInput["body"],
    UpdateListInput["query"]
  >,
  res: Response,
): Promise<void> => {
  const memberId = res.locals.user.id;
  const { name, description } = req.body;
  const { listId } = req.params;
  const { boardId } = req.query;

  const list = await listService.updateList({
    boardId,
    listId,
    description,
    name,
    memberId,
  });

  res.status(200).json({ data: list });
  return;
};

const deleteList = async (
  req: Request<
    DeleteListInput["params"],
    unknown,
    unknown,
    DeleteListInput["query"]
  >,
  res: Response,
): Promise<void> => {
  const memberId = res.locals.user.id;
  const { listId } = req.params;
  const { boardId } = req.query;

  await listService.deleteList(boardId, listId, memberId);

  res.status(204).end();
  return;
};

export { createList, getListById, updateList, deleteList };

// class ListController {
//   createList: Controller = async (req, res) => {
//     const { name, description, boardId } = req.body;
//     const creatorId = res.locals.user.id;
//     const list = await listService.createList({
//       name,
//       description,
//       boardId,
//       creatorId,
//     });

//     res.status(201).json({ data: list });
//     return;
//   };

//   getListById: Controller = async (req, res) => {
//     const memberId = res.locals.user.id;
//     const { listId, boardId } = req.body;

//     const list = await listService.getList({ memberId, boardId, listId });

//     if (list == null) {
//       res.status(404).end();
//       return;
//     }

//     res.status(200).json({ data: list });
//     return;
//   };

//   updateList: Controller = async (req, res) => {
//     const memberId = res.locals.user.id;
//     const { name, description, listId, boardId } = req.body;

//     const list = await listService.updateList({
//       boardId,
//       listId,
//       description,
//       name,
//       memberId,
//     });

//     res.status(200).json({ data: list });
//     return;
//   };

//   deleteList: Controller = async (req, res) => {
//     const memberId = res.locals.user.id;
//     const { listId, boardId } = req.body;

//     await listService.deleteList(boardId, listId, memberId);

//     res.status(204).end();
//     return;
//   };
// }

// export default new ListController();
