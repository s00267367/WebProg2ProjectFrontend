interface IIngredient {
  name: string;
  quantity: string;
}

interface IAllergen {
  name: string;
  ingredients: string[];
}

interface IAvailability {
  menu: string;
  special: boolean;
}

export interface IDish {
  _id: string,
  name: string;
  price: number;
  ingredients: IIngredient[];
  allergens: IAllergen[];
  availability: IAvailability;
}

export interface CreateDishDto {
  name: string;
  price: number;
  menu: string;
}

export interface UpdateDishDto {
  name: string;
  price: number;
  menu: string;
}