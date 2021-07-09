import { Controller } from "../../types";

const httpGetAll: Controller<Record<string, never>> = async (req, res) => {
  res.status(200).end();
  return;
};

export { httpGetAll };
