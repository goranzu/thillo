import CardModel from "./card.model";

interface CreateCardDto {
  title: string;
  description: string;
  attachment?: string;
  listId: number;
  creatorId: number;
}

interface Card extends Omit<CreateCardDto, "attachment"> {}

async function create(data: CreateCardDto): Promise<CardModel> {
  const card = await CardModel.query()
    .insert({
      title: data.title,
      description: data.description,
      list_id: data.listId,
      creator_id: data.creatorId,
    })
    .returning("*");

  return card;
}

async function deleteCard(
  userId: number,
  cardId: number,
  boardId: number,
): Promise<any> {
  // Only user that is a member of the board can delete a card
  /*
    delete from cards
    where card_id = $card_id
    and $userId in (
        select member_id
        from board_members
        where board_id = $boardId
        union is not necassary because creators of boards are also members
        union
        select creator_id
        from boards
        where board_id = $board_id
    )
  */
  const res = await CardModel.query()
    .delete()
    .where("card_id", "=", cardId)
    .andWhere(
      `${userId}`,
      "in",
      CardModel.knexQuery()
        .select("member_id")
        .from("board_members")
        .where("board_id", "=", boardId),
    );

  console.log(res);
  return res;
}

export { create, deleteCard };
