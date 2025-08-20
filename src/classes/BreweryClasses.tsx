import { Beer } from "./BeerClass";

export type Brewery = {
  id: number;
  name: string;
  city: string;
  country: string;
  beers: Beer[];
};

export type InputBrewery = {
  name: string;
  city: string;
  country: string;
};
