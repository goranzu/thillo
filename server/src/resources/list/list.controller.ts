import { Controller } from "../../common/types";
import * as listService from "./list.service";

const createList: Controller = async (req, res): Promise<void> => {
  const { name, description } = req.body;
  const boardId = Number(req.query.boardId);
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

const getListById: Controller = async (req, res): Promise<void> => {
  const memberId = res.locals.user.id;
  const boardId = Number(req.query.boardId);
  const listId = Number(req.params.listId);

  const list = await listService.getList({ memberId, boardId, listId });

  if (list == null) {
    res.status(404).end();
    return;
  }

  res.status(200).json({ data: list });
  return;
};

const updateList: Controller = async (req, res): Promise<void> => {
  const memberId = res.locals.user.id;
  const { name, description } = req.body;
  const listId = Number(req.params.listId);
  const boardId = Number(req.query.boardId);

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

const deleteList: Controller = async (req, res): Promise<void> => {
  const listId = Number(req.params.listId);
  const boardId = Number(req.query.boardId);
  const memberId = res.locals.user.id;

  await listService.deleteList(boardId, listId, memberId);

  res.status(204).end();
  return;
};

export { createList, getListById, updateList, deleteList };
