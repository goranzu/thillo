import { Controller } from "../common/types";
import listService from "./list.service";

class ListController {
  createList: Controller = async (req, res) => {
    const { name, description, boardId } = req.body;
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

  getListById: Controller = async (req, res) => {
    const memberId = res.locals.user.id;
    const { listId, boardId } = req.body;

    const list = await listService.getList({ memberId, boardId, listId });

    if (list == null) {
      res.status(404).end();
      return;
    }

    res.status(200).json({ data: list });
    return;
  };

  updateList: Controller = async (req, res) => {
    const memberId = res.locals.user.id;
    const { name, description, listId, boardId } = req.body;

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

  deleteList: Controller = async (req, res) => {
    const memberId = res.locals.user.id;
    const { listId, boardId } = req.body;

    await listService.deleteList(boardId, listId, memberId);

    res.status(204).end();
    return;
  };
}

export default new ListController();
