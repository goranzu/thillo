import prisma from "../common/client";

interface CreateCardDto {
  title: string;
  description: string;
  attachment?: string;
  listId: number;
  creatorId: number;
}

async function create(data: CreateCardDto) {
  if (data.attachment) {
    const card = await prisma.card.create({
      data: {
        ...data,
        attachments: {
          create: {
            url: data.attachment,
          },
        },
      },
    });
    return card;
  }

  const card = await prisma.card.create({
    data,
  });

  return card;
}

export { create };

// class CardDao {
//   async create(data: CreateCardDto) {
//     if (data.attachment) {
//       const card = await prisma.card.create({
//         data: {
//           ...data,
//           attachments: {
//             create: {
//               url: data.attachment,
//             },
//           },
//         },
//       });
//       return card;
//     }

//     const card = await prisma.card.create({
//       data,
//     });

//     return card;
//   }
// }
