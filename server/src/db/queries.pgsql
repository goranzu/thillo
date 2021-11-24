SELECT
    *
FROM
    users;

SELECT
    *
FROM
    boards;

-- SELECT
--     *
-- FROM
--     boards
-- WHERE
--     "creatorId" = 22
--     AND id = 21;
-- INSERT INTO "boardMembers" ("memberId", "boardId")
--     VALUES (12, 20);

-- Query for finding board with its memebers and creator
SELECT
    b.id "boardId",
    b.name "boardName",
    u.id "memberId",
    u."firstName",
    u."lastName",
    u2.id "creatorId",
    u2."firstName" "creatorFirstName",
    u2."firstName" "creatorLastName"
FROM
    "boards" b
    LEFT JOIN "boardMembers" bm ON bm."boardId" = 10
    LEFT JOIN "users" u ON u.id = bm."memberId"
    LEFT JOIN "users" u2 ON u2.id = b."creatorId"
WHERE
    b.id = 10;
