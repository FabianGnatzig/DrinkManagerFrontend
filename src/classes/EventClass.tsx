import { BringBeer } from "./BeerClass";
import { Season } from "./SeasonClass";

export type SeasonEvent = {
  id: number;
  name: string;
  event_date: Date;
  season_id: number;
  season: Season;
  bring_beer: BringBeer[];
};
export type InputEvent = {
  name: string;
  event_date: string;
  season_id: number;
};
