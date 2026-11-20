import { Component, inject } from '@angular/core';
import { DishService } from '../../services/dish-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLoadState } from '../../../../shared/load-state';
import { DishCard } from '../dish-card/dish-card';
import { RouterLink } from '@angular/router';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-dish-list',
  imports: [DishCard, RouterLink, MatButton, MatFabButton, MatIcon],
  templateUrl: './dish-list.html',
  styleUrl: './dish-list.scss',
})
export class DishList {
  private dishService = inject(DishService);
  
  state = toSignal(withLoadState(this.dishService.getDishes()), { requireSync: true });
}
