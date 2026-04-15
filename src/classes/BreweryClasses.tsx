import { Beer } from "./BeerClass";

export type Brewery = {
  id: string;
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
