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

export { createDefaultLists };
