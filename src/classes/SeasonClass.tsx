import { SeasonEvent } from "./EventClass";
import { Team } from "./TeamClass";

export type Season = {
  id: string;
  name: string;
  team_id: string;
  events: SeasonEvent[];
  team: Team;
};

export type InputSeason = {
  name: string;
  team_id: string;
};
