import { Component, inject, input, signal, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { CreateDishDto, IIngredient, IAllergen } from '../../models/dish.model';
import { DishService } from '../../services/dish-service';
import { notBlank } from '../../../../shared/validators/not-blank.validator';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelect, MatSelectModule, MatOption } from '@angular/material/select';
import { MatRadioButton, MatRadioModule, MatRadioGroup } from '@angular/material/radio';


// FormGroup representing one ingredient
type IngredientForm = FormGroup<{
  name: FormControl<string>;
  quantity: FormControl<string>;
}>;

// FormGroup representing one allergen
type AllergenForm = FormGroup<{
  name: FormControl<string>;
  ingredients: FormArray<FormControl<string>>;
}>;

@Component({
  selector: 'app-dish-form',
  imports: [
    RouterLink, FormsModule, ReactiveFormsModule, 
    MatButtonModule, MatFormFieldModule, MatInputModule,
    MatCardModule, MatProgressBarModule, MatSelect, MatSelectModule, 
    MatOption, MatRadioButton, MatRadioGroup, MatSelectModule,
    MatRadioModule
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

  private formBuilder = inject(FormBuilder);
  dishForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, notBlank, Validators.minLength(2), Validators.maxLength(30)]],
    price: this.formBuilder.nonNullable.control<number>(0, [Validators.required, Validators.min(1)]),
    availability: this.formBuilder.nonNullable.group({
      menu:  ['', [Validators.required, notBlank]],
      special: [false]
    }),
    ingredients: this.formBuilder.array<IngredientForm>([]),
    allergens: this.formBuilder.array<AllergenForm>([])
  });


  onSubmit(): void {
    this.dishForm.disable();
    const { name, price, availability, ingredients, allergens } = this.dishForm.getRawValue();
    const newDish: CreateDishDto = { name, price, availability, ingredients, allergens };

    this.saving.set(true);
    this.saveError.set(null);

    const id = this.id();

    const request = id
      ? this.dishService.updateDish(id, newDish)
      : this.dishService.addDish(newDish);

    console.log(newDish);
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
      next: (dish) =>{
        this.dishForm.patchValue({ 
          name: dish.name, 
          price: dish.price, availability: 
          dish.availability 
        });

        this.ingredients.clear();

        dish.ingredients.forEach(ingredient => {
          this.ingredients.push(this.createIngredient(ingredient));
        });

        this.allergens.clear();

        dish.allergens.forEach(allergen => {
          this.allergens.push(this.createAllergen(allergen));
        });

      },
      error: (err: Error) => this.saveError.set(err.message),
    });
  }

  //ingredients methods for form array
  createIngredient(ingredient?: IIngredient): IngredientForm {
    return this.formBuilder.nonNullable.group({
      name: [ingredient?.name ?? '', Validators.required],
      quantity: [ingredient?.quantity ?? '', Validators.required]
    });
  }

  get ingredients(): FormArray<IngredientForm> {
    return this.dishForm.controls.ingredients;
  }

  addIngredient(): void {
    this.ingredients.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    this.ingredients.removeAt(index);
  }

  //allergend method for form array
  createAllergen(allergen?: IAllergen): AllergenForm {
    return this.formBuilder.nonNullable.group({
      name: [allergen?.name ?? '', Validators.required],
      ingredients: this.formBuilder.array(
      allergen?.ingredients.map(ingredient =>
        this.formBuilder.nonNullable.control(ingredient)) ?? []
      )
    });
  }

  get allergens(): FormArray<AllergenForm> {
    return this.dishForm.controls.allergens;
  }

  addAllergen(): void {
    this.allergens.push(this.createAllergen());
  }

  removeAllergen(index: number): void {
    this.allergens.removeAt(index);
  }

  //for ingredients in allergen object
  getAllergenIngredients(index: number): FormArray<FormControl<string>> {
    return this.allergens.at(index).controls.ingredients;
  }

  addAllergenIngredient(index: number): void {
    this.getAllergenIngredients(index).push(
      this.formBuilder.nonNullable.control('')
    );
  }

  removeAllergenIngredient(allergenIndex: number, ingredientIndex: number): void {
    this.getAllergenIngredients(allergenIndex).removeAt(ingredientIndex);
  }
}
