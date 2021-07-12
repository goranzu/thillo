import { List } from "@prisma/client";
import prisma from "../../client";
import { NotFoundError } from "../../utils/errors";

interface DefaultListItem {
  name: string;
  description?: string;
  boardId: number;
  creatorId: number;
}

async function createDefaultLists(
  boardId: number,
  creatorId: number,
): Promise<void> {
  const defaultLists: DefaultListItem[] = [
    {
      name: "To Do",
      boardId,
      creatorId,
    },
    {
      name: "Current",
      boardId,
      creatorId,
    },
    {
      name: "Done",
      boardId,
      creatorId,
    },
  ];

  await prisma.list.createMany({ data: defaultLists });
  return;
}

async function getOne(
  listId: number,
  userId: number,
  boardId: number,
): Promise<List> {
  // Finds the list only if the logged in user is a member of the board
  const list = await prisma.list.findFirst({
    where: {
      id: listId,
      AND: {
        boardId,
        AND: {
          board: {
            members: {
              some: {
                memberId: userId,
                boardId,
              },
            },
          },
        },
      },
    },
  });

  if (list == null) {
    throw new NotFoundError("List not found.");
  }

  return list;
}

export { createDefaultLists, getOne };
