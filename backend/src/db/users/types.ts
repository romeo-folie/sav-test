export interface Address {
  id: string;
  user_id: string;
  street: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  address?: Address;
}
