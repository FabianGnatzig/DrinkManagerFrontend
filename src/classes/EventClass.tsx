import { BringBeer } from "./BeerClass";
import { Season } from "./SeasonClass";

export type SeasonEvent = {
  id: string;
  name: string;
  event_date: Date;
  season_id: string;
  season: Season;
  bring_beer: BringBeer[];
};
export type InputEvent = {
  name: string;
  event_date: string;
  season_id: string;
};

export type InputRecurringEvent = {
  name: string;
  event_date: string;
  season_id: string;
  weeks: number;
};
