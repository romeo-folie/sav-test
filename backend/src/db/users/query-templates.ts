export const selectUsersTemplate = `
SELECT *
FROM users
ORDER BY name
LIMIT ?, ?
`;

export const selectUsersWithAddressTemplate = `
SELECT 
  users.id,
  users.name,
  users.username,
  users.email,
  users.phone,
  addresses.id as address_id,
  addresses.user_id,
  addresses.street,
  addresses.state,
  addresses.city,
  addresses.zipcode
FROM users
LEFT JOIN addresses ON users.id = addresses.user_id
ORDER BY users.name
LIMIT ?, ?
`;

export const selectCountOfUsersTemplate = `
SELECT COUNT(*) as count
FROM users
`;

export const selectUserByIdTemplate = `
SELECT
  users.id,
  users.name,
  users.username,
  users.email,
  users.phone,
  addresses.id as address_id,
  addresses.user_id,
  addresses.street,
  addresses.state,
  addresses.city,
  addresses.zipcode
FROM users
LEFT JOIN addresses ON users.id = addresses.user_id
WHERE users.id = ?
`;
