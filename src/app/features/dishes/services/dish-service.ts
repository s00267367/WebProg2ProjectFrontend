import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core'; 
import { Observable } from 'rxjs';
import { IDish, CreateDishDto, UpdateDishDto  } from '../models/dish.model';
@Injectable({
  providedIn: 'root',
})
export class DishService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/v1/dishes'; 

    getDishes(): Observable<IDish[]> {
        return this.http
            .get<IDish[]>(this.apiUrl)
    }

    getDishById(id: string): Observable<IDish> {
        return this.http.get<IDish>(`${this.apiUrl}/${id}`)
    }

    addDish(dish: CreateDishDto): Observable<IDish> {
        return this.http.post<IDish>(this.apiUrl, dish)
    }
    
    updateDish(id: string, changes: UpdateDishDto): Observable<IDish> {
        return this.http.put<IDish>(`${this.apiUrl}/${id}`, changes);
    } 

    deleteDish(id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
