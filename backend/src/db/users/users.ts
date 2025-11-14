import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersWithAddressTemplate,
} from "./query-templates";
import { Address, User } from "./types";

interface UserRow {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address_id: string | null;
  user_id: string | null;
  street: string | null;
  state: string | null;
  city: string | null;
  zipcode: string | null;
}

const formatAddress = (
  address_id: string | null,
  user_id: string | null,
  street: string | null,
  state: string | null,
  city: string | null,
  zipcode: string | null
): Address | undefined => {
  if (!address_id || !street || !state || !city || !zipcode) {
    return undefined;
  }

  return {
    id: address_id.trim(),
    user_id: user_id?.trim() || "",
    street: street.trim(),
    state: state.trim(),
    city: city.trim(),
    zipcode: zipcode.trim(),
  };
};

export const getUsersCount = (): Promise<number> =>
  new Promise((resolve, reject) => {
    connection.get<{ count: number }>(
      selectCountOfUsersTemplate,
      (error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results.count);
      }
    );
  });

export const getUsers = (
  pageNumber: number,
  pageSize: number
): Promise<User[]> =>
  new Promise((resolve, reject) => {
    connection.all<UserRow>(
      selectUsersWithAddressTemplate,
      [pageNumber * pageSize, pageSize],
      (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const users: User[] = results.map((row) => {
          const address = formatAddress(
            row.address_id,
            row.user_id,
            row.street,
            row.state,
            row.city,
            row.zipcode
          );

          return {
            id: row.id,
            name: row.name,
            username: row.username,
            email: row.email,
            phone: row.phone,
            ...(address && { address }),
          };
        });

        resolve(users);
      }
    );
  });
