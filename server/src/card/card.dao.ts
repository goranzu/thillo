import prisma from "../common/client";
import pool from "../db/pool";

interface CreateCardDto {
  title: string;
  description: string;
  attachment?: string;
  listId: number;
  creatorId: number;
}

interface Card extends Omit<CreateCardDto, "attachment"> {}

async function create(data: CreateCardDto): Promise<Card | undefined> {
  const createdCard = await pool.query(
    `
        INSERT INTO cards (title, description, "listId", "creatorId")
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `,
    [data.title, data.description, data.listId, data.creatorId],
  );

  if (data.attachment) {
    await pool.query(
      `
        INSERT INTO "cardAttachments" (url, "cardId")
        VALUES ($1, $2);
      `,
      [data.attachment, createdCard?.rows[0].id],
    );
  }

  return createdCard?.rows[0];
  //   if (data.attachment) {
  //     const card = await prisma.card.create({
  //       data: {
  //         ...data,
  //         attachments: {
  //           create: {
  //             url: data.attachment,
  //           },
  //         },
  //       },
  //     });
  //     return card;
  //   }

  //   const card = await prisma.card.create({
  //     data,
  //   });
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
