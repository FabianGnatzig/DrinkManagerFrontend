export type OpenBeerClass = {
  user: string;
  user_id: number;
  user_beer_id: number;
  kind: string;
};

export type UserBeerAmount = {
  user: string;
  amount: number;
  included_fine: number;
};
