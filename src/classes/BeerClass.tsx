import { Brewery } from "./BreweryClasses";

export type BringBeer = {
  id: number;
  event_id: number;
  user_id: number;
  user_beer_id: number;
  beer_id: number;
  done: boolean;
};

export type InputBringBeer = {
  event_id: number;
  user_id: number;
  user_beer_id: number;
  beer_id: number;
};

export type UserBeer = {
  id: number;
  user_id: number;
  kind: string;
};

export type OpenUserBeer = {
  user_beer_id: number;
  user_id: number;
  user: string;
  kind: string;
};

export type InputUserBeer = {
  user_id: number;
  kind: string;
};

export type Beer = {
  id: number;
  name: string;
  beer_code: number;
  brewery_id: number;
  volume: number;
  alcohol: number;
  brewery: Brewery;
  bring_beer?: BringBeer[];
};

export type InputBeer = {
  name: string;
  beer_code: number;
  brewery_id: number;
  volume: number;
  alcohol: number;
};
