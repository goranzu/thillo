import { List } from "@prisma/client";
import prisma from "../../client";

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

async function getAllListsFromUser(userId: number): Promise<List[]> {
  const lists = await prisma.list.findMany({ where: { creatorId: userId } });
  return lists;
}

async function createList(data: DefaultListItem): Promise<List> {
  const list = await prisma.list.create({ data });
  return list;
}

async function getOne(listId: number, userId: number): Promise<List | any> {
  //   const list = await prisma.list.findUnique({ where: { id: listId } });
  const list = await prisma.board.findFirst({
    where: {
      members: {
        some: {
          memberId: userId,
        },
      },
      AND: {
        lists: {
          some: {
            id: listId,
          },
        },
      },
    },
    include: {
      lists: true,
    },
  });
  return list;
}

export { createDefaultLists, getAllListsFromUser, createList, getOne };
