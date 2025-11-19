import { connection } from "../connection";

import {
  selectCountOfUsersTemplate,
  selectUsersWithAddressTemplate,
  selectUserByIdTemplate,
} from "./query-templates";
import { Address, User } from "./types";

interface UserRow {
  id: string;
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

// State abbreviation to full name mapping
const STATE_NAMES: Record<string, string> = {
  // US States
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming',
  // Canadian Provinces
  'AB': 'Alberta', 'BC': 'British Columbia', 'MB': 'Manitoba', 'NB': 'New Brunswick',
  'NL': 'Newfoundland and Labrador', 'NS': 'Nova Scotia', 'NT': 'Northwest Territories',
  'NU': 'Nunavut', 'ON': 'Ontario', 'PE': 'Prince Edward Island', 'QC': 'Quebec',
  'SK': 'Saskatchewan', 'YT': 'Yukon',
  // Already full names (pass through)
  'Alabama': 'Alabama', 'Alaska': 'Alaska', 'Arizona': 'Arizona', 'Arkansas': 'Arkansas',
  'California': 'California', 'Colorado': 'Colorado', 'Connecticut': 'Connecticut',
  'Delaware': 'Delaware', 'Florida': 'Florida', 'Georgia': 'Georgia', 'Hawaii': 'Hawaii',
  'Idaho': 'Idaho', 'Illinois': 'Illinois', 'Indiana': 'Indiana', 'Iowa': 'Iowa',
  'Kansas': 'Kansas', 'Kentucky': 'Kentucky', 'Louisiana': 'Louisiana', 'Maine': 'Maine',
  'Maryland': 'Maryland', 'Massachusetts': 'Massachusetts', 'Michigan': 'Michigan',
  'Minnesota': 'Minnesota', 'Mississippi': 'Mississippi', 'Missouri': 'Missouri',
  'Montana': 'Montana', 'Nebraska': 'Nebraska', 'Nevada': 'Nevada', 'New Hampshire': 'New Hampshire',
  'New Jersey': 'New Jersey', 'New Mexico': 'New Mexico', 'New York': 'New York',
  'North Carolina': 'North Carolina', 'North Dakota': 'North Dakota', 'Ohio': 'Ohio',
  'Oklahoma': 'Oklahoma', 'Oregon': 'Oregon', 'Pennsylvania': 'Pennsylvania',
  'Rhode Island': 'Rhode Island', 'South Carolina': 'South Carolina', 'South Dakota': 'South Dakota',
  'Tennessee': 'Tennessee', 'Texas': 'Texas', 'Utah': 'Utah', 'Vermont': 'Vermont',
  'Virginia': 'Virginia', 'Washington': 'Washington', 'West Virginia': 'West Virginia',
  'Wisconsin': 'Wisconsin', 'Wyoming': 'Wyoming',
  'Alberta': 'Alberta', 'British Columbia': 'British Columbia', 'Manitoba': 'Manitoba',
  'New Brunswick': 'New Brunswick', 'Newfoundland and Labrador': 'Newfoundland and Labrador',
  'Nova Scotia': 'Nova Scotia', 'Northwest Territories': 'Northwest Territories',
  'Nunavut': 'Nunavut', 'Ontario': 'Ontario', 'Prince Edward Island': 'Prince Edward Island',
  'Quebec': 'Quebec', 'Saskatchewan': 'Saskatchewan', 'Yukon': 'Yukon',
};

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

  const stateTrimmed = state.trim();
  const fullStateName = STATE_NAMES[stateTrimmed] || stateTrimmed;

  return {
    id: address_id.trim(),
    user_id: user_id?.trim() || "",
    street: street.trim(),
    state: fullStateName,
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

export const getUserById = (userId: string | number): Promise<User | null> =>
  new Promise((resolve, reject) => {
    connection.get<UserRow>(
      selectUserByIdTemplate,
      [userId],
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          resolve(null);
          return;
        }

        const address = formatAddress(
          result.address_id,
          result.user_id,
          result.street,
          result.state,
          result.city,
          result.zipcode
        );

        const user: User = {
          id: result.id,
          name: result.name,
          username: result.username,
          email: result.email,
          phone: result.phone,
          ...(address && { address }),
        };

        resolve(user);
      }
    );
  });
