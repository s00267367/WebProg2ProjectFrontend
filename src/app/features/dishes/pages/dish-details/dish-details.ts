import { Component, inject, input, signal } from '@angular/core';
import { IDish } from '../../models/dish.model';
import { DishService } from '../../services/dish-service';
import { switchMap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { LoadState, withLoadState } from '../../../../shared/load-state';
import { RouterLink, Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardTitle, MatCardSubtitle, MatCardHeader, MatCardContent } from '@angular/material/card';
@Component({
  selector: 'app-dish-details',
  imports: [
    RouterLink, MatButton,
    MatCard, MatCardActions,
    MatCardTitle, MatCardSubtitle,
    MatCardHeader,
    MatCardContent
],
  templateUrl: './dish-details.html',
  styleUrl: './dish-details.scss',
})
export class DishDetails {
  private dishService = inject(DishService);
  private readonly router = inject(Router);

  readonly id = input.required<string>();
  readonly deleting = signal(false);
  readonly deleteError = signal<string | null>(null);

  readonly initial: LoadState<IDish> = { status: 'loading' };

  state = toSignal(
    toObservable(this.id).pipe(
      switchMap((id) => withLoadState(this.dishService.getDishById(id))),
    ),
    { initialValue: this.initial },
  );

  deleteDish(dish: IDish): void {
    if (!confirm(`Delete ${dish.name} ${dish.availability.menu}?`)) return;

    this.deleting.set(true);
    this.deleteError.set(null);

    this.dishService.deleteDish(dish._id).subscribe({
      next: () => this.router.navigate(['/dishes']),
      error: (err: Error) => {
        this.deleteError.set(err.message);
        this.deleting.set(false);
      },
    });
  }
}
