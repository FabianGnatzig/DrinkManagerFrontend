import { Brewery } from "./BreweryClasses";

export type BringBeer = {
  id: string;
  event_id: string;
  user_id: string;
  user_beer_id: string;
  beer_id: string;
  done: boolean;
};

export type InputBringBeer = {
  event_id: string;
  user_id: string;
  user_beer_id: string;
  beer_id: string;
};

export type UserBeer = {
  id: string;
  user_id: string;
  kind: string;
};

export type OpenUserBeer = {
  user_beer_id: string;
  user_id: string;
  user: string;
  kind: string;
};

export type InputUserBeer = {
  user_id: string;
  kind: string;
};

export type Beer = {
  id: string;
  name: string;
  beer_code: number;
  brewery_id: string;
  volume: number;
  alcohol: number;
  brewery: Brewery;
  bring_beer?: BringBeer[];
};

export type InputBeer = {
  name: string;
  beer_code: number;
  brewery_id: string;
  volume: number;
  alcohol: number;
};
