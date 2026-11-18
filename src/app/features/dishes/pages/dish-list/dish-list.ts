import { Component, inject } from '@angular/core';
import { DishService } from '../../services/dish-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLoadState } from '../../../../shared/load-state';
import { DishCard } from '../dish-card/dish-card';

@Component({
  selector: 'app-dish-list',
  imports: [DishCard],
  templateUrl: './dish-list.html',
  styleUrl: './dish-list.scss',
})
export class DishList {
  private dishService = inject(DishService);
  
  state = toSignal(withLoadState(this.dishService.getDishes()), { requireSync: true });
}
