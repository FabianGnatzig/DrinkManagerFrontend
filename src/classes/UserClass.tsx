import { Team } from "./TeamClass";

export type User = {
  id: string;
  team_id: string;
  username: string;
  first_name: string;
  last_name: string;
  birthday: Date;
  password: string;
  role: string;
  team: Team;
};

export type InputUser = {
  username: string;
  team_id: string;
  first_name: string;
  last_name: string;
  birthday: string;
  password: string;
  role: string;
};
