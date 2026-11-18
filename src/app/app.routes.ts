import { Routes } from '@angular/router';
import { DishList } from './features/dishes/pages/dish-list/dish-list';
import { DishForm } from './features/dishes/pages/dish-form/dish-form';
import { DishDetails } from './features/dishes/pages/dish-details/dish-details';

export const routes: Routes = [
     {
    path: '',
    redirectTo: 'dishes',
    pathMatch: 'full'
  },
  {
    path: 'dishes',
    component: DishList
  },
  {
    path: 'dishes/new',
    component: DishForm
  },
  {
    path: 'dishes/:id',
    component: DishDetails
  },
  {
    path: 'dishes/:id/edit',
    component: DishForm
  }
];
