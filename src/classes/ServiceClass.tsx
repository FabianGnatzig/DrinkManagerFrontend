export type OpenBeerClass = {
  user: string;
  user_id: string;
  user_beer_id: string;
  kind: string;
};

export type UserBeerAmount = {
  user: string;
  amount: number;
  included_fine: number;
};
