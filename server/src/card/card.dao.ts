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
}

export { create };
