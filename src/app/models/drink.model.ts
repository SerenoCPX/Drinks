export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  [key: string]: any;
}

export interface DrinkApiResponse {
  drinks: Drink[] | null;
}

export interface Favorite {
  id?: string;
  idDrink: string;
  name: string;
  image: string;
  category?: string;
  rating: number;
  notes: string;
  createdAt: number;
}
