import { Component, input } from '@angular/core';
import { IDish } from '../../models/dish.model';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardContent, MatCardTitle, MatCardSubtitle, MatCardActions } from '@angular/material/card';
@Component({
  selector: 'app-dish-card',
  imports: [RouterLink, MatButton, MatCard, MatCardContent, MatCardHeader,  MatCardTitle, MatCardSubtitle, MatCardActions],
  templateUrl: './dish-card.html',
  styleUrl: './dish-card.scss',
})
export class DishCard {
  readonly dish = input.required<IDish>();
}
