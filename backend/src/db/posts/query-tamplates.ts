export const selectPostsTemplate = `
SELECT *
FROM posts
WHERE user_id = ?
ORDER BY created_at DESC
`;

export const selectPostByIdTemplate = `
SELECT *
FROM posts
WHERE id = ?
`;

export const deletePostTemplate = `
DELETE FROM posts
WHERE id = ?
`;

export const insertPostTemplate = `
INSERT INTO posts (id, user_id, title, body, created_at)
VALUES (?, ?, ?, ?, ?)
`;
