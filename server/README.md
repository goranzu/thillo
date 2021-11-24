# User Stories

- [] User story: I can see list of available boards
- [] User story: I can create a new board with a cover photo, title and visibility options
- [] User story: I can see a board with different lists, team members,... according to the design
- [] User story: I can create a new list
- [] User story: I can add a new card to a existing list
- [] User story: I can set the visibility of the board
- [] User story: I can add a member to the board (user must exist in the system)
- [] User story: I can change the name of the board by selecting it
- [] User story: I can change/add the description of the board
- [] User story: Given I am an admin, I can remove members from the board
- [] User story: I can move a card from a column to another one by drag and drop
- [] User story: When a card is selected, I can rename the title by selecting it
- [] User story: When a card is selected, I can see which column the card belongs to
- [] User story: When a card is selected, I can see and change the description
- [] User story: When a card is selected, I can add new attachments and I can download and delete existing attachments
- [] User story: When a card is selected, I can add a new comment. Given I am the author, I can edit and delete the comment.
- [] User story: When a card is selected, I can change the card cover image by searching from Unsplash
- [] User story: When a card is selected, I can add labels with given colors

## Concepten

- Lists
- Boards
- Users
- Cards
- Comments

## Attributes

- cover photo (board and card)
- title
- visible
- members
- name (board name, list name, card name)
- description (board, card)
- title
- attachment (card)
- labels

## Boards

- [x] Return boards where the user is the creator or member.
- [x] Create board with cover photo, title, description and visibility.
- [ ] Return board with its list, cards and members.
  - List and members done.
- [x] Set visibility of board.
- [x] Add/Remove member to a board.
- [x] Update board title/description.
- [ ] Use unsplash for board cover images.

## Lists

- [x] CRUD on lists.
  - Need to test

## Cards

- [ ] Move cards from list to list.
- [ ] CRUD on card model.
- [ ] CRUD on card comments.
- [ ] Use unsplash for card cover images.
- [ ] Labels.
- [ ] Create/Delete attachments(upload).

## Admin

- [ ] Admin functionalty
