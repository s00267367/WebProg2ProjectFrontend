import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core'; 
import { Observable } from 'rxjs';
import { IDish, CreateDishDto, UpdateDishDto  } from '../models/dish.model';
@Injectable({
  providedIn: 'root',
})
export class DishService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/api/v1/dishes'; 

    getDishes(menuFilter?: string, specialFilter?: string): Observable<IDish[]> {
        let params = new HttpParams();

        //uses httpParams object to add params for query
        if(menuFilter){
            params = params.set('menu', menuFilter);
        }
        if(specialFilter !== undefined){
            params = params.set('special', specialFilter);
        }

        //an overload of .get which sends query params
        return this.http.get<IDish[]>(this.apiUrl, {params})
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
