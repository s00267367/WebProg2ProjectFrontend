import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateDishDto } from '../../models/dish.model';
import { DishService } from '../../services/dish-service';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect, MatOption } from '@angular/material/select';
@Component({
  selector: 'app-dish-form',
  imports: [
    RouterLink, 
    FormsModule, 
    ReactiveFormsModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatSelect, MatOption
  ],
  templateUrl: './dish-form.html',
  styleUrl: './dish-form.scss',
})
export class DishForm {
  saving = signal(false);
  saveError = signal<string | null>(null);
  readonly id = input<string>();  // note this is optional by default
  
  private snackBar = inject(MatSnackBar);
  private dishService = inject(DishService);
  private router = inject(Router);

  readonly currentYear = new Date().getFullYear();

  private formBuilder = inject(FormBuilder);
  dishForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, notBlank, Validators.minLength(2), Validators.maxLength(30)]],
    price: this.formBuilder.nonNullable.control<number>(0, [Validators.required, Validators.min(1)]),
    menu:  ['', [Validators.required, notBlank, Validators.maxLength(30)]],
  });


  onSubmit(): void {
    this.dishForm.disable();
    const { name, price, menu } = this.dishForm.getRawValue();
    const newDish: CreateDishDto = { name, price, menu };

    this.saving.set(true);
    this.saveError.set(null);

    const id = this.id();

    const request = id
      ? this.dishService.updateDish(id, newDish)
      : this.dishService.addDish(newDish);

    request.subscribe({
      next: (response) => {
        this.snackBar.open(`${newDish.name} saved`, 'Close', { duration: 10000 });
        console.log('Dish added successfully:', response);
        this.router.navigate(['/dishes']);
      },
      error: (err: Error) => {
        this.saveError.set(err.message);
        this.saving.set(false);
        this.dishForm.enable();
      },
    });
  }

  ngOnInit(): void {
    const id = this.id();
    if (!id) return; // adding a new dish, nothing to load

    this.dishService.getDishById(id).subscribe({
      next: (dish) =>
        this.dishForm.patchValue({ name: dish.name, price: dish.price, menu: dish.availability.menu }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

}
