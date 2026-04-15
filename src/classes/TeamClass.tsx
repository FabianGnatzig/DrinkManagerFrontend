import { Season } from "./SeasonClass";
import { User } from "./UserClass";

export type Team = {
  id: string;
  name: string;
  seasons: Season[];
  users: User[];
};

export type InputTeam = {
  name: string;
};
