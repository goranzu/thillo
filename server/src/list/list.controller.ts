import { Controller } from "../common/types";
import listDao from "./list.dao";

class ListController {
  getListById: Controller = async (req, res) => {
    const memberId = res.locals.user.id;
    const listId = +req.params.listId;
    const boardId = +req.query.boardId!;

    const list = await listDao.find(listId, boardId, memberId);

    if (list == null) {
      res.status(404).end();
      return;
    }

    res.status(200).json({ data: list });
    return;
  };
}

export default new ListController();
