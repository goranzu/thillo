import { number, object, string, TypeOf } from "zod";

export const createListSchema = object({
  body: object({
    name: string({
      required_error: "name is required",
    }).max(100),
    description: string({
      invalid_type_error: "description must be a string",
    })
      .max(1000)
      .optional(),
  }),
  query: object({
    boardId: number({ required_error: "boardId is required" }),
  }),
});

export const getListSchema = object({
  query: object({
    boardId: number({ required_error: "boardId is required" }),
  }),
  params: object({
    listId: number({ required_error: "listId is required" }),
  }),
});

export const deleteListSchema = object({
  query: object({
    boardId: number({ required_error: "boardId is required" }),
  }),
  params: object({
    listId: number({ required_error: "listId is required" }),
  }),
});

export const updateListSchema = object({
  body: object({
    name: string({
      invalid_type_error: "name must be a string",
    })
      .max(100)
      .optional(),
    description: string({
      invalid_type_error: "description must be a string",
    })
      .max(1000)
      .optional(),
  }),
  query: object({
    boardId: number({ required_error: "boardId is required" }),
  }),
  params: object({
    listId: number({ required_error: "listId is required" }),
  }),
});

export type CreateListInput = TypeOf<typeof createListSchema>;
export type GetListInput = TypeOf<typeof getListSchema>;
export type UpdateListInput = TypeOf<typeof updateListSchema>;
export type DeleteListInput = TypeOf<typeof deleteListSchema>;
