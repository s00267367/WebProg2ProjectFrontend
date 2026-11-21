import { Component, inject } from '@angular/core';
import { DishService } from '../../services/dish-service';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLoadState } from '../../../../shared/load-state';
import { DishCard } from '../dish-card/dish-card';
import { RouterLink } from '@angular/router';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatFormField } from '@angular/material/select';
import { MatLabel } from '@angular/material/select';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
@Component({
  selector: 'app-dish-list',
  imports: [DishCard, RouterLink, MatButton, MatFabButton, MatIcon, MatSelect, 
    MatFormField, MatLabel, MatOption, FormsModule, 
    ReactiveFormsModule,  MatSelect, 
    MatOption,],
  templateUrl: './dish-list.html',
  styleUrl: './dish-list.scss',
})
export class DishList {
  private dishService = inject(DishService);
  
  state = toSignal(withLoadState(this.dishService.getDishes()), { requireSync: true });

  private formBuilder = inject(FormBuilder);
    filterForm = this.formBuilder.nonNullable.group({
      menu: ['', [Validators.required, notBlank, Validators.minLength(2), Validators.maxLength(30)]],
      special: this.formBuilder.nonNullable.control<string>('', [Validators.required, Validators.min(1)]),
    });

  onSubmit(): void {
    //Could not get to work in a way i understand
    /*
    const menu = this.filterForm.controls.menu.getRawValue();
    const special = this.filterForm.controls.special.getRawValue();

    this.state = toSignal(withLoadState(this.dishService.getDishes(menu, special)), { requireSync: true });
    */
  }
}
